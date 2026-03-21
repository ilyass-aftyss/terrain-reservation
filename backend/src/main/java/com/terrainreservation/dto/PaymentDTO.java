package com.terrainreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Long reservationId;
    private String numeroReservation;
    private Long userId;
    private String userName;
    private Double montant;
    private Double commissionPlateforme;
    private Double montantPresident;
    private String methodePaiement;
    private String statut;
    private String transactionId;
    private LocalDateTime createdAt;
}
