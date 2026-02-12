package com.aquarium.Naquarium.dto;

import lombok.Data;

/** 입장권 예약 요청 DTO (프로그램 없이 관람권만 구매) */
@Data
public class ReservationRequest {
    private String visitDate;
    private String visitTime;
    /** 대인(만 13세 이상) 인원수 */
    private int adultCount;
    /** 소인(만 12세 이하) 인원수 */
    private int teenCount;
}