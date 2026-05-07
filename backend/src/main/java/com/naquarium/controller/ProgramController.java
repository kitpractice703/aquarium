package com.naquarium.controller;

import com.naquarium.dto.ProgramDto;
import com.naquarium.dto.ProgramScheduleDto;
import com.naquarium.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 프로그램 공개 조회 컨트롤러 (/api/programs/**)
 *
 * 인증 없이 접근 가능한 프로그램 목록과 날짜별 스케줄을 제공한다.
 * 프로그램 예매 모달에서 초기 데이터 로딩에 사용된다.
 *
 * - GET /api/programs              전체 프로그램 목록
 * - GET /api/programs/{id}/schedules  특정 프로그램의 날짜별 스케줄
 */
@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    /** GET /api/programs - 전체 프로그램 목록 조회 */
    @GetMapping
    public List<ProgramDto> getAllPrograms() {
        return programService.getAllPrograms();
    }

    /**
     * GET /api/programs/{id}/schedules - 특정 프로그램의 날짜별 스케줄 조회
     * 프로그램 타입에 따라 서비스에서 적절한 스케줄 테이블을 조회한다.
     *
     * @param id   프로그램 ID
     * @param date 날짜 필터 (ISO 8601). null이면 전체 스케줄 반환
     * @return 200 OK (스케줄 목록) | 404 Not Found (프로그램 미존재)
     */
    @GetMapping("/{id}/schedules")
    public ResponseEntity<?> getSchedulesByProgramAndDate(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<ProgramScheduleDto> result = programService.getSchedulesByProgramAndDate(id, date);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
