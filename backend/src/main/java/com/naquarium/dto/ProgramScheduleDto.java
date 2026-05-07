package com.naquarium.dto;

import com.naquarium.entity.ExperienceSchedule;
import com.naquarium.entity.PerformanceSchedule;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

/**
 * 프로그램 스케줄 응답 DTO (예매 모달 시간대 선택용)
 *
 * 공연·체험 스케줄 엔티티를 동일한 형식으로 변환한다.
 * startTime은 "yyyy-MM-dd HH:mm:ss" 형식으로 직렬화되며,
 * 프론트엔드에서 split(" ")[1].substring(0, 5) 로 "HH:mm"을 추출한다.
 */
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
