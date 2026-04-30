package com.naquarium.controller;

import com.naquarium.dto.ScheduleDto;
import com.naquarium.entity.Exhibition;
import com.naquarium.service.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExhibitionController {

    private final AquariumService aquariumService;

    @GetMapping("/exhibitions")
    public List<Exhibition> getExhibitions() {
        return aquariumService.getAllExhibitions();
    }

    @GetMapping("/schedules")
    public List<ScheduleDto> getSchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (date != null) {
            return aquariumService.getPerformanceSchedulesByDate(date);
        }
        return aquariumService.getAllPerformanceSchedules();
    }
}