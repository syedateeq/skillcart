package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.request.CourseRequest;
import com.ateeq.skillcart.dto.request.CourseSectionRequest;
import com.ateeq.skillcart.dto.request.LessonRequest;
import com.ateeq.skillcart.dto.response.*;
import com.ateeq.skillcart.service.AdminCourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCourseController {
    private final AdminCourseService service;

    @GetMapping("/courses")
    public List<CourseResponse> all() { return service.allCourses(); }

    @GetMapping("/courses/{id}")
    public CourseDetailResponse detail(@PathVariable Long id) { return service.detail(id); }

    @PostMapping("/courses")
    public CourseResponse create(@Valid @RequestBody CourseRequest request) { return service.create(request); }

    @PutMapping("/courses/{id}")
    public CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) { return service.update(id, request); }

    @DeleteMapping("/courses/{id}")
    public MessageResponse delete(@PathVariable Long id) { service.delete(id); return new MessageResponse("Course deleted"); }

    @PostMapping("/courses/{courseId}/lessons")
    public LessonResponse addLesson(@PathVariable Long courseId, @Valid @RequestBody LessonRequest request) { return service.addLesson(courseId, request); }

    @PostMapping("/sections/{sectionId}/lessons")
    public LessonResponse addLessonToSection(@PathVariable Long sectionId, @Valid @RequestBody LessonRequest request) { return service.addLessonToSection(sectionId, request); }

    @PutMapping("/lessons/{lessonId}")
    public LessonResponse updateLesson(@PathVariable Long lessonId, @Valid @RequestBody LessonRequest request) { return service.updateLesson(lessonId, request); }

    @DeleteMapping("/lessons/{lessonId}")
    public MessageResponse deleteLesson(@PathVariable Long lessonId) { service.deleteLesson(lessonId); return new MessageResponse("Lesson deleted"); }

    @PostMapping("/courses/{courseId}/sections")
    public CourseSectionResponse addSection(@PathVariable Long courseId, @Valid @RequestBody CourseSectionRequest request) { return service.addSection(courseId, request); }

    @PutMapping("/sections/{sectionId}")
    public CourseSectionResponse updateSection(@PathVariable Long sectionId, @Valid @RequestBody CourseSectionRequest request) { return service.updateSection(sectionId, request); }

    @DeleteMapping("/sections/{sectionId}")
    public MessageResponse deleteSection(@PathVariable Long sectionId) { service.deleteSection(sectionId); return new MessageResponse("Section deleted"); }
}
