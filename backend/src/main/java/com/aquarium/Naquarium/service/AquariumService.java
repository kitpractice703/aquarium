package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.entity.ExperienceSchedule;
import com.aquarium.Naquarium.entity.PerformanceSchedule;
import com.aquarium.Naquarium.repository.ExhibitionRepository;
import com.aquarium.Naquarium.repository.ExperienceScheduleRepository;
import com.aquarium.Naquarium.repository.PerformanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 아쿠아리움 핵심 데이터 서비스
 * - 전시관, 공연/체험 프로그램 일정 등 공개 데이터 조회
 * - 읽기 전용 트랜잭션으로 JPA 변경 감지 비활성화 (성능 최적화)
 */
@Service
@RequiredArgsConstructor
public class AquariumService {

    private final ExhibitionRepository exhibitionRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ExperienceScheduleRepository experienceScheduleRepository;

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

    /** 전체 체험 일정 조회 */
    @Transactional(readOnly = true)
    public List<ExperienceSchedule> getAllExperienceSchedules() {
        return experienceScheduleRepository.findAll();
    }

    /** 특정 날짜의 체험 일정 조회 */
    @Transactional(readOnly = true)
    public List<ExperienceSchedule> getExperienceSchedulesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return experienceScheduleRepository.findByStartTimeBetween(startOfDay, endOfDay);
    }
}