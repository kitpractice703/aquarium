package com.naquarium.service;

import com.naquarium.dto.SignupRequest;
import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

/**
 * AuthService 단위 테스트
 * - 회원가입 비즈니스 로직 검증: 중복 이메일, User 빌드 정확성
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AuthService authService;

    // ─────────────────────────────────────────────
    // signup 테스트
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("회원가입 성공 - User 저장 시 role=USER, provider=local 설정")
    void signup_success_savesUserWithCorrectFields() {
        given(userRepository.findByEmail("new@test.com")).willReturn(Optional.empty());
        given(passwordEncoder.encode("password123")).willReturn("encodedPw");

        SignupRequest request = new SignupRequest();
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setUsername("신규유저");
        request.setPhone("010-1234-5678");

        authService.signup(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getEmail()).isEqualTo("new@test.com");
        assertThat(saved.getUsername()).isEqualTo("신규유저");
        assertThat(saved.getPassword()).isEqualTo("encodedPw");
        assertThat(saved.getRole()).isEqualTo(User.Role.USER);
        assertThat(saved.getProvider()).isEqualTo("local");
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복 시 IllegalArgumentException 발생")
    void signup_duplicateEmail_throwsException() {
        User existing = User.builder()
                .email("exist@test.com").username("기존유저")
                .password("pw").role(User.Role.USER).provider("local")
                .build();
        given(userRepository.findByEmail("exist@test.com")).willReturn(Optional.of(existing));

        SignupRequest request = new SignupRequest();
        request.setEmail("exist@test.com");
        request.setPassword("password123");
        request.setUsername("신규유저");

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이미 가입된 아이디(이메일)입니다.");
    }
}
