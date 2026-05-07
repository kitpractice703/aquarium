package com.naquarium.service;

import com.naquarium.dto.PasswordResetCheckRequest;
import com.naquarium.dto.PasswordResetRequest;
import com.naquarium.dto.UserUpdateRequest;
import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원정보 수정 및 비밀번호 재설정 서비스
 *
 * 마이페이지 정보 수정과 2단계 비밀번호 재설정(이메일+전화번호 확인)을 처리한다.
 * Google OAuth2 회원은 비밀번호가 없으므로 비밀번호 관련 기능에서 예외 처리한다.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 마이페이지 회원정보 수정 (비밀번호·전화번호).
     * 로컬 회원은 현재 비밀번호 확인 필수이며, OAuth2 회원은 건너뛴다.
     * 새 비밀번호 미입력 시 기존 비밀번호를 유지하고 전화번호만 업데이트한다.
     *
     * @param email   SecurityContext에서 추출한 현재 사용자 이메일
     * @param request 수정 요청 DTO
     * @throws IllegalArgumentException 현재 비밀번호 불일치 또는 사용자 미존재
     */
    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // OAuth2 회원(google)은 비밀번호가 없으므로 현재 비밀번호 확인을 생략한다.
        if ("local".equals(user.getProvider())) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
            }
        }

        // 새 비밀번호가 입력된 경우에만 BCrypt로 인코딩해 변경한다.
        String encodedNewPw = null;
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            encodedNewPw = passwordEncoder.encode(request.getNewPassword());
        }

        user.updateInfo(encodedNewPw, request.getPhone());
    }

    /**
     * 비밀번호 재설정 1단계: 이메일·전화번호로 본인 확인.
     * - Google 로그인 회원은 비밀번호 재설정 불가
     * - 전화번호 비교 시 하이픈을 제거해 입력 형식 차이를 무시한다
     *
     * @param request 이메일 + 전화번호 확인 요청
     * @throws IllegalArgumentException 검증 실패 시 (이메일 미존재, OAuth2 회원, 전화번호 불일치)
     */
    public void validateUserForPasswordReset(PasswordResetCheckRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if ("google".equals(user.getProvider())) {
            throw new IllegalArgumentException("구글 소셜 로그인 회원은 비밀번호를 변경할 수 없습니다. 구글 로그인을 이용해주세요.");
        }

        if (user.getPhone() == null) {
            throw new IllegalArgumentException("회원정보에 등록된 전화번호가 없습니다.");
        }

        // 하이픈 제거 후 숫자만 비교 (010-1234-5678 == 01012345678)
        String inputPhone = request.getPhone().replaceAll("[^0-9]", "");
        String dbPhone = user.getPhone().replaceAll("[^0-9]", "");

        if (!inputPhone.equals(dbPhone)) {
            throw new IllegalArgumentException("등록된 전화번호와 일치하지 않습니다.");
        }
    }

    /**
     * 비밀번호 재설정 2단계: 새 비밀번호 저장.
     * validateUserForPasswordReset() 통과 후 호출해야 한다.
     * 최소 8자 이상 검증은 서비스 레이어에서도 수행한다.
     *
     * @param request 이메일 + 새 비밀번호 요청
     */
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
