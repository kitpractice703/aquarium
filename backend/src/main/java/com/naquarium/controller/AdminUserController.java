package com.naquarium.controller;

import com.naquarium.dto.AdminUserDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 관리자 회원 관리 컨트롤러 (/api/admin/users/**)
 *
 * - GET    /api/admin/users          전체 회원 목록 조회 (검색 지원)
 * - PATCH  /api/admin/users/{id}/role  역할 변경 (USER ↔ ADMIN)
 * - DELETE /api/admin/users/{id}       회원 삭제
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminService adminService;

    /**
     * GET /api/admin/users - 전체 회원 목록 조회
     * @param search 이메일 또는 이름 검색어 (선택)
     */
    @GetMapping
    public ResponseEntity<List<AdminUserDto>> getUsers(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllUsers(search));
    }

    /**
     * PATCH /api/admin/users/{id}/role - 회원 역할 변경
     * @param body { "role": "USER" | "ADMIN" }
     */
    @PatchMapping("/{id}/role")
    public ResponseEntity<String> changeRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        adminService.changeUserRole(id, body.get("role"));
        return ResponseEntity.ok("권한이 변경되었습니다.");
    }

    /**
     * DELETE /api/admin/users/{id} - 회원 강제 탈퇴
     * 연관된 게시글·예약 데이터도 함께 삭제된다.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("회원이 탈퇴 처리되었습니다.");
    }
}
