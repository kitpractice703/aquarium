package com.naquarium.repository;

import com.naquarium.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * 예약 레포지토리
 *
 * 마이페이지·관리자 조회에서 N+1 문제를 방지하기 위해
 * 연관 엔티티(program, schedule, user)를 LEFT JOIN FETCH로 한 번에 로드한다.
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    /**
     * 사용자의 예약 목록 조회 (최신순).
     * program, schedule, schedule.program을 즉시 로딩해 DTO 변환 시 LazyLoading을 방지한다.
     *
     * @param email 사용자 이메일
     */
    @Query("SELECT r FROM Reservation r " +
           "LEFT JOIN FETCH r.program " +
           "LEFT JOIN FETCH r.schedule s " +
           "LEFT JOIN FETCH s.program " +
           "WHERE r.user.email = :email " +
           "ORDER BY r.reservedAt DESC")
    List<Reservation> findByUser_EmailOrderByReservedAtDesc(@Param("email") String email);

    boolean existsByUserEmailAndVisitDate(String email, String visitDate);

    /**
     * 특정 날짜에 유효한 입장권(program IS NULL, CONFIRMED) 보유 여부 확인.
     * 프로그램 예매 전 입장권 보유 검증에 사용된다.
     * program IS NULL 조건으로 입장권 예약만 대상으로 한다.
     */
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.user.email = :email AND r.visitDate = :visitDate AND r.status = :status AND r.program IS NULL")
    boolean existsByUserEmailAndVisitDateAndStatus(@Param("email") String email, @Param("visitDate") String visitDate, @Param("status") Reservation.ReservationStatus status);

    /** 오늘 예약 건수 집계 (대시보드용) */
    long countByVisitDate(String visitDate);

    /**
     * 관리자용 전체 예약 목록 조회.
     * user, program, schedule, schedule.program을 모두 즉시 로딩한다.
     * AdminService에서 메모리 필터링을 수행하기 위해 전체 데이터를 반환한다.
     */
    @Query("SELECT r FROM Reservation r " +
           "LEFT JOIN FETCH r.user " +
           "LEFT JOIN FETCH r.program " +
           "LEFT JOIN FETCH r.schedule s " +
           "LEFT JOIN FETCH s.program " +
           "ORDER BY r.reservedAt DESC")
    List<Reservation> findAllForAdmin();

    /** 회원 탈퇴 시 해당 회원의 예약 목록 조회 (cascade 삭제용) */
    List<Reservation> findByUser_Id(Long userId);
}
