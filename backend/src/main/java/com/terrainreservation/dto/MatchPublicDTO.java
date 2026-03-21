package com.terrainreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPublicDTO {
    private Long id;
    private Long creatorId;
    private String creatorName;
    private Long terrainId;
    private String terrainName;
    private String terrainLocalisation;
    private LocalDateTime dateMatch;
    private String type;
    private Integer maxJoueurs;
    private Integer joueursInscrits;
    private Double prixParJoueur;
    private String description;
    private Boolean ouvert;
    private List<String> participants;
    private LocalDateTime createdAt;
}
