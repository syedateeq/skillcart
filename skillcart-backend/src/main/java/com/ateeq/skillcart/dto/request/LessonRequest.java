package com.ateeq.skillcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LessonRequest {
    @NotBlank private String title;
    private String content;
    private String resourceUrl;
    private String durationText;
    private Integer orderNumber;
    private Long sectionId;
}
