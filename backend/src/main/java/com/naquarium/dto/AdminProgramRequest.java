package com.naquarium.dto;

import lombok.Getter;

@Getter
public class AdminProgramRequest {
    private String title;
    private String description;
    private String type; // "PERFORMANCE" or "EXPERIENCE"
    private int price;
}
