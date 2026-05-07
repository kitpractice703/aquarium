package com.naquarium.dto;

import com.naquarium.entity.ExperienceSchedule;
import com.naquarium.entity.PerformanceSchedule;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

/**
 * 관리자 스케줄 목록 응답 DTO
 *
 * 공연(PerformanceSchedule)·체험(ExperienceSchedule) 두 엔티티를 동일한 형식으로 변환한다.
 * programType 필드로 두 타입을 구분하며, AdminService에서 합산 후 정렬한다.
 * startTime은 "yyyy-MM-dd HH:mm" 형식으로 직렬화해 프론트엔드와 형식을 통일한다.
 */
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
