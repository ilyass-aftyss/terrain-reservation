package com.terrainreservation.repository;

import com.terrainreservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByTerrainId(Long terrainId);
    Optional<Reservation> findByNumeroReservation(String numeroReservation);
    
    List<Reservation> findByTerrainIdAndDateDebutBetween(
        Long terrainId, 
        LocalDateTime debut, 
        LocalDateTime fin
    );
}
