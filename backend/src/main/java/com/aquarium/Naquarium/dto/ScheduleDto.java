package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.ProgramSchedule;
import lombok.Data;

import java.time.format.DateTimeFormatter;

/**
 * 일정 응답 DTO (홈 화면 스케줄 캘린더 표시용)
 * - ProgramSchedule 엔티티를 날짜/시간 문자열로 변환
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

    /** ProgramSchedule 엔티티 → DTO 변환 */
    public ScheduleDto(ProgramSchedule schedule) {
        this.id = schedule.getId();

        // 연결된 프로그램 정보 매핑 (null 방어)
        if (schedule.getProgram() != null) {
            this.programId = schedule.getProgram().getId();
            this.price = schedule.getProgram().getPrice();
            this.title = schedule.getProgram().getTitle();
        } else {
            this.title = "미정 프로그램";
            this.price = 0;
        }

        // 날짜/시간 포맷 변환
        if (schedule.getStartTime() != null) {
            this.date = schedule.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            this.time = schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            this.date = "";
            this.time = "";
        }

        this.place = schedule.getLocation();

        this.status = Boolean.TRUE.equals(schedule.getIsClosed()) ? "closed" : "open";
    }
}