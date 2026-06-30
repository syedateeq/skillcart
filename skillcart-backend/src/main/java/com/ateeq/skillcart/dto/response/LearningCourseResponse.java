package com.ateeq.skillcart.dto.response;

import lombok.*;

import java.util.List;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LearningCourseResponse {
    private CourseResponse course;
    private List<LessonResponse> lessons;
    private Set<Long> completedLessonIds;
    private Double progressPercentage;
    private Boolean completed;
}
