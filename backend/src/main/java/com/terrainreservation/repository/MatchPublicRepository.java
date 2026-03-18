package com.terrainreservation.repository;

import com.terrainreservation.entity.MatchPublic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchPublicRepository extends JpaRepository<MatchPublic, Long> {
    List<MatchPublic> findByOuvertTrueAndDateMatchAfter(LocalDateTime now);

    List<MatchPublic> findByCreatorId(Long creatorId);

    List<MatchPublic> findByTerrainId(Long terrainId);
}
