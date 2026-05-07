package com.naquarium.service;

import com.naquarium.dto.ProgramDto;
import com.naquarium.dto.ProgramScheduleDto;
import com.naquarium.entity.Program;
import com.naquarium.repository.ExperienceScheduleRepository;
import com.naquarium.repository.PerformanceScheduleRepository;
import com.naquarium.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 프로그램·스케줄 공개 조회 서비스
 *
 * 프로그램 예매 모달에서 사용하는 프로그램 목록과 날짜별 스케줄을 제공한다.
 * 프로그램 타입(PERFORMANCE / EXPERIENCE)에 따라 조회 대상 레포지토리를 분기한다.
 */
@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ExperienceScheduleRepository experienceScheduleRepository;

    /** 전체 프로그램 목록 조회 (공개, 인증 불필요) */
    @Transactional(readOnly = true)
    public List<ProgramDto> getAllPrograms() {
        return programRepository.findAll().stream()
                .map(ProgramDto::new).collect(Collectors.toList());
    }

    /**
     * 특정 프로그램의 날짜별 스케줄 조회.
     * 프로그램 타입에 따라 performance_schedules 또는 experience_schedules를 조회한다.
     * date가 null이면 해당 프로그램의 전체 스케줄을 반환한다.
     *
     * @param programId 조회할 프로그램 ID
     * @param date      날짜 필터 (null이면 전체 조회)
     * @return 시작 시간 오름차순 스케줄 목록
     */
    @Transactional(readOnly = true)
    public List<ProgramScheduleDto> getSchedulesByProgramAndDate(Long programId, LocalDate date) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));

        LocalDateTime startOfDay = (date != null) ? date.atStartOfDay() : null;
        LocalDateTime endOfDay = (date != null) ? date.atTime(23, 59, 59) : null;

        if (program.getType() == Program.ProgramType.PERFORMANCE) {
            return (date != null
                    ? performanceScheduleRepository.findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(programId, startOfDay, endOfDay)
                    : performanceScheduleRepository.findByProgramId(programId))
                    .stream()
                    .map(ProgramScheduleDto::new)
                    .collect(Collectors.toList());
        } else {
            return (date != null
                    ? experienceScheduleRepository.findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(programId, startOfDay, endOfDay)
                    : experienceScheduleRepository.findByProgramId(programId))
                    .stream()
                    .map(ProgramScheduleDto::new)
                    .collect(Collectors.toList());
        }
    }
}
