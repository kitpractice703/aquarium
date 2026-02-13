package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.entity.PerformanceSchedule;
import com.aquarium.Naquarium.repository.ExhibitionRepository;
import com.aquarium.Naquarium.repository.PerformanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 아쿠아리움 공개 데이터 서비스
 * 전시관, 공연 프로그램 일정 등 인증 없이 접근 가능한 데이터 조회 담당
 */
@Service
@RequiredArgsConstructor
public class AquariumService {

    private final ExhibitionRepository exhibitionRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;

    /** 전체 전시관 목록 조회 */
    @Transactional(readOnly = true)
    public List<Exhibition> getAllExhibitions() {
        return exhibitionRepository.findAll();
    }

    /** 전체 공연 일정 조회 */
    @Transactional(readOnly = true)
    public List<PerformanceSchedule> getAllPerformanceSchedules() {
        return performanceScheduleRepository.findAll();
    }

    /** 특정 날짜의 공연 일정 조회 */
    @Transactional(readOnly = true)
    public List<PerformanceSchedule> getPerformanceSchedulesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return performanceScheduleRepository.findByStartTimeBetween(startOfDay, endOfDay);
    }
}