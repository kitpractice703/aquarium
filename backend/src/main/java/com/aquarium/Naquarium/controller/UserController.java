package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.PasswordResetCheckRequest;
import com.aquarium.Naquarium.dto.PasswordResetRequest;
import com.aquarium.Naquarium.dto.UserUpdateRequest;
import com.aquarium.Naquarium.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1. 내 정보 수정 (로그인한 사용자만 가능)
    @PutMapping("/me")
    public ResponseEntity<String> updateMyInfo(@RequestBody UserUpdateRequest request) {
        // 현재 로그인한 사용자의 이메일 가져오기
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        try {
            userService.updateUser(email, request);
            return ResponseEntity.ok("회원정보가 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // 서버 에러 로그 출력
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    // 2. [비밀번호 찾기] 본인 확인 (이메일 + 전화번호)
    @PostMapping("/reset-password/check")
    public ResponseEntity<?> checkUserForReset(@RequestBody PasswordResetCheckRequest request) {
        try {
            userService.validateUserForPasswordReset(request);
            return ResponseEntity.ok("본인 확인이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. [비밀번호 찾기] 비밀번호 변경 실행
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