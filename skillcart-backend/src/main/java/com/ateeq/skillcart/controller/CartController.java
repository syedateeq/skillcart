package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.CourseResponse;
import com.ateeq.skillcart.dto.response.MessageResponse;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.CartItem;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.CartItemRepository;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.EnrollmentRepository;
import com.ateeq.skillcart.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartItemRepository cartItemRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AuthService authService;

    @GetMapping
    @Transactional(readOnly = true)
    public List<CourseResponse> getCart() {
        User user = authService.getCurrentUser();
        return cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(item -> CourseResponse.from(item.getCourse()))
                .toList();
    }

    @PostMapping("/{courseId}")
    @Transactional
    public MessageResponse addToCart(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new IllegalArgumentException("Already enrolled in this course");
        }
        if (cartItemRepository.findByUserIdAndCourseId(user.getId(), courseId).isPresent()) {
            throw new IllegalArgumentException("Course already in cart");
        }
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        CartItem item = new CartItem();
        item.setUser(user);
        item.setCourse(course);
        cartItemRepository.save(item);
        return new MessageResponse("Added to cart");
    }

    @DeleteMapping("/{courseId}")
    @Transactional
    public MessageResponse removeFromCart(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        cartItemRepository.deleteByUserIdAndCourseId(user.getId(), courseId);
        return new MessageResponse("Removed from cart");
    }

    @DeleteMapping("/clear")
    @Transactional
    public MessageResponse clearCart() {
        User user = authService.getCurrentUser();
        cartItemRepository.deleteByUserId(user.getId());
        return new MessageResponse("Cart cleared");
    }
}
