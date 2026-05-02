package com.naquarium.controller;

import com.naquarium.dto.AdminProgramRequest;
import com.naquarium.dto.ProgramDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/programs")
@RequiredArgsConstructor
public class AdminProgramController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<ProgramDto>> getPrograms() {
        return ResponseEntity.ok(adminService.getAllPrograms());
    }

    @PostMapping
    public ResponseEntity<String> createProgram(@RequestBody AdminProgramRequest request) {
        adminService.createProgram(request);
        return ResponseEntity.ok("프로그램이 추가되었습니다.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProgram(
            @PathVariable Long id,
            @RequestBody AdminProgramRequest request) {
        adminService.updateProgram(id, request);
        return ResponseEntity.ok("프로그램이 수정되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProgram(@PathVariable Long id) {
        adminService.deleteProgram(id);
        return ResponseEntity.ok("프로그램이 삭제되었습니다.");
    }
}
