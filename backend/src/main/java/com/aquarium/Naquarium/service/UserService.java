package com.aquarium.Naquarium.service;

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

    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // [MODIFIED] 일반(local) 회원인 경우에만 현재 비밀번호 검증 수행
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

        // 정보 업데이트
        user.updateInfo(encodedNewPw, request.getPhone());
    }
}