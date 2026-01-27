package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 이미 가입된 이메일인지 확인하는 메서드
    Optional<User> findByEmail(String email);
}