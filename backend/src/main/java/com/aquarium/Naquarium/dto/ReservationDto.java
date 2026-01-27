package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.Reservation;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ReservationDto {
    private Long id;
    private String programTitle;
    private LocalDateTime startTime;
    private String location;
    private String status;
    private String imageUrl;

    public ReservationDto(Reservation reservation) {
        this.id = reservation.getId();
        this.status = reservation.getStatus().name();

        // 스케줄 정보 연결
        if (reservation.getSchedule() != null) {
            this.startTime = reservation.getSchedule().getStartTime();
            this.location = reservation.getSchedule().getLocation();

            if (reservation.getSchedule().getProgram() != null) {
                this.programTitle = reservation.getSchedule().getProgram().getTitle();
                this.imageUrl = reservation.getSchedule().getProgram().getImageUrl();
            }
        }
    }
}