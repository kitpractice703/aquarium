package com.naquarium.repository;

import com.naquarium.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * 회원 레포지토리
 *
 * 이메일은 로그인 식별자이자 JWT subject로 사용되므로
 * 거의 모든 인증 흐름에서 findByEmail이 호출된다.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 회원 조회.
     * 로그인·세션 검증·OAuth2·비밀번호 재설정 등 인증 전반에서 사용된다.
     *
     * @param email 사용자 이메일
     * @return 해당 이메일의 회원 (없으면 Optional.empty())
     */
    Optional<User> findByEmail(String email);
}
