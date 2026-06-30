package com.ateeq.skillcart.dto.response;

import com.ateeq.skillcart.model.Enrollment;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EnrollmentResponse {
    private Long enrollmentId;
    private Long courseId;
    private String courseTitle;
    private CourseResponse course;
    private Double progressPercentage;
    private Boolean completed;
    private String message;

    public static EnrollmentResponse from(Enrollment enrollment, String message) {
        return EnrollmentResponse.builder()
                .enrollmentId(enrollment.getId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .course(CourseResponse.from(enrollment.getCourse()))
                .progressPercentage(enrollment.getProgressPercentage())
                .completed(enrollment.getCompleted())
                .message(message)
                .build();
    }
}
