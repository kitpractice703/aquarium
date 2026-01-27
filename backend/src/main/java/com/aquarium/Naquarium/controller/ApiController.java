package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.entity.ProgramSchedule;
import com.aquarium.Naquarium.service.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // HTML 파일이 아니라 데이터(JSON)를 돌려주는 컨트롤러
@RequestMapping("/api") // 모든 주소 앞에 /api가 붙음
@RequiredArgsConstructor
public class ApiController {

    private final AquariumService aquariumService;

    // 1. 테마 전시 목록 데이터 주기
    // 주소: http://localhost:8080/api/exhibitions
    @GetMapping("/exhibitions")
    public List<Exhibition> getExhibitions() {
        return aquariumService.getAllExhibitions();
    }

    // 2. 프로그램 일정 데이터 주기
    // 주소: http://localhost:8080/api/schedules
    @GetMapping("/schedules")
    public List<ProgramSchedule> getSchedules() {
        return aquariumService.getAllSchedules();
    }
}