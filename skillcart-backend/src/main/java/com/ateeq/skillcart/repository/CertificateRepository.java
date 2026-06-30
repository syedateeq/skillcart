package com.ateeq.skillcart.repository;

import com.ateeq.skillcart.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Certificate> findByCertificateHash(String hash);
}
