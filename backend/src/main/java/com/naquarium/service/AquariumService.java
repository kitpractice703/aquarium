package com.naquarium.service;

import com.naquarium.entity.Exhibition;
import com.naquarium.entity.PerformanceSchedule;
import com.naquarium.repository.ExhibitionRepository;
import com.naquarium.repository.PerformanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    public List<PerformanceSchedule> getAllPerformanceSchedules() {
        return performanceScheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<PerformanceSchedule> getPerformanceSchedulesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return performanceScheduleRepository.findByStartTimeBetweenOrderByStartTimeAsc(startOfDay, endOfDay);
    }
}