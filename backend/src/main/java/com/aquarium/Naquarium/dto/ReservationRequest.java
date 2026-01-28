package com.aquarium.Naquarium.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private String visitDate;  // "2026-01-28"
    private String visitTime;  // "14:00"
    private int adultCount;
    private int teenCount;
    // totalPrice는 백엔드에서 계산하는 것이 안전하지만,
    // 편의상 프론트에서 주는 값을 믿거나 재계산 로직을 넣을 수 있습니다.
}