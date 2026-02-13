package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.PerformanceSchedule;
import com.aquarium.Naquarium.entity.Program;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 공연 일정 응답 DTO (홈 화면 스케줄 캘린더 표시용)
 * PerformanceSchedule 엔티티를 날짜/시간 문자열로 변환하여 프론트에 전달
 */
@Data
public class ScheduleDto {
    private Long id;
    private Long programId;
    private int price;
    private String date;
    private String time;
    private String title;
    private String place;
    private String status;

    /** 공연 스케줄 엔티티 → DTO 변환 */
    public ScheduleDto(PerformanceSchedule schedule) {
        this.id = schedule.getId();

        Program program = schedule.getProgram();
        if (program != null) {
            this.programId = program.getId();
            this.price = program.getPrice();
            this.title = program.getTitle();
        } else {
            this.title = "미정 프로그램";
            this.price = 0;
        }

        LocalDateTime startTime = schedule.getStartTime();
        if (startTime != null) {
            this.date = startTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            this.time = startTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            this.date = "";
            this.time = "";
        }

        this.place = schedule.getLocation();
        this.status = Boolean.TRUE.equals(schedule.getIsClosed()) ? "closed" : "open";
    }
}