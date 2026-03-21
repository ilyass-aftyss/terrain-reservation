package com.terrainreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TerrainDTO {
    private Long id;
    private String nom;
    private String description;
    private String localisation;
    private Double latitude;
    private Double longitude;
    private Long presidentId;
    private String presidentName;
    private Boolean type5x5;
    private Boolean type7x7;
    private Double prix5x5;
    private Double prix7x7;
    private Boolean actif;
    private LocalDateTime createdAt;
}
