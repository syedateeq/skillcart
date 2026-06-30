package com.ateeq.skillcart.dto.response;

import com.ateeq.skillcart.model.CourseSection;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CourseSectionResponse {
    private Long id;
    private Long courseId;
    private String title;
    private Integer orderNumber;
    private List<LessonResponse> lessons;

    public static CourseSectionResponse from(CourseSection section, List<LessonResponse> lessons) {
        return CourseSectionResponse.builder()
                .id(section.getId())
                .courseId(section.getCourse().getId())
                .title(section.getTitle())
                .orderNumber(section.getOrderNumber())
                .lessons(lessons)
                .build();
    }
}
