package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.entity.ExperienceSchedule;
import com.aquarium.Naquarium.entity.PerformanceSchedule;
import com.aquarium.Naquarium.entity.Program;
import com.aquarium.Naquarium.repository.ExperienceScheduleRepository;
import com.aquarium.Naquarium.repository.PerformanceScheduleRepository;
import com.aquarium.Naquarium.repository.ProgramRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 프로그램 API 컨트롤러 (인증 불필요)
 * - 전체 프로그램 목록 조회: GET /api/programs
 * - 프로그램별 스케줄 조회: GET /api/programs/{id}/schedules?date=
 */
@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramRepository programRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ExperienceScheduleRepository experienceScheduleRepository;

    /** 전체 프로그램 목록 조회 */
    @GetMapping
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    /**
     * 특정 프로그램의 날짜별 스케줄 조회
     * - PERFORMANCE → performance_schedules 조회
     * - EXPERIENCE → experience_schedules 조회
     */
    @GetMapping("/{id}/schedules")
    public ResponseEntity<?> getSchedulesByProgramAndDate(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Program program = programRepository.findById(id).orElse(null);
        if (program == null) {
            return ResponseEntity.notFound().build();
        }

        LocalDateTime startOfDay = (date != null) ? date.atStartOfDay() : null;
        LocalDateTime endOfDay = (date != null) ? date.atTime(23, 59, 59) : null;
        List<ScheduleResponse> result;

        if (program.getType() == Program.ProgramType.PERFORMANCE) {
            List<PerformanceSchedule> schedules = (date != null)
                    ? performanceScheduleRepository.findByProgramIdAndStartTimeBetween(id, startOfDay, endOfDay)
                    : performanceScheduleRepository.findByProgramId(id);
            result = schedules.stream().map(ScheduleResponse::new).collect(Collectors.toList());
        } else {
            List<ExperienceSchedule> schedules = (date != null)
                    ? experienceScheduleRepository.findByProgramIdAndStartTimeBetween(id, startOfDay, endOfDay)
                    : experienceScheduleRepository.findByProgramId(id);
            result = schedules.stream().map(ScheduleResponse::new).collect(Collectors.toList());
        }

        return ResponseEntity.ok(result);
    }

    /** 스케줄 응답 DTO (프론트엔드 ProgramSchedule 타입에 대응) */
    @Data
    static class ScheduleResponse {
        private Long id;
        private Long programId;
        private String location;
        /** "yyyy-MM-dd HH:mm:ss" 형식 (프론트엔드에서 split(" ")로 파싱) */
        private String startTime;
        private boolean isClosed;

        ScheduleResponse(PerformanceSchedule s) {
            this.id = s.getId();
            this.programId = s.getProgram().getId();
            this.location = s.getLocation();
            this.startTime = s.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            this.isClosed = Boolean.TRUE.equals(s.getIsClosed());
        }

        ScheduleResponse(ExperienceSchedule s) {
            this.id = s.getId();
            this.programId = s.getProgram().getId();
            this.location = s.getLocation();
            this.startTime = s.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            this.isClosed = Boolean.TRUE.equals(s.getIsClosed());
        }
    }
}
