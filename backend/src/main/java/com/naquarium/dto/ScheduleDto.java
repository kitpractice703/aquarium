package com.naquarium.dto;

import com.naquarium.entity.PerformanceSchedule;
import com.naquarium.entity.Program;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 홈 화면 공개 스케줄 조회 응답 DTO
 *
 * PerformanceSchedule 엔티티를 프론트엔드 ScheduleData 인터페이스 형식으로 변환한다.
 * status 필드는 isClosed 값에 따라 "open" | "closed" 문자열로 변환한다.
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
        this.status = schedule.isClosed() ? "closed" : "open";
    }
}