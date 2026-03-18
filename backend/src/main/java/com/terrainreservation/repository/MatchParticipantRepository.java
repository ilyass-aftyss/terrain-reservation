package com.terrainreservation.repository;

import com.terrainreservation.entity.MatchParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchParticipantRepository extends JpaRepository<MatchParticipant, Long> {
    List<MatchParticipant> findByMatchPublicId(Long matchId);

    List<MatchParticipant> findByUserId(Long userId);

    Optional<MatchParticipant> findByMatchPublicIdAndUserId(Long matchId, Long userId);

    boolean existsByMatchPublicIdAndUserId(Long matchId, Long userId);
}
