package com.naquarium.controller;

import com.naquarium.dto.AdminUserDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminUserDto>> getUsers(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllUsers(search));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<String> changeRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        adminService.changeUserRole(id, body.get("role"));
        return ResponseEntity.ok("권한이 변경되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("회원이 탈퇴 처리되었습니다.");
    }
}
