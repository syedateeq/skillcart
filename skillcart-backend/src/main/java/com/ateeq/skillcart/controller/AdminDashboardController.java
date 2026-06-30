package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.AdminDashboardDTO;
import com.ateeq.skillcart.dto.response.CourseResponse;
import com.ateeq.skillcart.enums.PaymentStatus;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.Payment;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.EnrollmentRepository;
import com.ateeq.skillcart.repository.PaymentRepository;
import com.ateeq.skillcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public AdminDashboardDTO getDashboard() {
        long totalCourses = courseRepository.count();
        long totalUsers = userRepository.count();
        long totalEnrollments = enrollmentRepository.count();

        List<Payment> successfulPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .toList();

        BigDecimal totalRevenue = successfulPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CourseResponse> topCourses = courseRepository.findAll().stream()
                .sorted((c1, c2) -> Integer.compare(c2.getTotalStudents() != null ? c2.getTotalStudents() : 0, c1.getTotalStudents() != null ? c1.getTotalStudents() : 0))
                .limit(5)
                .map(CourseResponse::from)
                .toList();

        List<AdminDashboardDTO.PaymentLog> recentPayments = successfulPayments.stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(10)
                .map(p -> AdminDashboardDTO.PaymentLog.builder()
                        .id(p.getId())
                        .userName(p.getUser() != null ? p.getUser().getName() : "Unknown User")
                        .amount(p.getAmount())
                        .status(p.getStatus().name())
                        .createdAt(p.getCreatedAt().toString())
                        .build())
                .toList();

        return AdminDashboardDTO.builder()
                .totalCourses(totalCourses)
                .totalUsers(totalUsers)
                .totalEnrollments(totalEnrollments)
                .totalRevenue(totalRevenue)
                .topSellingCourses(topCourses)
                .recentPayments(recentPayments)
                .build();
    }
}
