package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.dto.PasswordResetCheckRequest;
import com.aquarium.Naquarium.dto.PasswordResetRequest;
import com.aquarium.Naquarium.dto.UserUpdateRequest;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원정보 수정
    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 일반(local) 회원만 현재 비밀번호 검증
        if ("local".equals(user.getProvider())) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
            }
        }

        // 새 비밀번호 암호화 (입력된 경우만)
        String encodedNewPw = null;
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            encodedNewPw = passwordEncoder.encode(request.getNewPassword());
        }

        user.updateInfo(encodedNewPw, request.getPhone());
    }

    // 1. 비밀번호 찾기 - 본인 확인 (이메일+전화번호)
    public void validateUserForPasswordReset(PasswordResetCheckRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 소셜 로그인 유저 차단
        if ("google".equals(user.getProvider())) {
            throw new IllegalArgumentException("구글 소셜 로그인 회원은 비밀번호를 변경할 수 없습니다. 구글 로그인을 이용해주세요.");
        }

        // 전화번호 존재 여부 확인
        if (user.getPhone() == null) {
            throw new IllegalArgumentException("회원정보에 등록된 전화번호가 없습니다.");
        }

        // 숫자만 남기고 비교 (하이픈 무시 로직)
        String inputPhone = request.getPhone().replaceAll("[^0-9]", "");
        String dbPhone = user.getPhone().replaceAll("[^0-9]", "");

        if (!inputPhone.equals(dbPhone)) {
            throw new IllegalArgumentException("등록된 전화번호와 일치하지 않습니다.");
        }
    }

    // 2. 비밀번호 찾기 - 비밀번호 변경 실행
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        // [Security] 백엔드 더블 체크: 8자 미만 차단
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}