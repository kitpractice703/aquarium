package com.naquarium.service;

import com.naquarium.dto.ScheduleDto;
import com.naquarium.entity.Exhibition;
import com.naquarium.repository.ExhibitionRepository;
import com.naquarium.repository.PerformanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AquariumService {

    private final ExhibitionRepository exhibitionRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;

    @Transactional(readOnly = true)
    public List<Exhibition> getAllExhibitions() {
        return exhibitionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<ScheduleDto> getAllPerformanceSchedules() {
        return performanceScheduleRepository.findAll().stream()
                .map(ScheduleDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleDto> getPerformanceSchedulesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return performanceScheduleRepository.findByStartTimeBetweenOrderByStartTimeAsc(startOfDay, endOfDay)
                .stream().map(ScheduleDto::new).collect(Collectors.toList());
    }
}