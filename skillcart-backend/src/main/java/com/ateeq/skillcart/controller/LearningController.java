package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.EnrollmentResponse;
import com.ateeq.skillcart.dto.response.LearningCourseResponse;
import com.ateeq.skillcart.dto.response.ProgressResponse;
import com.ateeq.skillcart.service.LearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {
    private final LearningService learningService;

    @GetMapping("/my-courses")
    public List<EnrollmentResponse> myCourses(Authentication auth) { return learningService.myCourses(auth.getName()); }

    @GetMapping("/course/{courseId}")
    public LearningCourseResponse course(@PathVariable Long courseId, Authentication auth) { return learningService.learningCourse(courseId, auth.getName()); }

    @PostMapping("/progress/{lessonId}")
    public ProgressResponse progress(@PathVariable Long lessonId, Authentication auth) { return learningService.markComplete(lessonId, auth.getName()); }
}
