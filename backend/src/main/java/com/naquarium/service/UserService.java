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

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 일반 회원은 현재 비밀번호 확인 필수
        if ("local".equals(user.getProvider())) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
            }
        }

        // 새 비밀번호가 입력된 경우에만 암호화하여 변경
        String encodedNewPw = null;
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            encodedNewPw = passwordEncoder.encode(request.getNewPassword());
        }

        user.updateInfo(encodedNewPw, request.getPhone());
    }

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