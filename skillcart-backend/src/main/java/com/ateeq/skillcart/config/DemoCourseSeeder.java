package com.ateeq.skillcart.config;

import com.ateeq.skillcart.enums.CourseLevel;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.Lesson;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoCourseSeeder implements CommandLineRunner {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Value("${app.seed.demo-courses:true}")
    private boolean seedDemoCourses;

    @Override
    public void run(String... args) {
        if (!seedDemoCourses) return;
        if (courseRepository.count() > 0) {
            System.out.println("Courses already exist, skipping seed.");
            return;
        }
        List<Course> courses = List.of(
                course("Java Spring Boot Masterclass", "Build production-ready REST APIs with Spring Boot and MySQL.", "Ateeq Academy", "Backend Development", CourseLevel.INTERMEDIATE, "499", 4.8, 1200),
                course("Full Stack Web Development Bootcamp", "Learn frontend, backend, database, and deployment.", "SkillCart Team", "Web Development", CourseLevel.BEGINNER, "799", 4.7, 2100),
                course("React Complete Guide", "Master React, hooks, routing, and API integration.", "Code Mentor", "Frontend Development", CourseLevel.BEGINNER, "399", 4.6, 980),
                course("DSA with Java", "Prepare for coding interviews with Java DSA.", "Algo Guru", "Programming", CourseLevel.INTERMEDIATE, "599", 4.9, 2400),
                course("Python for Beginners", "Learn Python from zero with practical examples.", "Python Lab", "Programming", CourseLevel.BEGINNER, "299", 4.5, 870),
                course("AI Tools for Developers", "Use AI tools for coding, debugging, and productivity.", "AI Mentor", "Artificial Intelligence", CourseLevel.BEGINNER, "349", 4.4, 760),
                course("MySQL Database Design", "Learn schema design, queries, joins, and indexing basics.", "DB Expert", "Database", CourseLevel.BEGINNER, "249", 4.6, 650),
                course("Docker for Backend Developers", "Containerize and deploy backend applications.", "DevOps Coach", "DevOps", CourseLevel.INTERMEDIATE, "449", 4.7, 930)
        );
        courseRepository.saveAll(courses).forEach(this::seedLessons);
        System.out.println("Seeded demo courses and text lessons.");
    }

    private Course course(String title, String subtitle, String instructor, String category, CourseLevel level, String price, double rating, int students) {
        return Course.builder()
                .title(title)
                .subtitle(subtitle)
                .description(subtitle + " This course focuses on practical, text-based lessons with clear explanations and hands-on tasks.")
                .instructorName(instructor)
                .category(category)
                .level(level)
                .price(new BigDecimal(price))
                .rating(rating)
                .totalStudents(students)
                .published(true)
                .build();
    }

    private void seedLessons(Course course) {
        lessonRepository.saveAll(List.of(
                lesson(course, "Introduction", "Welcome to " + course.getTitle() + ". In this lesson, you will understand what this course covers, how to study it, and what practical skills you will build.", 1),
                lesson(course, "Core Concepts", "This lesson explains the most important concepts in " + course.getCategory() + " with simple examples, real-world use cases, and interview-ready notes.", 2),
                lesson(course, "Hands-on Practice", "Now apply what you learned. Build a small practical task, review the expected output, and revise the key mistakes beginners commonly make.", 3)
        ));
    }

    private Lesson lesson(Course course, String title, String content, int order) {
        return Lesson.builder()
                .course(course)
                .title(title)
                .content(content)
                .durationText(order == 1 ? "10 min read" : order == 2 ? "20 min read" : "30 min practice")
                .orderNumber(order)
                .build();
    }
}
