package com.naquarium.controller;

import com.naquarium.entity.ExperienceSchedule;
import com.naquarium.entity.PerformanceSchedule;
import com.naquarium.entity.Program;
import com.naquarium.repository.ExperienceScheduleRepository;
import com.naquarium.repository.PerformanceScheduleRepository;
import com.naquarium.repository.ProgramRepository;
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

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramRepository programRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ExperienceScheduleRepository experienceScheduleRepository;

    @GetMapping
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

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
                    ? performanceScheduleRepository.findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(id, startOfDay, endOfDay)
                    : performanceScheduleRepository.findByProgramId(id);
            result = schedules.stream().map(ScheduleResponse::new).collect(Collectors.toList());
        } else {
            List<ExperienceSchedule> schedules = (date != null)
                    ? experienceScheduleRepository.findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(id, startOfDay, endOfDay)
                    : experienceScheduleRepository.findByProgramId(id);
            result = schedules.stream().map(ScheduleResponse::new).collect(Collectors.toList());
        }

        return ResponseEntity.ok(result);
    }

    @Data
    static class ScheduleResponse {
        private Long id;
        private Long programId;
        private String location;
        private String startTime;
        private boolean isClosed;

        ScheduleResponse(PerformanceSchedule s) {
            this.id = s.getId();
            this.programId = s.getProgram().getId();
            this.location = s.getLocation();
            this.startTime = s.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            this.isClosed = s.isClosed();
        }

        ScheduleResponse(ExperienceSchedule s) {
            this.id = s.getId();
            this.programId = s.getProgram().getId();
            this.location = s.getLocation();
            this.startTime = s.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            this.isClosed = s.isClosed();
        }
    }
}
