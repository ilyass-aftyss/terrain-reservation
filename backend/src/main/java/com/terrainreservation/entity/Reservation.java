package com.terrainreservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroReservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "terrain_id", nullable = false)
    private Terrain terrain;

    @Column(nullable = false)
    private LocalDateTime dateDebut;

    @Column(nullable = false)
    private LocalDateTime dateFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TerrainType type; // 5x5 ou 7x7

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus statut;

    @Column(nullable = false)
    private BigDecimal montant;

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @Column(columnDefinition = "TEXT")
    private String pdfPath;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean qrScanned = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
