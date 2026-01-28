package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.ProgramSchedule;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class ScheduleDto {
    private Long id;
    private String time;      // "14:00" 형태
    private String title;     // "돌고래의 꿈"
    private String place;     // "오션 아레나"
    private String status;    // "open", "closed", "ready"

    public ScheduleDto(ProgramSchedule schedule) {
        this.id = schedule.getId();

        // 1. 시간 포맷팅 (2025-01-28 14:00:00 -> "14:00")
        if (schedule.getStartTime() != null) {
            this.time = schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            this.time = "";
        }

        // 2. 프로그램 제목 가져오기 (Null 방어)
        if (schedule.getProgram() != null) {
            this.title = schedule.getProgram().getTitle();
        } else {
            this.title = "미정 프로그램";
        }

        this.place = schedule.getLocation();

        // 3. 상태 결정 로직 (간단한 예시)
        if (Boolean.TRUE.equals(schedule.getIsClosed())) {
            this.status = "closed";
        } else {
            this.status = "open"; // 기본은 open으로 두고, 필요하면 시간 비교 로직 추가 가능
        }
    }
}