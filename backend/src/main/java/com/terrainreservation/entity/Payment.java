package com.terrainreservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal montant;

    @Column(name = "commission_plateforme")
    private BigDecimal commissionPlateforme;

    @Column(name = "montant_president")
    private BigDecimal montantPresident;

    @Column(name = "methode_paiement")
    private String methodePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus statut = PaymentStatus.PENDING;

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
