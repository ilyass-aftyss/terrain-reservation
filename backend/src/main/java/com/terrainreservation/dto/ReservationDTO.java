package com.terrainreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private String numeroReservation;
    private Long userId;
    private Long terrainId;
    private String terrainName;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String type;
    private String statut;
    private Double montant;
    private String pdfPath;
    private Boolean qrScanned;
    private LocalDateTime createdAt;
}
