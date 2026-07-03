package com.ateeq.skillcart.repository;

import com.ateeq.skillcart.model.Certificate;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByUserAndCourse(User user, Course course);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Certificate> findByCertificateCode(String code);
    List<Certificate> findByUser(User user);
}
