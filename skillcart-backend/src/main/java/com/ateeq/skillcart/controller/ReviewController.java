package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.request.ReviewRequest;
import com.ateeq.skillcart.dto.response.ReviewResponse;
import com.ateeq.skillcart.exception.BadRequestException;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.Review;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.EnrollmentRepository;
import com.ateeq.skillcart.repository.ReviewRepository;
import com.ateeq.skillcart.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AuthService authService;

    @GetMapping
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(@PathVariable Long courseId) {
        return reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream().map(ReviewResponse::from).toList();
    }

    @PostMapping
    @Transactional
    public ReviewResponse addReview(@PathVariable Long courseId, @Valid @RequestBody ReviewRequest request) {
        User user = authService.getCurrentUser();
        if (!enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new BadRequestException("Only enrolled users can review this course");
        }
        if (reviewRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new BadRequestException("You have already reviewed this course");
        }
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Review review = new Review();
        review.setUser(user);
        review.setCourse(course);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review = reviewRepository.save(review);
        
        // Update course average rating
        List<Review> allReviews = reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        course.setRating(Math.round(avg * 10.0) / 10.0);
        courseRepository.save(course);
        
        return ReviewResponse.from(review);
    }
}
