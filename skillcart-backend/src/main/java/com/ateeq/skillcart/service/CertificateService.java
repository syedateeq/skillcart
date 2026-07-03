package com.ateeq.skillcart.service;

import com.ateeq.skillcart.model.Certificate;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;

    @Transactional
    public Certificate generateCertificate(User user, Course course) {
        if (certificateRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            return certificateRepository.findByUserAndCourse(user, course).orElseThrow();
        }

        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String certificateCode = String.format("SKC-2026-%d-%d-%s", user.getId(), course.getId(), uniqueSuffix);

        Certificate certificate = Certificate.builder()
                .user(user)
                .course(course)
                .certificateCode(certificateCode)
                .instructorName(course.getInstructorName())
                .issueDate(LocalDateTime.now())
                .completionDate(LocalDateTime.now())
                .build();

        return certificateRepository.save(certificate);
    }
}
