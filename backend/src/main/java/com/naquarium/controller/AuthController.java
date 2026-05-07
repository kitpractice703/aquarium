package com.naquarium.controller;

import com.naquarium.config.JwtProvider;
import com.naquarium.dto.LoginRequest;
import com.naquarium.dto.SignupRequest;
import com.naquarium.dto.UserInfoDto;
import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import com.naquarium.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 인증 컨트롤러 (공개 엔드포인트, /api/auth/**)
 *
 * 회원가입, 이메일·비밀번호 로그인, 세션 확인, 로그아웃을 처리한다.
 * Google OAuth2 로그인은 Spring Security가 /oauth2/** 경로에서 직접 처리한다.
 *
 * 로그인 흐름:
 *   AuthenticationManager.authenticate() → CustomUserDetailsService.loadUserByUsername()
 *   → 비밀번호 검증 → JWT 생성 → 클라이언트에 반환
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    /**
     * POST /api/auth/signup - 회원가입
     *
     * @return 200 OK (성공) | 409 Conflict (이메일 중복)
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        try {
            authService.signup(request);
            return ResponseEntity.ok("회원가입이 완료되었습니다!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * POST /api/auth/login - 이메일·비밀번호 로그인
     * AuthenticationManager가 인증을 처리하며, 성공 시 JWT를 반환한다.
     *
     * @return 200 OK { "token": "..." } | 401 Unauthorized (인증 실패)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            // 첫 번째 권한에서 "ROLE_" 접두사를 제거해 역할명만 추출
            String role = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");
            String token = jwtProvider.generateToken(authentication.getName(), role);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            log.error("Login failed for email: {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    /**
     * GET /api/auth/me - 현재 로그인 사용자 정보 조회 (세션 검증용)
     * JwtFilter가 토큰을 검증하고 SecurityContext에 등록한 인증 정보를 사용한다.
     *
     * @return 200 OK (사용자 정보) | 401 Unauthorized | 404 Not Found
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).body("로그인되지 않음");
        }
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(new UserInfoDto(user));
    }

    /**
     * POST /api/auth/logout - 로그아웃
     * JWT는 Stateless이므로 서버 측 세션 무효화가 없다.
     * 실제 로그아웃은 클라이언트에서 localStorage 토큰을 삭제해 처리한다.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}
