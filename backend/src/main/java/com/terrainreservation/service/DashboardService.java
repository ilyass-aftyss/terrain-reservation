package com.terrainreservation.service;

import com.terrainreservation.dto.DashboardDTO;
import com.terrainreservation.entity.*;
import com.terrainreservation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Dashboard pour un président de terrain
     */
    public DashboardDTO getPresidentDashboard(Long presidentId) {
        DashboardDTO dashboard = new DashboardDTO();
        List<Terrain> terrains = terrainRepository.findByPresidentId(presidentId);
        List<Long> terrainIds = terrains.stream().map(Terrain::getId).collect(Collectors.toList());

        List<Reservation> allReservations = new ArrayList<>();
        for (Long terrainId : terrainIds) {
            allReservations.addAll(reservationRepository.findByTerrainId(terrainId));
        }

        // Stats globales
        dashboard.setTotalReservations((long) allReservations.size());
        dashboard.setReservationsEnCours(allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.CONFIRMED || r.getStatut() == ReservationStatus.PAID)
                .count());
        dashboard.setReservationsTerminees(allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.COMPLETED).count());
        dashboard.setReservationsAnnulees(allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.CANCELLED).count());

        // Revenus
        double revenuTotal = allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                .sum();
        dashboard.setRevenuTotal(revenuTotal);

        LocalDateTime debutMois = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        double revenuMois = allReservations.stream()
                .filter(r -> (r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                        && r.getCreatedAt() != null && r.getCreatedAt().isAfter(debutMois))
                .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                .sum();
        dashboard.setRevenuMoisEnCours(revenuMois);

        double commission = revenuTotal * 0.10;
        dashboard.setCommissionTotale(commission);

        // Taux d'occupation (basé sur les 30 derniers jours)
        LocalDateTime il30Jours = LocalDateTime.now().minusDays(30);
        long reservationsRecentes = allReservations.stream()
                .filter(r -> r.getCreatedAt() != null && r.getCreatedAt().isAfter(il30Jours)
                        && r.getStatut() != ReservationStatus.CANCELLED)
                .count();
        int creneauxDisponibles = terrains.size() * 30 * 12; // 12 créneaux/jour * 30 jours * nb terrains
        dashboard.setTauxOccupation(creneauxDisponibles > 0
                ? Math.round((double) reservationsRecentes / creneauxDisponibles * 10000) / 100.0
                : 0.0);

        // Stats par terrain
        List<DashboardDTO.TerrainStatsDTO> statsParTerrain = terrains.stream().map(terrain -> {
            DashboardDTO.TerrainStatsDTO stats = new DashboardDTO.TerrainStatsDTO();
            stats.setTerrainId(terrain.getId());
            stats.setTerrainNom(terrain.getNom());
            List<Reservation> terrainRes = allReservations.stream()
                    .filter(r -> r.getTerrain().getId().equals(terrain.getId()))
                    .collect(Collectors.toList());
            stats.setTotalReservations((long) terrainRes.size());
            stats.setRevenu(terrainRes.stream()
                    .filter(r -> r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                    .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                    .sum());
            long resRecentes = terrainRes.stream()
                    .filter(r -> r.getCreatedAt() != null && r.getCreatedAt().isAfter(il30Jours))
                    .count();
            int creneaux = 30 * 12;
            stats.setTauxOccupation(creneaux > 0 ? Math.round((double) resRecentes / creneaux * 10000) / 100.0 : 0.0);
            return stats;
        }).collect(Collectors.toList());
        dashboard.setStatsParTerrain(statsParTerrain);

        // Réservations par heure
        Map<String, Long> parHeure = new LinkedHashMap<>();
        for (int h = 8; h <= 23; h++) {
            String key = String.format("%02d:00", h);
            int finalH = h;
            long count = allReservations.stream()
                    .filter(r -> r.getDateDebut() != null && r.getDateDebut().getHour() == finalH)
                    .count();
            parHeure.put(key, count);
        }
        dashboard.setReservationsParHeure(parHeure);

        // Revenus mensuels (6 derniers mois)
        Map<String, Double> revenusMensuels = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            String key = ym.toString();
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);
            double rev = allReservations.stream()
                    .filter(r -> (r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                            && r.getCreatedAt() != null
                            && r.getCreatedAt().isAfter(start) && r.getCreatedAt().isBefore(end))
                    .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                    .sum();
            revenusMensuels.put(key, rev);
        }
        dashboard.setRevenusMensuels(revenusMensuels);

        return dashboard;
    }

    /**
     * Dashboard pour l'admin de la plateforme
     */
    public DashboardDTO getAdminDashboard() {
        DashboardDTO dashboard = new DashboardDTO();
        List<Reservation> allReservations = reservationRepository.findAll();

        dashboard.setTotalReservations((long) allReservations.size());
        dashboard.setReservationsEnCours(allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.CONFIRMED || r.getStatut() == ReservationStatus.PAID)
                .count());
        dashboard.setReservationsTerminees(allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.COMPLETED).count());
        dashboard.setReservationsAnnulees(allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.CANCELLED).count());

        double revenuTotal = allReservations.stream()
                .filter(r -> r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                .sum();
        dashboard.setRevenuTotal(revenuTotal);
        dashboard.setCommissionTotale(revenuTotal * 0.10);

        LocalDateTime debutMois = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        double revenuMois = allReservations.stream()
                .filter(r -> (r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                        && r.getCreatedAt() != null && r.getCreatedAt().isAfter(debutMois))
                .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                .sum();
        dashboard.setRevenuMoisEnCours(revenuMois);

        // Revenus mensuels
        Map<String, Double> revenusMensuels = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = YearMonth.now().minusMonths(i);
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);
            double rev = allReservations.stream()
                    .filter(r -> (r.getStatut() == ReservationStatus.PAID || r.getStatut() == ReservationStatus.COMPLETED)
                            && r.getCreatedAt() != null
                            && r.getCreatedAt().isAfter(start) && r.getCreatedAt().isBefore(end))
                    .mapToDouble(r -> r.getMontant() != null ? r.getMontant().doubleValue() : 0)
                    .sum();
            revenusMensuels.put(ym.toString(), rev);
        }
        dashboard.setRevenusMensuels(revenusMensuels);

        return dashboard;
    }
}
