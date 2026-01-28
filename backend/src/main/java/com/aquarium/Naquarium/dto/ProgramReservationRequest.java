package com.aquarium.Naquarium.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProgramReservationRequest {
    private Long programId;         // [변경] 스케줄ID 대신 프로그램ID 사용
    private String visitDate;       // YYYY-MM-DD
    private String visitTime;       // HH:mm (새로 추가)
    private int count;              // 인원수
}