package com.naquarium.controller;

import com.naquarium.dto.AdminExhibitionRequest;
import com.naquarium.dto.ExhibitionDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 전시 관리 컨트롤러 (/api/admin/exhibitions/**)
 *
 * - GET    /api/admin/exhibitions       전시 목록 조회
 * - POST   /api/admin/exhibitions       전시 생성
 * - PUT    /api/admin/exhibitions/{id}  전시 수정
 * - DELETE /api/admin/exhibitions/{id}  전시 삭제
 */
@RestController
@RequestMapping("/api/admin/exhibitions")
@RequiredArgsConstructor
public class AdminExhibitionController {

    private final AdminService adminService;

    /** GET /api/admin/exhibitions - 전체 전시 목록 조회 */
    @GetMapping
    public ResponseEntity<List<ExhibitionDto>> getExhibitions() {
        return ResponseEntity.ok(adminService.getAllExhibitions());
    }

    /** POST /api/admin/exhibitions - 전시 생성 */
    @PostMapping
    public ResponseEntity<String> createExhibition(@RequestBody AdminExhibitionRequest request) {
        adminService.createExhibition(request);
        return ResponseEntity.ok("전시가 추가되었습니다.");
    }

    /** PUT /api/admin/exhibitions/{id} - 전시 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateExhibition(
            @PathVariable Long id,
            @RequestBody AdminExhibitionRequest request) {
        adminService.updateExhibition(id, request);
        return ResponseEntity.ok("전시가 수정되었습니다.");
    }

    /** DELETE /api/admin/exhibitions/{id} - 전시 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExhibition(@PathVariable Long id) {
        adminService.deleteExhibition(id);
        return ResponseEntity.ok("전시가 삭제되었습니다.");
    }
}
