package com.aquarium.Naquarium.controller;

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

    @PutMapping("/me")
    public ResponseEntity<String> updateMyInfo(@RequestBody UserUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // CustomOAuth2UserService 등에서 저장한 방식에 따라 이메일 추출
        // (PostApiController나 ReservationController에 있는 getEmail 로직 활용 권장)
        String email = auth.getName();

        // *주의: 만약 구글 로그인이라면 auth.getPrincipal()에서 속성을 꺼내야 할 수 있습니다.
        // 기존 컨트롤러들의 getEmail 메서드를 참고하세요.

        try {
            userService.updateUser(email, request);
            return ResponseEntity.ok("회원정보가 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }
}