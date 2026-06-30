package com.ateeq.skillcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseSectionRequest {
    @NotBlank
    private String title;
    private Integer orderNumber;
}
