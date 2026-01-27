package com.aquarium.Naquarium.controller; // 패키지명 확인 (Controller 소문자 주의)

import com.aquarium.Naquarium.dto.LoginRequest; // [필수] LoginRequest import 확인
import com.aquarium.Naquarium.dto.SignupRequest;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager; // 로그인 담당관

    // 1. 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .provider("local")
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다!");
    }

    // 2. [추가됨] 로그인 (이게 없어서 안 되셨던 겁니다!)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            System.out.println("--- 컨트롤러 로그인 요청 진입 ---");
            System.out.println("입력 이메일: " + loginRequest.getEmail());
            System.out.println("입력 비번: " + loginRequest.getPassword());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // 2. 세션에 저장 (로그인 유지)
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

            System.out.println("=== 로그인 성공 및 세션 생성 완료 ===");
            return ResponseEntity.ok("로그인 성공");

        } catch (Exception e) {
            // [핵심] 여기서 에러의 정체를 밝힙니다.
            System.out.println("!!! 로그인 실패 원인(Exception) !!!");
            e.printStackTrace(); // 빨간 에러 메시지를 콘솔에 출력
            return ResponseEntity.status(401).body("로그인 실패: " + e.getMessage());
        }
    }

    // 3. 내 정보 확인
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("상태 체크 요청: " + auth);

        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("로그인되지 않음");
        }
        return ResponseEntity.ok(auth.getName());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // 세션 날리기
        }
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}