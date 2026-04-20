package com.naquarium.repository;

import com.naquarium.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    @Query("SELECT r FROM Reservation r " +
           "LEFT JOIN FETCH r.program " +
           "LEFT JOIN FETCH r.schedule s " +
           "LEFT JOIN FETCH s.program " +
           "WHERE r.user.email = :email " +
           "ORDER BY r.reservedAt DESC")
    List<Reservation> findByUser_EmailOrderByReservedAtDesc(@Param("email") String email);

    boolean existsByUserEmailAndVisitDate(String email, String visitDate);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.user.email = :email AND r.visitDate = :visitDate AND r.status = :status AND r.program IS NULL")
    boolean existsByUserEmailAndVisitDateAndStatus(@Param("email") String email, @Param("visitDate") String visitDate, @Param("status") Reservation.ReservationStatus status);
}