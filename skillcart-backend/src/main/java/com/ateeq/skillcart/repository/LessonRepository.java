package com.ateeq.skillcart.repository;

import com.ateeq.skillcart.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByOrderNumberAsc(Long courseId);
    long countByCourseId(Long courseId);
    long deleteByCourseId(Long courseId);
}
