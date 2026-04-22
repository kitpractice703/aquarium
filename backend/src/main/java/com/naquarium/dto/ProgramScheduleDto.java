package com.naquarium.dto;

import com.naquarium.entity.ExperienceSchedule;
import com.naquarium.entity.PerformanceSchedule;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class ProgramScheduleDto {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private Long id;
    private Long programId;
    private String location;
    private String startTime;
    private boolean isClosed;

    public ProgramScheduleDto(PerformanceSchedule s) {
        this.id = s.getId();
        this.programId = s.getProgram().getId();
        this.location = s.getLocation();
        this.startTime = s.getStartTime().format(FORMATTER);
        this.isClosed = s.isClosed();
    }

    public ProgramScheduleDto(ExperienceSchedule s) {
        this.id = s.getId();
        this.programId = s.getProgram().getId();
        this.location = s.getLocation();
        this.startTime = s.getStartTime().format(FORMATTER);
        this.isClosed = s.isClosed();
    }
}
