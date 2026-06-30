package com.ateeq.skillcart.service;

import com.ateeq.skillcart.dto.response.CourseDetailResponse;
import com.ateeq.skillcart.dto.response.CourseResponse;
import com.ateeq.skillcart.dto.response.LessonResponse;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.Lesson;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.CourseSectionRepository;
import com.ateeq.skillcart.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;

    public List<CourseResponse> getPublishedCourses(String search, String category, String level, BigDecimal priceMax) {
        String q = search == null ? "" : search.toLowerCase(Locale.ROOT).trim();
        String cat = category == null ? "" : category.toLowerCase(Locale.ROOT).trim();
        String lvl = level == null ? "" : level.toUpperCase(Locale.ROOT).trim();
        return courseRepository.findByPublishedTrueOrderByCreatedAtDesc().stream()
                .filter(c -> q.isBlank() || contains(c.getTitle(), q) || contains(c.getSubtitle(), q) || contains(c.getInstructorName(), q) || contains(c.getCategory(), q))
                .filter(c -> cat.isBlank() || contains(c.getCategory(), cat))
                .filter(c -> lvl.isBlank() || lvl.equals("ALL") || (c.getLevel() != null && c.getLevel().name().equals(lvl)))
                .filter(c -> priceMax == null || c.getPrice().compareTo(priceMax) <= 0)
                .map(CourseResponse::from)
                .toList();
    }

    public CourseDetailResponse getCourseDetail(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return CourseDetailResponse.builder()
                .course(CourseResponse.from(course))
                .lessons(getLessons(id))
                .build();
    }

    public List<LessonResponse> getLessons(Long id) {
        if (!courseRepository.existsById(id)) throw new ResourceNotFoundException("Course not found");
        return lessonRepository.findByCourseIdOrderByOrderNumberAsc(id).stream().map(LessonResponse::from).toList();
    }

    public List<com.ateeq.skillcart.dto.response.CourseSectionResponse> getCurriculum(Long courseId) {
        if (!courseRepository.existsById(courseId)) throw new ResourceNotFoundException("Course not found");
        List<com.ateeq.skillcart.model.CourseSection> sections = sectionRepository.findByCourseIdOrderByOrderNumberAsc(courseId);
        List<Lesson> allLessons = lessonRepository.findByCourseIdOrderByOrderNumberAsc(courseId);
        
        return sections.stream().map(sec -> {
            List<LessonResponse> lessons = allLessons.stream()
                .filter(l -> l.getSection() != null && l.getSection().getId().equals(sec.getId()))
                .map(LessonResponse::from)
                .toList();
            return com.ateeq.skillcart.dto.response.CourseSectionResponse.from(sec, lessons);
        }).toList();
    }

    private boolean contains(String value, String q) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(q);
    }
}
