package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.CourseResponse;
import com.ateeq.skillcart.dto.response.MessageResponse;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.model.WishlistItem;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.WishlistItemRepository;
import com.ateeq.skillcart.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistItemRepository wishlistRepository;
    private final CourseRepository courseRepository;
    private final AuthService authService;

    @GetMapping
    @Transactional(readOnly = true)
    public List<CourseResponse> getWishlist() {
        User user = authService.getCurrentUser();
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(item -> CourseResponse.from(item.getCourse()))
                .toList();
    }

    @PostMapping("/{courseId}")
    @Transactional
    public MessageResponse addToWishlist(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        if (wishlistRepository.findByUserIdAndCourseId(user.getId(), courseId).isPresent()) {
            return new MessageResponse("Course already in wishlist");
        }
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setCourse(course);
        wishlistRepository.save(item);
        return new MessageResponse("Added to wishlist");
    }

    @DeleteMapping("/{courseId}")
    @Transactional
    public MessageResponse removeFromWishlist(@PathVariable Long courseId) {
        User user = authService.getCurrentUser();
        wishlistRepository.deleteByUserIdAndCourseId(user.getId(), courseId);
        return new MessageResponse("Removed from wishlist");
    }
}
