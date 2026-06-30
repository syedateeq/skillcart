package com.ateeq.skillcart.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardDTO {
    private long totalCourses;
    private long totalUsers;
    private long totalEnrollments;
    private BigDecimal totalRevenue;
    private List<CourseResponse> topSellingCourses;
    private List<PaymentLog> recentPayments;

    @Data
    @Builder
    public static class PaymentLog {
        private Long id;
        private String userName;
        private BigDecimal amount;
        private String status;
        private String createdAt;
    }
}
