package com.naquarium.dto;

import lombok.Getter;

@Getter
public class AdminScheduleRequest {
    private Long programId;
    private String location;
    private String startTime; // "yyyy-MM-dd HH:mm"
}
