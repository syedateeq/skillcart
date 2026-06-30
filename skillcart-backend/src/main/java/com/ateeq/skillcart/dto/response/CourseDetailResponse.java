package com.ateeq.skillcart.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseDetailResponse {
    private CourseResponse course;
    private List<LessonResponse> lessons;
}
