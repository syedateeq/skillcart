package com.ateeq.skillcart.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, unique = true)
    private String certificateCode;

    private String instructorName;

    private LocalDateTime issueDate;
    
    private LocalDateTime completionDate;

    @PrePersist
    void onCreate() {
        if (issueDate == null) issueDate = LocalDateTime.now();
        if (completionDate == null) completionDate = LocalDateTime.now();
    }
}
