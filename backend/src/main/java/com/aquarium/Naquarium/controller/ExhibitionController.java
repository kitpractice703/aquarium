package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.ScheduleDto;
import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.service.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 공개 API 컨트롤러 (인증 불필요)
 * 전시관 목록, 공연 일정 조회 등 비로그인 사용자도 접근 가능
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExhibitionController {

    private final AquariumService aquariumService;

    /** 전체 전시관 목록 반환 */
    @GetMapping("/exhibitions")
    public List<Exhibition> getExhibitions() {
        return aquariumService.getAllExhibitions();
    }

    /**
     * 공연 프로그램 일정 조회 (홈 화면 스케줄 캘린더용)
     * 체험 프로그램은 포함하지 않으며, 체험 스케줄은 ProgramController에서 개별 조회
     * @param date 조회 날짜 (미전달 시 전체 일정)
     */
    @GetMapping("/schedules")
    public List<ScheduleDto> getSchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (date != null) {
            return aquariumService.getPerformanceSchedulesByDate(date).stream()
                    .map(ScheduleDto::new).collect(Collectors.toList());
        }
        return aquariumService.getAllPerformanceSchedules().stream()
                .map(ScheduleDto::new).collect(Collectors.toList());
    }
}