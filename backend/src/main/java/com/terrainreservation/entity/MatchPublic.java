package com.terrainreservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "match_public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPublic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "terrain_id", nullable = false)
    private Terrain terrain;

    @Column(nullable = false)
    private LocalDateTime dateMatch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TerrainType type;

    @Column(nullable = false)
    private Integer maxJoueurs;

    @Column(nullable = false)
    private Integer joueursInscrits = 0;

    @Column(nullable = false)
    private Double prixParJoueur;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean ouvert = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
