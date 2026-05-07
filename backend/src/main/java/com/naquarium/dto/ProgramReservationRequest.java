package com.naquarium.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * POST /api/reservations/programs 요청 바디
 * 프로그램(체험·공연) 예매 요청. 해당 날짜 입장권 보유 여부는 서비스에서 검증한다.
 */
@Getter @Setter
public class ProgramReservationRequest {
    private Long programId;
    private String visitDate;
    private String visitTime;
    private int count;
}