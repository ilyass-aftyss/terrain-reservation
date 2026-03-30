package com.terrainreservation.controller;

import com.terrainreservation.dto.TerrainDTO;
import com.terrainreservation.service.TerrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/terrains")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TerrainController {

    @Autowired
    private TerrainService terrainService;

    @GetMapping
    public ResponseEntity<List<TerrainDTO>> getAllTerrains() {
        return ResponseEntity.ok(terrainService.getAllTerrains());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TerrainDTO> getTerrainById(@PathVariable Long id) {
        return ResponseEntity.ok(terrainService.getTerrainById(id));
    }

    @PostMapping
    public ResponseEntity<TerrainDTO> createTerrain(@RequestBody TerrainDTO dto) {
        return ResponseEntity.ok(terrainService.createTerrain(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TerrainDTO> updateTerrain(@PathVariable Long id, @RequestBody TerrainDTO dto) {
        return ResponseEntity.ok(terrainService.updateTerrain(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTerrain(@PathVariable Long id) {
        terrainService.deleteTerrain(id);
        return ResponseEntity.ok().build();
    }
}
