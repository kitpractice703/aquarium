package com.naquarium.controller;

import com.naquarium.dto.AdminReviewDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 후기 관리 컨트롤러 (/api/admin/reviews/**)
 *
 * - GET    /api/admin/reviews       전체 후기 목록 조회 (최신순)
 * - DELETE /api/admin/reviews/{id}  후기 삭제
 */
@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final AdminService adminService;

    /** GET /api/admin/reviews - 전체 후기 목록 조회 (최신순) */
    @GetMapping
    public ResponseEntity<List<AdminReviewDto>> getReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    /** DELETE /api/admin/reviews/{id} - 후기 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.ok("후기가 삭제되었습니다.");
    }
}
