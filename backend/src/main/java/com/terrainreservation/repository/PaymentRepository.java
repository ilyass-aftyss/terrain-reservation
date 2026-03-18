package com.terrainreservation.repository;

import com.terrainreservation.entity.Payment;
import com.terrainreservation.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);

    Optional<Payment> findByReservationId(Long reservationId);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByStatut(PaymentStatus statut);

    @Query("SELECT SUM(p.montant) FROM Payment p WHERE p.statut = 'COMPLETED' AND p.createdAt BETWEEN :start AND :end")
    BigDecimal getTotalRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(p.commissionPlateforme) FROM Payment p WHERE p.statut = 'COMPLETED' AND p.createdAt BETWEEN :start AND :end")
    BigDecimal getTotalCommissionBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(p.montantPresident) FROM Payment p WHERE p.statut = 'COMPLETED' " +
           "AND p.reservation.terrain.president.id = :presidentId AND p.createdAt BETWEEN :start AND :end")
    BigDecimal getPresidentRevenueBetween(@Param("presidentId") Long presidentId,
                                          @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
