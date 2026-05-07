package com.naquarium.service;

import com.naquarium.dto.SignupRequest;
import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원가입 서비스
 *
 * 이메일 중복 검증 후 BCrypt로 비밀번호를 암호화해 회원을 저장한다.
 * 이메일·비밀번호 로그인 처리는 AuthController에서
 * AuthenticationManager를 통해 직접 수행하며 이 클래스에서는 담당하지 않는다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 이메일·비밀번호 회원가입.
     * 이미 가입된 이메일이면 예외를 던진다.
     * 신규 회원의 role은 USER로, provider는 "local"로 고정한다.
     *
     * @param request 회원가입 요청 DTO
     * @throws IllegalArgumentException 이메일 중복 시
     */
    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 아이디(이메일)입니다.");
        }
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.USER)
                .provider("local")
                .build();
        userRepository.save(user);
    }
}
