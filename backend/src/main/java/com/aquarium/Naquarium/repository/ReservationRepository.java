package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 1. [기존 코드 유지] 유저 ID로 찾기 (나중에 관리자 기능 등에서 쓸 수 있음)
    List<Reservation> findByUserId(Long userId);

    // 2. [새 코드 추가] 이메일로 찾고 + 최신순 정렬 (현재 예매확인 모달에서 사용)
    List<Reservation> findByUser_EmailOrderByReservedAtDesc(String email);

}