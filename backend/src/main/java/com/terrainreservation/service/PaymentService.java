package com.terrainreservation.service;

import com.terrainreservation.dto.PaymentDTO;
import com.terrainreservation.entity.*;
import com.terrainreservation.repository.PaymentRepository;
import com.terrainreservation.repository.ReservationRepository;
import com.terrainreservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${saas.commission.percentage:10}")
    private Double commissionPercentage;

    public PaymentDTO processPayment(Long reservationId, Long userId, String methodePaiement) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier que la réservation n'est pas déjà payée
        if (reservation.getStatut() == ReservationStatus.PAID) {
            throw new RuntimeException("Cette réservation est déjà payée");
        }

        BigDecimal montant = reservation.getMontant();
        BigDecimal commission = montant.multiply(BigDecimal.valueOf(commissionPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal montantPresident = montant.subtract(commission);

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setUser(user);
        payment.setMontant(montant);
        payment.setCommissionPlateforme(commission);
        payment.setMontantPresident(montantPresident);
        payment.setMethodePaiement(methodePaiement);
        payment.setStatut(PaymentStatus.COMPLETED);
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        payment.setCreatedAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);

        // Mettre à jour le statut de la réservation
        reservation.setStatut(ReservationStatus.PAID);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByReservation(Long reservationId) {
        return paymentRepository.findByReservationId(reservationId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        if (payment.getReservation() != null) {
            dto.setReservationId(payment.getReservation().getId());
            dto.setNumeroReservation(payment.getReservation().getNumeroReservation());
        }
        if (payment.getUser() != null) {
            dto.setUserId(payment.getUser().getId());
            dto.setUserName(payment.getUser().getNom() + " " + payment.getUser().getPrenom());
        }
        if (payment.getMontant() != null) dto.setMontant(payment.getMontant().doubleValue());
        if (payment.getCommissionPlateforme() != null)
            dto.setCommissionPlateforme(payment.getCommissionPlateforme().doubleValue());
        if (payment.getMontantPresident() != null)
            dto.setMontantPresident(payment.getMontantPresident().doubleValue());
        dto.setMethodePaiement(payment.getMethodePaiement());
        dto.setStatut(payment.getStatut().toString());
        dto.setTransactionId(payment.getTransactionId());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }
}
