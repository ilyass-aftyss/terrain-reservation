package com.terrainreservation.service;

import com.terrainreservation.dto.ReservationDTO;
import com.terrainreservation.entity.*;
import com.terrainreservation.repository.ReservationRepository;
import com.terrainreservation.repository.UserRepository;
import com.terrainreservation.repository.TerrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private QrCodeService qrCodeService;

    @Transactional(readOnly = true)
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return convertToDTO(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationsByTerrain(Long terrainId) {
        return reservationRepository.findByTerrainId(terrainId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Vérifie les conflits d'horaire pour un terrain donné
     */
    @Transactional(readOnly = true)
    public boolean hasConflict(Long terrainId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        List<Reservation> existingReservations = reservationRepository
                .findByTerrainIdAndDateDebutBetween(terrainId,
                        dateDebut.minusHours(2), dateFin.plusHours(2));

        return existingReservations.stream()
                .filter(r -> r.getStatut() != ReservationStatus.CANCELLED)
                .anyMatch(r -> {
                    // Vérifie le chevauchement : debut1 < fin2 AND debut2 < fin1
                    return r.getDateDebut().isBefore(dateFin) && dateDebut.isBefore(r.getDateFin());
                });
    }

    public ReservationDTO createReservation(ReservationDTO dto) {
        // Vérification conflit d'horaire
        if (hasConflict(dto.getTerrainId(), dto.getDateDebut(), dto.getDateFin())) {
            throw new RuntimeException("CONFLIT: Ce créneau est déjà réservé pour ce terrain");
        }

        Reservation reservation = new Reservation();
        reservation.setNumeroReservation(generateReservationNumber());

        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        reservation.setUser(user);

        Terrain terrain = terrainRepository.findById(dto.getTerrainId())
            .orElseThrow(() -> new RuntimeException("Terrain not found"));
        reservation.setTerrain(terrain);

        reservation.setDateDebut(dto.getDateDebut());
        reservation.setDateFin(dto.getDateFin());

        TerrainType type = TerrainType.valueOf(dto.getType());
        reservation.setType(type);
        reservation.setStatut(ReservationStatus.PENDING);

        // Calcul du prix automatique selon le type
        if (dto.getMontant() != null && dto.getMontant() > 0) {
            reservation.setMontant(BigDecimal.valueOf(dto.getMontant()));
        } else {
            double prix = type == TerrainType.TYPE_5x5 ? terrain.getPrix5x5() : terrain.getPrix7x7();
            reservation.setMontant(BigDecimal.valueOf(prix));
        }

        reservation.setCreatedAt(LocalDateTime.now());

        // Génération QR Code
        String qrContent = String.format("RES:%s|T:%s|D:%s",
                reservation.getNumeroReservation(),
                terrain.getNom(),
                dto.getDateDebut().toString());
        reservation.setQrCode(qrCodeService.generateQrCodeBase64(qrContent));

        Reservation saved = reservationRepository.save(reservation);
        return convertToDTO(saved);
    }

    public ReservationDTO updateReservation(Long id, ReservationDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (dto.getDateDebut() != null) reservation.setDateDebut(dto.getDateDebut());
        if (dto.getDateFin() != null) reservation.setDateFin(dto.getDateFin());
        if (dto.getType() != null) reservation.setType(TerrainType.valueOf(dto.getType()));
        if (dto.getStatut() != null) reservation.setStatut(ReservationStatus.valueOf(dto.getStatut()));
        if (dto.getMontant() != null) reservation.setMontant(BigDecimal.valueOf(dto.getMontant()));
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation updated = reservationRepository.save(reservation);
        return convertToDTO(updated);
    }

    public ReservationDTO cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatut(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updated = reservationRepository.save(reservation);
        return convertToDTO(updated);
    }

    /**
     * Scanner le QR Code - vérifie la validité de la réservation
     */
    public ReservationDTO scanQrCode(String numeroReservation) {
        Reservation reservation = reservationRepository.findByNumeroReservation(numeroReservation)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        if (reservation.getStatut() == ReservationStatus.CANCELLED) {
            throw new RuntimeException("Cette réservation a été annulée");
        }

        if (reservation.getQrScanned() != null && reservation.getQrScanned()) {
            throw new RuntimeException("Ce QR code a déjà été scanné");
        }

        if (reservation.getDateFin() != null && reservation.getDateFin().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cette réservation est expirée");
        }

        reservation.setQrScanned(true);
        reservation.setStatut(ReservationStatus.COMPLETED);
        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updated = reservationRepository.save(reservation);
        return convertToDTO(updated);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public String generateReservationNumber() {
        return "RES-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6);
    }

    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setNumeroReservation(reservation.getNumeroReservation());
        if (reservation.getUser() != null) {
            dto.setUserId(reservation.getUser().getId());
        }
        if (reservation.getTerrain() != null) {
            dto.setTerrainId(reservation.getTerrain().getId());
            dto.setTerrainName(reservation.getTerrain().getNom());
        }
        dto.setDateDebut(reservation.getDateDebut());
        dto.setDateFin(reservation.getDateFin());
        if (reservation.getType() != null) dto.setType(reservation.getType().toString());
        if (reservation.getStatut() != null) dto.setStatut(reservation.getStatut().toString());
        if (reservation.getMontant() != null) dto.setMontant(reservation.getMontant().doubleValue());
        dto.setPdfPath(reservation.getPdfPath());
        dto.setQrScanned(reservation.getQrScanned());
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }
}
