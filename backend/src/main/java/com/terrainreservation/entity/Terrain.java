package com.terrainreservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "terrains")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Terrain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String localisation;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "president_id", nullable = false)
    private User president;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean type5x5 = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean type7x7 = true;

    @Column(nullable = false)
    private Double prix5x5 = 200.0;

    @Column(nullable = false)
    private Double prix7x7 = 300.0;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean actif = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
