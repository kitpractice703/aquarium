package com.naquarium.dto;

import com.naquarium.entity.Exhibition;
import lombok.Getter;

@Getter
public class ExhibitionDto {
    private Long id;
    private String title;
    private String subTitle;
    private String description;
    private String themeColor;

    public ExhibitionDto(Exhibition exhibition) {
        this.id = exhibition.getId();
        this.title = exhibition.getTitle();
        this.subTitle = exhibition.getSubTitle();
        this.description = exhibition.getDescription();
        this.themeColor = exhibition.getThemeColor();
    }
}
