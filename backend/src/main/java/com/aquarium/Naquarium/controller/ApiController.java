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
 * - 전시관 목록, 프로그램 일정 조회 등 비로그인 사용자도 접근 가능한 API
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final AquariumService aquariumService;

    /** 전체 전시관 목록 조회 */
    @GetMapping("/exhibitions")
    public List<Exhibition> getExhibitions() {
        return aquariumService.getAllExhibitions();
    }

    /**
     * 프로그램 일정 조회
     * @param date 조회할 날짜 (미전달 시 전체 일정 반환)
     */
    @GetMapping("/schedules")
    public List<ScheduleDto> getSchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return aquariumService.getSchedulesByDate(date).stream()
                    .map(ScheduleDto::new)
                    .collect(Collectors.toList());
        }
        return aquariumService.getAllSchedules().stream()
                .map(ScheduleDto::new)
                .collect(Collectors.toList());
    }
}