package com.naquarium.dto;

import com.naquarium.entity.Program;
import lombok.Getter;

@Getter
public class ProgramDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private int price;
    private String type;

    public ProgramDto(Program program) {
        this.id = program.getId();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.imageUrl = program.getImageUrl();
        this.price = program.getPrice();
        this.type = program.getType() != null ? program.getType().name() : null;
    }
}
