package com.naquarium.controller;

import com.naquarium.dto.PasswordResetCheckRequest;
import com.naquarium.dto.PasswordResetRequest;
import com.naquarium.dto.UserUpdateRequest;
import com.naquarium.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 회원정보 컨트롤러 (/api/users/**)
 *
 * - PUT  /api/users/me              회원정보 수정 (로그인 필요)
 * - POST /api/users/reset-password/check  비밀번호 재설정 1단계: 본인 확인 (공개)
 * - POST /api/users/reset-password        비밀번호 재설정 2단계: 새 비밀번호 저장 (공개)
 *
 * 비밀번호 재설정 엔드포인트는 SecurityConfig에서 permitAll로 설정해
 * 로그인 없이도 접근할 수 있다.
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * PUT /api/users/me - 마이페이지 회원정보 수정
     * SecurityContext에서 이메일을 추출해 사용자를 식별한다.
     *
     * @return 200 OK | 400 Bad Request (검증 실패) | 500 Internal Server Error
     */
    @PutMapping("/me")
    public ResponseEntity<String> updateMyInfo(@RequestBody UserUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        try {
            userService.updateUser(email, request);
            return ResponseEntity.ok("회원정보가 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to update user info for email: {}", email, e);
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    /**
     * POST /api/users/reset-password/check - 비밀번호 재설정 1단계 본인 확인
     * 이메일과 전화번호로 가입 여부를 확인한다.
     *
     * @return 200 OK (확인 완료) | 400 Bad Request (검증 실패)
     */
    @PostMapping("/reset-password/check")
    public ResponseEntity<?> checkUserForReset(@RequestBody PasswordResetCheckRequest request) {
        try {
            userService.validateUserForPasswordReset(request);
            return ResponseEntity.ok("본인 확인이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/users/reset-password - 비밀번호 재설정 2단계 새 비밀번호 저장
     * 1단계 통과 후 호출해야 하며, 서버는 두 단계를 별도로 상태 관리하지 않는다.
     *
     * @return 200 OK | 400 Bad Request
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("비밀번호 변경 실패: " + e.getMessage());
        }
    }
}
