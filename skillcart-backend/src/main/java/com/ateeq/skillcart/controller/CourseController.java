package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.CourseDetailResponse;
import com.ateeq.skillcart.dto.response.CourseResponse;
import com.ateeq.skillcart.dto.response.LessonResponse;
import com.ateeq.skillcart.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public List<CourseResponse> courses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) BigDecimal priceMax) {
        return courseService.getPublishedCourses(search, category, level, priceMax);
    }

    @GetMapping("/{id}")
    public CourseDetailResponse detail(@PathVariable Long id) { return courseService.getCourseDetail(id); }

    @GetMapping("/{id}/lessons")
    public List<LessonResponse> lessons(@PathVariable Long id) { return courseService.getLessons(id); }

    @GetMapping("/{id}/curriculum")
    public List<com.ateeq.skillcart.dto.response.CourseSectionResponse> curriculum(@PathVariable Long id) { return courseService.getCurriculum(id); }
}
