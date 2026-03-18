package com.terrainreservation.repository;

import com.terrainreservation.entity.Terrain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TerrainRepository extends JpaRepository<Terrain, Long> {
    List<Terrain> findByPresidentId(Long presidentId);
    List<Terrain> findByActif(Boolean actif);
}
