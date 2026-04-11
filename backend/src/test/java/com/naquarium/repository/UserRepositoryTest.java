package com.naquarium.repository;

import com.naquarium.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * UserRepository 단위 테스트 (@DataJpaTest)
 * - H2 인메모리 DB를 사용하여 실제 쿼리 동작 검증
 * - findByEmail 파생 쿼리, 이메일 unique 제약 조건 검증
 */
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    private User buildUser(String email) {
        return User.builder()
                .email(email)
                .username("테스터")
                .password("encodedPw")
                .phone("010-1234-5678")
                .role(User.Role.USER)
                .provider("local")
                .build();
    }

    @Test
    @DisplayName("존재하는 이메일로 조회 시 사용자 반환")
    void findByEmail_existingUser_returnsUser() {
        userRepository.save(buildUser("exist@test.com"));

        Optional<User> result = userRepository.findByEmail("exist@test.com");

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("exist@test.com");
        assertThat(result.get().getProvider()).isEqualTo("local");
    }

    @Test
    @DisplayName("존재하지 않는 이메일로 조회 시 빈 Optional 반환")
    void findByEmail_nonExistingUser_returnsEmpty() {
        Optional<User> result = userRepository.findByEmail("none@test.com");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("이메일 중복 저장 시 DataIntegrityViolationException 발생")
    void save_duplicateEmail_throwsDataIntegrityViolation() {
        userRepository.save(buildUser("dup@test.com"));

        assertThatThrownBy(() -> userRepository.saveAndFlush(buildUser("dup@test.com")))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("Google 소셜 사용자 저장 및 조회 - password null 허용")
    void save_googleUser_passwordNull() {
        User googleUser = User.builder()
                .email("google@test.com")
                .username("구글유저")
                .password(null)
                .role(User.Role.USER)
                .provider("google")
                .build();
        userRepository.save(googleUser);

        Optional<User> result = userRepository.findByEmail("google@test.com");

        assertThat(result).isPresent();
        assertThat(result.get().getPassword()).isNull();
        assertThat(result.get().getProvider()).isEqualTo("google");
    }
}
