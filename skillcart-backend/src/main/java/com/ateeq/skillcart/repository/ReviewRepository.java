package com.ateeq.skillcart.repository;

import com.ateeq.skillcart.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}
