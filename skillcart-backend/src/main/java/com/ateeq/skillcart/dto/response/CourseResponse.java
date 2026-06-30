package com.ateeq.skillcart.dto.response;

import com.ateeq.skillcart.model.Course;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseResponse {
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private String instructorName;
    private String category;
    private String level;
    private BigDecimal price;
    private String imageUrl;
    private Double rating;
    private Integer totalStudents;
    private Boolean published;
    private LocalDateTime createdAt;

    public static CourseResponse from(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .subtitle(course.getSubtitle())
                .description(course.getDescription())
                .instructorName(course.getInstructorName())
                .category(course.getCategory())
                .level(course.getLevel() == null ? null : course.getLevel().name())
                .price(course.getPrice())
                .imageUrl(course.getImageUrl())
                .rating(course.getRating())
                .totalStudents(course.getTotalStudents())
                .published(course.getPublished())
                .createdAt(course.getCreatedAt())
                .build();
    }
}
