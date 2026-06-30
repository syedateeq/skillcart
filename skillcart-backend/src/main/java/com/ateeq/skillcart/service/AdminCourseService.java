package com.ateeq.skillcart.service;

import com.ateeq.skillcart.dto.request.CourseRequest;
import com.ateeq.skillcart.dto.request.LessonRequest;
import com.ateeq.skillcart.dto.response.CourseDetailResponse;
import com.ateeq.skillcart.dto.response.CourseResponse;
import com.ateeq.skillcart.dto.response.LessonResponse;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.CourseSection;
import com.ateeq.skillcart.model.Lesson;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.CourseSectionRepository;
import com.ateeq.skillcart.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCourseService {
    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;

    public List<CourseResponse> allCourses() {
        return courseRepository.findAll().stream().map(CourseResponse::from).toList();
    }

    public CourseDetailResponse detail(Long id) {
        Course c = getCourse(id);
        return CourseDetailResponse.builder()
                .course(CourseResponse.from(c))
                .lessons(lessonRepository.findByCourseIdOrderByOrderNumberAsc(id).stream().map(LessonResponse::from).toList())
                .build();
    }

    public CourseResponse create(CourseRequest req) {
        Course c = new Course();
        apply(c, req);
        return CourseResponse.from(courseRepository.save(c));
    }

    public CourseResponse update(Long id, CourseRequest req) {
        Course c = getCourse(id);
        apply(c, req);
        return CourseResponse.from(courseRepository.save(c));
    }

    public void delete(Long id) {
        Course c = getCourse(id);
        lessonRepository.deleteByCourseId(id);
        courseRepository.delete(c);
    }

    public LessonResponse addLesson(Long courseId, LessonRequest req) {
        Course course = getCourse(courseId);
        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        if (req.getSectionId() != null) {
            lesson.setSection(sectionRepository.findById(req.getSectionId()).orElse(null));
        }
        apply(lesson, req);
        return LessonResponse.from(lessonRepository.save(lesson));
    }

    public LessonResponse addLessonToSection(Long sectionId, LessonRequest req) {
        CourseSection section = sectionRepository.findById(sectionId).orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        Lesson lesson = new Lesson();
        lesson.setCourse(section.getCourse());
        lesson.setSection(section);
        apply(lesson, req);
        return LessonResponse.from(lessonRepository.save(lesson));
    }

    public LessonResponse updateLesson(Long lessonId, LessonRequest req) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        apply(lesson, req);
        return LessonResponse.from(lessonRepository.save(lesson));
    }

    public void deleteLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) throw new ResourceNotFoundException("Lesson not found");
        lessonRepository.deleteById(lessonId);
    }

    private Course getCourse(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    public com.ateeq.skillcart.dto.response.CourseSectionResponse addSection(Long courseId, com.ateeq.skillcart.dto.request.CourseSectionRequest req) {
        Course course = getCourse(courseId);
        CourseSection section = new CourseSection();
        section.setCourse(course);
        section.setTitle(req.getTitle());
        section.setOrderNumber(req.getOrderNumber() == null ? 1 : req.getOrderNumber());
        return com.ateeq.skillcart.dto.response.CourseSectionResponse.from(sectionRepository.save(section), List.of());
    }

    public com.ateeq.skillcart.dto.response.CourseSectionResponse updateSection(Long sectionId, com.ateeq.skillcart.dto.request.CourseSectionRequest req) {
        CourseSection section = sectionRepository.findById(sectionId).orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        section.setTitle(req.getTitle());
        if (req.getOrderNumber() != null) section.setOrderNumber(req.getOrderNumber());
        return com.ateeq.skillcart.dto.response.CourseSectionResponse.from(sectionRepository.save(section), List.of());
    }

    public void deleteSection(Long sectionId) {
        CourseSection section = sectionRepository.findById(sectionId).orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        lessonRepository.findByCourseIdOrderByOrderNumberAsc(section.getCourse().getId()).stream()
            .filter(l -> l.getSection() != null && l.getSection().getId().equals(sectionId))
            .forEach(lessonRepository::delete);
        sectionRepository.delete(section);
    }

    private void apply(Course c, CourseRequest req) {
        c.setTitle(req.getTitle());
        c.setSubtitle(req.getSubtitle());
        c.setDescription(req.getDescription());
        c.setInstructorName(req.getInstructorName());
        c.setCategory(req.getCategory());
        c.setLevel(req.getLevel());
        c.setPrice(req.getPrice());
        c.setImageUrl(req.getImageUrl());
        c.setPublished(req.getPublished() == null ? true : req.getPublished());
    }

    private void apply(Lesson l, LessonRequest req) {
        l.setTitle(req.getTitle());
        l.setContent(req.getContent());
        l.setResourceUrl(req.getResourceUrl());
        l.setDurationText(req.getDurationText());
        l.setOrderNumber(req.getOrderNumber() == null ? 1 : req.getOrderNumber());
    }
}
