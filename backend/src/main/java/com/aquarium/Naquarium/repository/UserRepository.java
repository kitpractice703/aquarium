package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/** 사용자 데이터 접근 레포지토리 */
public interface UserRepository extends JpaRepository<User, Long> {

    /** 이메일로 사용자 조회 (로그인, 중복 확인 등에 사용) */
    Optional<User> findByEmail(String email);
}