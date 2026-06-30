package com.ateeq.skillcart.repository;

import com.ateeq.skillcart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CartItem> findByUserIdAndCourseId(Long userId, Long courseId);
    void deleteByUserIdAndCourseId(Long userId, Long courseId);
    void deleteByUserId(Long userId);
}
