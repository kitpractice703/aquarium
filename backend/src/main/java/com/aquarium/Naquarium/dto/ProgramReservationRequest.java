package com.aquarium.Naquarium.dto;

import lombok.Getter;
import lombok.Setter;

/** 프로그램(공연/체험) 예약 요청 DTO */
@Getter @Setter
public class ProgramReservationRequest {
    /** 예약 대상 프로그램 ID */
    private Long programId;
    /** 방문 날짜 (YYYY-MM-DD 형식) */
    private String visitDate;
    /** 방문 시간 (HH:mm 형식) */
    private String visitTime;
    /** 예약 인원수 */
    private int count;
}