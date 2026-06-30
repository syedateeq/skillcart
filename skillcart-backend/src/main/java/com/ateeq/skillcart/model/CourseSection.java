package com.ateeq.skillcart.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseSection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    private Integer orderNumber;
}
