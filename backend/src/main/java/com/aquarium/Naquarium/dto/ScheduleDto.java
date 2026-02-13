package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.ExperienceSchedule;
import com.aquarium.Naquarium.entity.PerformanceSchedule;
import com.aquarium.Naquarium.entity.Program;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 일정 응답 DTO (홈 화면 스케줄 캘린더 표시용)
 * - PerformanceSchedule / ExperienceSchedule 엔티티를 날짜/시간 문자열로 변환
 */
@Data
public class ScheduleDto {
    private Long id;
    private Long programId;
    private int price;
    /** 날짜 (yyyy-MM-dd 형식) */
    private String date;
    /** 시간 (HH:mm 형식) */
    private String time;
    private String title;
    private String place;
    /** 마감 상태: "open" 또는 "closed" */
    private String status;

    /** 공연 스케줄 → DTO 변환 */
    public ScheduleDto(PerformanceSchedule schedule) {
        init(schedule.getId(), schedule.getProgram(), schedule.getStartTime(),
                schedule.getLocation(), schedule.getIsClosed());
    }

    /** 체험 스케줄 → DTO 변환 */
    public ScheduleDto(ExperienceSchedule schedule) {
        init(schedule.getId(), schedule.getProgram(), schedule.getStartTime(),
                schedule.getLocation(), schedule.getIsClosed());
    }

    /** 공통 초기화 로직 */
    private void init(Long id, Program program, LocalDateTime startTime, String location, Boolean isClosed) {
        this.id = id;

        if (program != null) {
            this.programId = program.getId();
            this.price = program.getPrice();
            this.title = program.getTitle();
        } else {
            this.title = "미정 프로그램";
            this.price = 0;
        }

        if (startTime != null) {
            this.date = startTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            this.time = startTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            this.date = "";
            this.time = "";
        }

        this.place = location;
        this.status = Boolean.TRUE.equals(isClosed) ? "closed" : "open";
    }
}