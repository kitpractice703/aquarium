package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.LoginRequest;
import com.aquarium.Naquarium.dto.SignupRequest;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

/** 인증 컨트롤러 - 회원가입, 로그인(세션), 로그아웃, 현재 사용자 조회 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    /** 회원가입 (이메일 중복 시 409 Conflict 반환) */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 아이디(이메일)입니다.");
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
        return ResponseEntity.ok("회원가입이 완료되었습니다!");
    }

    /** 이메일/비밀번호 검증 후 SecurityContext를 세션에 바인딩 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            // 세션 생성 및 SecurityContext 바인딩 (JSESSIONID 쿠키로 인증 유지)
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
            return ResponseEntity.ok("로그인 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("로그인 실패: " + e.getMessage());
        }
    }

    /** 현재 인증 사용자 이메일 반환 (일반 로그인 / OAuth2 분기) */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("로그인되지 않음");
        }

        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            String email = oauth2.getPrincipal().getAttribute("email");
            return ResponseEntity.ok(email);
        }

        return ResponseEntity.ok(auth.getName());
    }

    /** 로그아웃 (세션 무효화) */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}