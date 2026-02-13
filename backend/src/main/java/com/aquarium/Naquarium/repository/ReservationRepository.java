package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/** 예약 데이터 접근 레포지토리 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    /**
     * 사용자 이메일 기준 예약 목록 조회 (최신순)
     * - FETCH JOIN으로 schedule, program을 한 번에 조회하여 N+1 문제 방지
     * - LEFT JOIN: 입장권 예매(schedule이 null)인 경우도 포함
     */
    @Query("SELECT r FROM Reservation r " +
           "LEFT JOIN FETCH r.program " +
           "LEFT JOIN FETCH r.schedule s " +
           "LEFT JOIN FETCH s.program " +
           "WHERE r.user.email = :email " +
           "ORDER BY r.reservedAt DESC")
    List<Reservation> findByUser_EmailOrderByReservedAtDesc(@Param("email") String email);

    /** 동일 날짜 중복 예약 방지를 위한 존재 여부 확인 */
    boolean existsByUserEmailAndVisitDate(String email, String visitDate);
}