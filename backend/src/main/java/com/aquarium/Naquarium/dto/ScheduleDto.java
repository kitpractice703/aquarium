package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.ProgramSchedule;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class ScheduleDto {
    private Long id;
    private String date; // [ADDED] 날짜 필드 추가 (예: "2026-02-01")
    private String time;
    private String title;
    private String place;
    private String status;

    public ScheduleDto(ProgramSchedule schedule) {
        this.id = schedule.getId();

        if (schedule.getStartTime() != null) {
            // [ADDED] 날짜 정보 추출 및 저장
            this.date = schedule.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            // 기존 시간 로직
            this.time = schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            this.date = "";
            this.time = "";
        }

        // ... (나머지 코드는 그대로 유지)
        if (schedule.getProgram() != null) {
            this.title = schedule.getProgram().getTitle();
        } else {
            this.title = "미정 프로그램";
        }

        this.place = schedule.getLocation();

        if (Boolean.TRUE.equals(schedule.getIsClosed())) {
            this.status = "closed";
        } else {
            this.status = "open";
        }
    }
}