package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.ScheduleDto; // [IMPORT]
import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.service.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final AquariumService aquariumService;

    // 1. 테마 전시 목록
    @GetMapping("/exhibitions")
    public List<Exhibition> getExhibitions() {
        return aquariumService.getAllExhibitions();
    }

    // 2. [수정] 프로그램 일정 (DTO 변환 반환)
    @GetMapping("/schedules")
    public List<ScheduleDto> getSchedules() {
        return aquariumService.getAllSchedules().stream()
                .map(ScheduleDto::new) // 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }
}