package com.naquarium.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private String visitDate;
    private String visitTime;
    private int adultCount;
    private int teenCount;
}