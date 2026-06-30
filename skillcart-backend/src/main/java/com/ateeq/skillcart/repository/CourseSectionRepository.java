package com.ateeq.skillcart.repository;

import com.ateeq.skillcart.model.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
    List<CourseSection> findByCourseIdOrderByOrderNumberAsc(Long courseId);
}
