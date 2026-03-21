package com.terrainreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    // Stats générales
    private Long totalReservations;
    private Long reservationsEnCours;
    private Long reservationsTerminees;
    private Long reservationsAnnulees;
    private Double revenuTotal;
    private Double revenuMoisEnCours;
    private Double commissionTotale;

    // Taux d'occupation
    private Double tauxOccupation;

    // Stats par terrain
    private List<TerrainStatsDTO> statsParTerrain;

    // Heures creuses / pics
    private Map<String, Long> reservationsParHeure;

    // Revenus mensuels (12 derniers mois)
    private Map<String, Double> revenusMensuels;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TerrainStatsDTO {
        private Long terrainId;
        private String terrainNom;
        private Long totalReservations;
        private Double revenu;
        private Double tauxOccupation;
    }
}
