package com.naquarium.dto;

import com.naquarium.entity.ExperienceSchedule;
import com.naquarium.entity.PerformanceSchedule;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class AdminScheduleDto {
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private Long id;
    private Long programId;
    private String programTitle;
    private String programType;
    private String location;
    private String startTime;
    private boolean isClosed;

    public AdminScheduleDto(PerformanceSchedule s) {
        this.id = s.getId();
        this.programId = s.getProgram() != null ? s.getProgram().getId() : null;
        this.programTitle = s.getProgram() != null ? s.getProgram().getTitle() : "미정";
        this.programType = "PERFORMANCE";
        this.location = s.getLocation();
        this.startTime = s.getStartTime() != null ? s.getStartTime().format(FMT) : "";
        this.isClosed = s.isClosed();
    }

    public AdminScheduleDto(ExperienceSchedule s) {
        this.id = s.getId();
        this.programId = s.getProgram() != null ? s.getProgram().getId() : null;
        this.programTitle = s.getProgram() != null ? s.getProgram().getTitle() : "미정";
        this.programType = "EXPERIENCE";
        this.location = s.getLocation();
        this.startTime = s.getStartTime() != null ? s.getStartTime().format(FMT) : "";
        this.isClosed = s.isClosed();
    }
}
