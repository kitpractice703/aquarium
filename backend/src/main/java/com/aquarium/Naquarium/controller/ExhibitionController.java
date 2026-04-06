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

/** 공개 API 컨트롤러 - 전시관 목록, 공연 일정 조회 (인증 불필요) */
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

    /** 공연 일정 조회 (체험 제외) - date 미전달 시 전체, ProgramController에서 체험 스케줄 개별 조회 */
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