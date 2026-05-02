package com.naquarium.controller;

import com.naquarium.dto.AdminExhibitionRequest;
import com.naquarium.dto.ExhibitionDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/exhibitions")
@RequiredArgsConstructor
public class AdminExhibitionController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<ExhibitionDto>> getExhibitions() {
        return ResponseEntity.ok(adminService.getAllExhibitions());
    }

    @PostMapping
    public ResponseEntity<String> createExhibition(@RequestBody AdminExhibitionRequest request) {
        adminService.createExhibition(request);
        return ResponseEntity.ok("전시가 추가되었습니다.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateExhibition(
            @PathVariable Long id,
            @RequestBody AdminExhibitionRequest request) {
        adminService.updateExhibition(id, request);
        return ResponseEntity.ok("전시가 수정되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExhibition(@PathVariable Long id) {
        adminService.deleteExhibition(id);
        return ResponseEntity.ok("전시가 삭제되었습니다.");
    }
}
