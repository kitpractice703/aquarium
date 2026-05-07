package com.naquarium.controller;

import com.naquarium.dto.AdminProgramRequest;
import com.naquarium.dto.ProgramDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 프로그램 관리 컨트롤러 (/api/admin/programs/**)
 *
 * - GET    /api/admin/programs       전체 프로그램 목록 조회
 * - POST   /api/admin/programs       프로그램 생성
 * - PUT    /api/admin/programs/{id}  프로그램 수정
 * - DELETE /api/admin/programs/{id}  프로그램 삭제
 *
 * 프로그램 삭제 시 연관 스케줄도 함께 삭제해야 하므로
 * DB 레벨 cascade 설정 또는 별도 처리가 필요하다.
 */
@RestController
@RequestMapping("/api/admin/programs")
@RequiredArgsConstructor
public class AdminProgramController {

    private final AdminService adminService;

    /** GET /api/admin/programs - 전체 프로그램 목록 조회 */
    @GetMapping
    public ResponseEntity<List<ProgramDto>> getPrograms() {
        return ResponseEntity.ok(adminService.getAllPrograms());
    }

    /** POST /api/admin/programs - 프로그램 생성 */
    @PostMapping
    public ResponseEntity<String> createProgram(@RequestBody AdminProgramRequest request) {
        adminService.createProgram(request);
        return ResponseEntity.ok("프로그램이 추가되었습니다.");
    }

    /** PUT /api/admin/programs/{id} - 프로그램 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateProgram(
            @PathVariable Long id,
            @RequestBody AdminProgramRequest request) {
        adminService.updateProgram(id, request);
        return ResponseEntity.ok("프로그램이 수정되었습니다.");
    }

    /** DELETE /api/admin/programs/{id} - 프로그램 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProgram(@PathVariable Long id) {
        adminService.deleteProgram(id);
        return ResponseEntity.ok("프로그램이 삭제되었습니다.");
    }
}
