package com.naquarium.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProgramReservationRequest {
    private Long programId;
    private String visitDate;
    private String visitTime;
    private int count;
}