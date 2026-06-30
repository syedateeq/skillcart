package com.ateeq.skillcart.dto.request;

import com.ateeq.skillcart.enums.CourseLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class CourseRequest {
    @NotBlank private String title;
    private String subtitle;
    private String description;
    private String instructorName;
    private String category;
    private CourseLevel level;
    @NotNull @PositiveOrZero private BigDecimal price;
    private String imageUrl;
    private Boolean published;
}
