package com.ateeq.skillcart.service;

import com.ateeq.skillcart.dto.response.EnrollmentResponse;
import com.ateeq.skillcart.dto.response.LearningCourseResponse;
import com.ateeq.skillcart.dto.response.LessonResponse;
import com.ateeq.skillcart.dto.response.ProgressResponse;
import com.ateeq.skillcart.exception.BadRequestException;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.*;
import com.ateeq.skillcart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LearningService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CertificateRepository certificateRepository;

    public List<EnrollmentResponse> myCourses(String email) {
        return enrollmentRepository.findByUserEmailOrderByEnrolledAtDesc(email).stream()
                .map(e -> EnrollmentResponse.from(e, ""))
                .toList();
    }

    public LearningCourseResponse learningCourse(Long courseId, String email) {
        User user = user(email);
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() -> new BadRequestException("You are not enrolled in this course"));
        Course course = enrollment.getCourse();
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderNumberAsc(courseId);
        Set<Long> completedIds = lessonProgressRepository.findByUserIdAndCourseId(user.getId(), courseId).stream()
                .filter(lp -> Boolean.TRUE.equals(lp.getCompleted()))
                .map(lp -> lp.getLesson().getId())
                .collect(Collectors.toSet());
        return LearningCourseResponse.builder()
                .course(com.ateeq.skillcart.dto.response.CourseResponse.from(course))
                .lessons(lessons.stream().map(LessonResponse::from).toList())
                .completedLessonIds(completedIds)
                .progressPercentage(enrollment.getProgressPercentage())
                .completed(enrollment.getCompleted())
                .build();
    }

    public ProgressResponse markComplete(Long lessonId, String email) {
        User user = user(email);
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        Course course = lesson.getCourse();
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId())
                .orElseThrow(() -> new BadRequestException("You are not enrolled in this course"));

        LessonProgress progress = lessonProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElse(LessonProgress.builder().user(user).course(course).lesson(lesson).completed(true).build());
        progress.setCompleted(true);
        lessonProgressRepository.save(progress);

        long total = lessonRepository.countByCourseId(course.getId());
        long completed = lessonProgressRepository.countByUserIdAndCourseIdAndCompletedTrue(user.getId(), course.getId());
        double percentage = total == 0 ? 0.0 : Math.round((completed * 10000.0 / total)) / 100.0;
        enrollment.setProgressPercentage(percentage);
        enrollment.setCompleted(percentage >= 100.0);
        enrollmentRepository.save(enrollment);

        if (enrollment.getCompleted() && !certificateRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            Certificate cert = Certificate.builder()
                    .user(user).course(course)
                    .certificateHash(java.util.UUID.randomUUID().toString())
                    .build();
            certificateRepository.save(cert);
        }

        return ProgressResponse.builder()
                .courseId(course.getId()).lessonId(lessonId)
                .progressPercentage(percentage)
                .completed(enrollment.getCompleted())
                .message("Lesson marked completed")
                .build();
    }

    private User user(String email) { return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
}
