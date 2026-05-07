package com.naquarium.controller;

import com.naquarium.dto.ExhibitionDto;
import com.naquarium.dto.ScheduleDto;
import com.naquarium.service.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * 전시·스케줄 공개 조회 컨트롤러 (/api/**)
 *
 * 인증 없이 접근 가능한 전시 목록과 날짜별 스케줄을 제공한다.
 * 홈 화면의 프로그램 섹션에서 호출된다.
 *
 * - GET /api/exhibitions  전시 목록 조회
 * - GET /api/schedules    공연 스케줄 조회 (날짜 필터 선택)
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExhibitionController {

    private final AquariumService aquariumService;

    /** GET /api/exhibitions - 전체 전시 목록 조회 */
    @GetMapping("/exhibitions")
    public List<ExhibitionDto> getExhibitions() {
        return aquariumService.getAllExhibitions();
    }

    /**
     * GET /api/schedules - 공연 스케줄 조회
     *
     * @param date 날짜 필터 (ISO 8601, YYYY-MM-DD). null이면 전체 조회
     * @return 시작 시간 오름차순 스케줄 목록
     */
    @GetMapping("/schedules")
    public List<ScheduleDto> getSchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (date != null) {
            return aquariumService.getPerformanceSchedulesByDate(date);
        }
        return aquariumService.getAllPerformanceSchedules();
    }
}
