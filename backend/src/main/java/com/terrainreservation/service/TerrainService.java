package com.terrainreservation.service;

import com.terrainreservation.dto.TerrainDTO;
import com.terrainreservation.entity.Terrain;
import com.terrainreservation.entity.User;
import com.terrainreservation.repository.TerrainRepository;
import com.terrainreservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TerrainService {

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TerrainDTO> getAllTerrains() {
        return terrainRepository.findByActif(true).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TerrainDTO getTerrainById(Long id) {
        Terrain terrain = terrainRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Terrain not found"));
        return convertToDTO(terrain);
    }

    public TerrainDTO createTerrain(TerrainDTO dto) {
        Terrain terrain = new Terrain();
        terrain.setNom(dto.getNom());
        terrain.setDescription(dto.getDescription());
        terrain.setLocalisation(dto.getLocalisation());
        terrain.setLatitude(dto.getLatitude());
        terrain.setLongitude(dto.getLongitude());
        terrain.setType5x5(dto.getType5x5());
        terrain.setType7x7(dto.getType7x7());
        terrain.setPrix5x5(dto.getPrix5x5());
        terrain.setPrix7x7(dto.getPrix7x7());
        terrain.setCreatedAt(LocalDateTime.now());

        if (dto.getPresidentId() != null) {
            User president = userRepository.findById(dto.getPresidentId())
                .orElseThrow(() -> new RuntimeException("President not found"));
            terrain.setPresident(president);
        }

        Terrain saved = terrainRepository.save(terrain);
        return convertToDTO(saved);
    }

    public TerrainDTO updateTerrain(Long id, TerrainDTO dto) {
        Terrain terrain = terrainRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Terrain not found"));

        terrain.setNom(dto.getNom());
        terrain.setDescription(dto.getDescription());
        terrain.setLocalisation(dto.getLocalisation());
        terrain.setType5x5(dto.getType5x5());
        terrain.setType7x7(dto.getType7x7());
        terrain.setPrix5x5(dto.getPrix5x5());
        terrain.setPrix7x7(dto.getPrix7x7());
        terrain.setUpdatedAt(LocalDateTime.now());

        Terrain updated = terrainRepository.save(terrain);
        return convertToDTO(updated);
    }

    public void deleteTerrain(Long id) {
        Terrain terrain = terrainRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Terrain not found"));
        terrain.setActif(false);
        terrainRepository.save(terrain);
    }

    private TerrainDTO convertToDTO(Terrain terrain) {
        TerrainDTO dto = new TerrainDTO();
        dto.setId(terrain.getId());
        dto.setNom(terrain.getNom());
        dto.setDescription(terrain.getDescription());
        dto.setLocalisation(terrain.getLocalisation());
        dto.setLatitude(terrain.getLatitude());
        dto.setLongitude(terrain.getLongitude());
        if (terrain.getPresident() != null) {
            dto.setPresidentId(terrain.getPresident().getId());
            dto.setPresidentName(terrain.getPresident().getNom());
        }
        dto.setType5x5(terrain.getType5x5());
        dto.setType7x7(terrain.getType7x7());
        dto.setPrix5x5(terrain.getPrix5x5());
        dto.setPrix7x7(terrain.getPrix7x7());
        dto.setActif(terrain.getActif());
        dto.setCreatedAt(terrain.getCreatedAt());
        return dto;
    }
}
