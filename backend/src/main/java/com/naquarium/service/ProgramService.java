package com.naquarium.service;

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

@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ExperienceScheduleRepository experienceScheduleRepository;

    @Transactional(readOnly = true)
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

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
