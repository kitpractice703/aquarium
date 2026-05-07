package com.naquarium.service;

import com.naquarium.dto.ExhibitionDto;
import com.naquarium.dto.ScheduleDto;
import com.naquarium.repository.ExhibitionRepository;
import com.naquarium.repository.PerformanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 공개 아쿠아리움 정보 서비스
 *
 * 인증 없이 접근 가능한 전시 목록과 스케줄 조회를 담당한다.
 * 홈 화면 프로그램 섹션의 날짜별 스케줄 조회에 사용된다.
 *
 * 현재 공연(PERFORMANCE) 스케줄만 조회하며,
 * 체험(EXPERIENCE) 스케줄은 ProgramService를 통해 프로그램별로 조회한다.
 */
@Service
@RequiredArgsConstructor
public class AquariumService {

    private final ExhibitionRepository exhibitionRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;

    /** 전체 전시 목록 조회 */
    @Transactional(readOnly = true)
    public List<ExhibitionDto> getAllExhibitions() {
        return exhibitionRepository.findAll().stream()
                .map(ExhibitionDto::new).collect(Collectors.toList());
    }

    /** 전체 공연 스케줄 조회 (날짜 필터 없음) */
    @Transactional(readOnly = true)
    public List<ScheduleDto> getAllPerformanceSchedules() {
        return performanceScheduleRepository.findAll().stream()
                .map(ScheduleDto::new).collect(Collectors.toList());
    }

    /**
     * 날짜별 공연 스케줄 조회 (홈 화면 프로그램 섹션용).
     * 하루 범위(00:00 ~ 23:59:59)로 조회해 시작 시간 오름차순으로 반환한다.
     *
     * @param date 조회할 날짜
     */
    @Transactional(readOnly = true)
    public List<ScheduleDto> getPerformanceSchedulesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return performanceScheduleRepository.findByStartTimeBetweenOrderByStartTimeAsc(startOfDay, endOfDay)
                .stream().map(ScheduleDto::new).collect(Collectors.toList());
    }
}
