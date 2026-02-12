package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.entity.ProgramSchedule;
import com.aquarium.Naquarium.repository.ExhibitionRepository;
import com.aquarium.Naquarium.repository.ProgramScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 아쿠아리움 핵심 데이터 서비스
 * - 전시관, 프로그램 일정 등 공개 데이터 조회
 * - 읽기 전용 트랜잭션으로 JPA 변경 감지 비활성화 (성능 최적화)
 */
@Service
@RequiredArgsConstructor
public class AquariumService {

    private final ExhibitionRepository exhibitionRepository;
    private final ProgramScheduleRepository programScheduleRepository;

    /** 전체 전시관 목록 조회 */
    @Transactional(readOnly = true)
    public List<Exhibition> getAllExhibitions() {
        return exhibitionRepository.findAll();
    }

    /** 전체 프로그램 일정 조회 */
    @Transactional(readOnly = true)
    public List<ProgramSchedule> getAllSchedules() {
        return programScheduleRepository.findAll();
    }

    /** 특정 날짜의 프로그램 일정 조회 (해당일 00:00~23:59 범위) */
    @Transactional(readOnly = true)
    public List<ProgramSchedule> getSchedulesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return programScheduleRepository.findByStartTimeBetween(startOfDay, endOfDay);
    }
}