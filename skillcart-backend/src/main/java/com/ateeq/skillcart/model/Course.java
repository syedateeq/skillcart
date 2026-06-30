package com.ateeq.skillcart.model;

import com.ateeq.skillcart.enums.CourseLevel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(length = 5000)
    private String description;

    private String instructorName;
    private String category;

    @Enumerated(EnumType.STRING)
    private CourseLevel level;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String imageUrl;
    private Double rating;
    private Integer totalStudents;
    private Boolean published;
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        if (rating == null) rating = 4.6;
        if (totalStudents == null) totalStudents = 0;
        if (published == null) published = true;
    }
}
