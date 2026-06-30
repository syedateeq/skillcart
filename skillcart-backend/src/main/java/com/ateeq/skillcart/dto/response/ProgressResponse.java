package com.ateeq.skillcart.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProgressResponse {
    private Long courseId;
    private Long lessonId;
    private Double progressPercentage;
    private Boolean completed;
    private String message;
}
