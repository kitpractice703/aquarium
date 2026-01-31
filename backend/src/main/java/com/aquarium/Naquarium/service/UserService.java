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

    @Transactional
    public void updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 일반 회원만 현재 비밀번호 검증
        if ("local".equals(user.getProvider())) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
            }
        }

        String encodedNewPw = null;
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            encodedNewPw = passwordEncoder.encode(request.getNewPassword());
        }

        user.updateInfo(encodedNewPw, request.getPhone());
    }

    // ▼▼▼ [이 부분이 없어서 에러가 난 겁니다!] ▼▼▼

    // 1. 본인 확인 (디버깅 로그 포함)
    public void validateUserForPasswordReset(PasswordResetCheckRequest request) {
        System.out.println("========= [비밀번호 찾기 디버깅 시작] =========");
        System.out.println("1. 클라이언트 입력 이메일: " + request.getEmail());
        System.out.println("2. 클라이언트 입력 전화번호: " + request.getPhone());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("❌ 오류: 해당 이메일의 유저를 찾을 수 없음");
                    return new IllegalArgumentException("가입되지 않은 이메일입니다.");
                });

        System.out.println("3. DB에서 유저 찾음: " + user.getUsername() + " (" + user.getProvider() + ")");
        System.out.println("4. DB 저장된 전화번호: '" + user.getPhone() + "'");

        if ("google".equals(user.getProvider())) {
            throw new IllegalArgumentException("구글 소셜 로그인 회원은 비밀번호를 변경할 수 없습니다.");
        }

        if (user.getPhone() == null) {
            System.out.println("❌ 오류: DB에 전화번호가 NULL임");
            throw new IllegalArgumentException("회원정보에 등록된 전화번호가 없습니다.");
        }

        // 숫자만 남기고 비교 (하이픈 무시)
        String inputPhone = request.getPhone().replaceAll("[^0-9]", "");
        String dbPhone = user.getPhone().replaceAll("[^0-9]", "");

        System.out.println("5. 비교용 입력값(숫자만): " + inputPhone);
        System.out.println("6. 비교용 DB값(숫자만): " + dbPhone);

        if (!inputPhone.equals(dbPhone)) {
            System.out.println("❌ 결과: 불일치! (검증 실패)");
            throw new IllegalArgumentException("등록된 전화번호와 일치하지 않습니다.");
        }

        System.out.println("✅ 결과: 일치 성공! (검증 통과)");
        System.out.println("=============================================");
    }

    // 2. 비밀번호 변경 실행
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}