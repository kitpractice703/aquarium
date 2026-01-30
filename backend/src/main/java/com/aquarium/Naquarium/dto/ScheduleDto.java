package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.ProgramSchedule;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class ScheduleDto {
    private Long id;
    private Long programId; // [추가] 예약 요청을 위해 필요
    private int price;      // [추가] 결제 금액 계산을 위해 필요
    private String date;
    private String time;
    private String title;
    private String place;
    private String status;

    public ScheduleDto(ProgramSchedule schedule) {
        this.id = schedule.getId();

        // [추가] Program 엔티티에서 정보 가져오기
        if (schedule.getProgram() != null) {
            this.programId = schedule.getProgram().getId();
            this.price = schedule.getProgram().getPrice();
            this.title = schedule.getProgram().getTitle();
        } else {
            this.title = "미정 프로그램";
            this.price = 0;
        }

        if (schedule.getStartTime() != null) {
            this.date = schedule.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            this.time = schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        } else {
            this.date = "";
            this.time = "";
        }

        this.place = schedule.getLocation();

        if (Boolean.TRUE.equals(schedule.getIsClosed())) {
            this.status = "closed";
        } else {
            this.status = "open";
        }
    }
}