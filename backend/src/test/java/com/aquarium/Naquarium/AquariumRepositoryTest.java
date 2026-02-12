package com.aquarium.Naquarium;

import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.entity.Reservation;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.ExhibitionRepository;
import com.aquarium.Naquarium.repository.ReservationRepository;
import com.aquarium.Naquarium.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 데이터베이스 연동 테스트
 * - Exhibition, User, Reservation 엔티티의 기본 조회 동작 검증
 * - @Transactional: 테스트 종료 시 데이터 롤백 (DB 오염 방지)
 */
@SpringBootTest
public class AquariumRepositoryTest {

    @Autowired ExhibitionRepository exhibitionRepository;
    @Autowired UserRepository userRepository;
    @Autowired ReservationRepository reservationRepository;

    @Test
    @DisplayName("데이터 조회 테스트")
    @Transactional
    void testDatabaseConnection() {
        // 1. 전시물 조회 검증
        System.out.println("========= [1. 전시물 조회 테스트] =========");
        List<Exhibition> exhibitions = exhibitionRepository.findAll();

        if (exhibitions.isEmpty()) {
            System.out.println("❌ 전시물이 하나도 없습니다! SQL Insert를 확인해주세요.");
        } else {
            for (Exhibition e : exhibitions) {
                System.out.println("✅ 전시명: " + e.getTitle() + " | 설명: " + e.getDescription());
            }
        }

        // 2. 유저 및 예약 관계 조회 검증
        System.out.println("\n========= [2. 유저 및 예약 조회 테스트] =========");
        Optional<User> userBox = userRepository.findByEmail("test@google.com");

        if (userBox.isPresent()) {
            User user = userBox.get();
            System.out.println("✅ 유저 찾기 성공: " + user.getUsername() + " (" + user.getEmail() + ")");

            List<Reservation> myReservations = reservationRepository.findByUserId(user.getId());
            for (Reservation r : myReservations) {
                System.out.println("   🎫 예약된 공연: " + r.getSchedule().getProgram().getTitle());
                System.out.println("   📅 예약 날짜: " + r.getSchedule().getStartTime());
                System.out.println("   📍 장소: " + r.getSchedule().getLocation());
            }
        } else {
            System.out.println("❌ 테스트 유저(test@google.com)를 찾을 수 없습니다.");
        }
    }
}