package com.naquarium.service;

import com.naquarium.dto.PasswordResetCheckRequest;
import com.naquarium.dto.PasswordResetRequest;
import com.naquarium.dto.UserUpdateRequest;
import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
 * UserService 단위 테스트
 * - 실제 DB 없이 Mockito로 의존성 대체
 * - 비즈니스 로직(조건 분기, 예외 처리)을 집중적으로 검증
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks UserService userService;

    private User localUser;
    private User googleUser;

    @BeforeEach
    void setUp() {
        localUser = User.builder()
                .email("local@test.com")
                .username("일반유저")
                .password("encodedPassword")
                .phone("010-1234-5678")
                .role(User.Role.USER)
                .provider("local")
                .build();

        googleUser = User.builder()
                .email("google@test.com")
                .username("구글유저")
                .password(null)
                .phone("010-9999-8888")
                .role(User.Role.USER)
                .provider("google")
                .build();
    }

    // ─────────────────────────────────────────────
    // updateUser 테스트
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("일반 회원 - 현재 비밀번호 일치 시 정보 수정 성공")
    void updateUser_local_success() {
        given(userRepository.findByEmail("local@test.com")).willReturn(Optional.of(localUser));
        given(passwordEncoder.matches("currentPw", "encodedPassword")).willReturn(true);
        given(passwordEncoder.encode("newPassword1!")).willReturn("encodedNew");

        UserUpdateRequest request = new UserUpdateRequest();
        request.setCurrentPassword("currentPw");
        request.setNewPassword("newPassword1!");
        request.setPhone("010-0000-1111");

        userService.updateUser("local@test.com", request);

        assertThat(localUser.getPhone()).isEqualTo("010-0000-1111");
        assertThat(localUser.getPassword()).isEqualTo("encodedNew");
    }

    @Test
    @DisplayName("일반 회원 - 현재 비밀번호 불일치 시 예외 발생")
    void updateUser_local_wrongPassword() {
        given(userRepository.findByEmail("local@test.com")).willReturn(Optional.of(localUser));
        given(passwordEncoder.matches("wrongPw", "encodedPassword")).willReturn(false);

        UserUpdateRequest request = new UserUpdateRequest();
        request.setCurrentPassword("wrongPw");

        assertThatThrownBy(() -> userService.updateUser("local@test.com", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("현재 비밀번호가 일치하지 않습니다.");
    }

    @Test
    @DisplayName("일반 회원 - 현재 비밀번호 미입력 시 예외 발생")
    void updateUser_local_blankPassword() {
        given(userRepository.findByEmail("local@test.com")).willReturn(Optional.of(localUser));

        UserUpdateRequest request = new UserUpdateRequest();
        request.setCurrentPassword("");

        assertThatThrownBy(() -> userService.updateUser("local@test.com", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
    }

    @Test
    @DisplayName("구글 회원 - 비밀번호 확인 없이 전화번호만 수정 가능")
    void updateUser_google_phoneOnly() {
        given(userRepository.findByEmail("google@test.com")).willReturn(Optional.of(googleUser));

        UserUpdateRequest request = new UserUpdateRequest();
        request.setPhone("010-1111-2222");

        userService.updateUser("google@test.com", request);

        assertThat(googleUser.getPhone()).isEqualTo("010-1111-2222");
    }

    @Test
    @DisplayName("존재하지 않는 사용자 수정 시 예외 발생")
    void updateUser_userNotFound() {
        given(userRepository.findByEmail("none@test.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUser("none@test.com", new UserUpdateRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("사용자 정보를 찾을 수 없습니다.");
    }

    // ─────────────────────────────────────────────
    // validateUserForPasswordReset 테스트
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("비밀번호 재설정 검증 - 이메일+전화번호 일치 시 성공")
    void validateForReset_success() {
        given(userRepository.findByEmail("local@test.com")).willReturn(Optional.of(localUser));

        PasswordResetCheckRequest request = new PasswordResetCheckRequest();
        request.setEmail("local@test.com");
        request.setPhone("01012345678"); // 하이픈 없이 입력해도 통과

        userService.validateUserForPasswordReset(request); // 예외 없으면 성공
    }

    @Test
    @DisplayName("비밀번호 재설정 검증 - 구글 회원은 예외 발생")
    void validateForReset_googleUser() {
        given(userRepository.findByEmail("google@test.com")).willReturn(Optional.of(googleUser));

        PasswordResetCheckRequest request = new PasswordResetCheckRequest();
        request.setEmail("google@test.com");
        request.setPhone("010-9999-8888");

        assertThatThrownBy(() -> userService.validateUserForPasswordReset(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("구글 소셜 로그인 회원");
    }

    @Test
    @DisplayName("비밀번호 재설정 검증 - 전화번호 불일치 시 예외 발생")
    void validateForReset_wrongPhone() {
        given(userRepository.findByEmail("local@test.com")).willReturn(Optional.of(localUser));

        PasswordResetCheckRequest request = new PasswordResetCheckRequest();
        request.setEmail("local@test.com");
        request.setPhone("010-0000-0000");

        assertThatThrownBy(() -> userService.validateUserForPasswordReset(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("등록된 전화번호와 일치하지 않습니다.");
    }

    // ─────────────────────────────────────────────
    // resetPassword 테스트
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("비밀번호 재설정 - 8자 이상이면 성공")
    void resetPassword_success() {
        given(userRepository.findByEmail("local@test.com")).willReturn(Optional.of(localUser));
        given(passwordEncoder.encode("newSecure1!")).willReturn("encodedNewSecure");

        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("local@test.com");
        request.setNewPassword("newSecure1!");

        userService.resetPassword(request);

        verify(userRepository).save(localUser);
        assertThat(localUser.getPassword()).isEqualTo("encodedNewSecure");
    }

    @Test
    @DisplayName("비밀번호 재설정 - 8자 미만이면 예외 발생")
    void resetPassword_tooShort() {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("local@test.com");
        request.setNewPassword("short");

        assertThatThrownBy(() -> userService.resetPassword(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("비밀번호는 8자 이상이어야 합니다.");
    }
}
