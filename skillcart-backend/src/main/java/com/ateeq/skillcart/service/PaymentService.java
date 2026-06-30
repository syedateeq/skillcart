package com.ateeq.skillcart.service;

import com.ateeq.skillcart.dto.request.PaymentVerifyRequest;
import com.ateeq.skillcart.dto.response.EnrollmentResponse;
import com.ateeq.skillcart.dto.response.PaymentOrderResponse;
import com.ateeq.skillcart.enums.PaymentStatus;
import com.ateeq.skillcart.exception.BadRequestException;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.Course;
import com.ateeq.skillcart.model.Enrollment;
import com.ateeq.skillcart.model.Payment;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.CourseRepository;
import com.ateeq.skillcart.repository.EnrollmentRepository;
import com.ateeq.skillcart.repository.PaymentRepository;
import com.ateeq.skillcart.repository.UserRepository;
import com.ateeq.skillcart.util.PaymentSignatureUtil;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {
    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Value("${razorpay.key.id}") private String keyId;
    @Value("${razorpay.key.secret}") private String keySecret;

    public PaymentOrderResponse createOrder(Long courseId, String email) throws Exception {
        User user = getUser(email);
        Course course = getCourse(courseId);
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new BadRequestException("Already enrolled in this course");
        }
        if (keyId == null || keySecret == null || keyId.contains("REPLACE") || keySecret.contains("REPLACE")) {
            throw new BadRequestException("Razorpay test keys are not configured. Add rzp_test keys in application.properties or use mock payment.");
        }
        int amountPaise = course.getPrice().multiply(BigDecimal.valueOf(100)).intValue();
        JSONObject request = new JSONObject();
        request.put("amount", amountPaise);
        request.put("currency", "INR");
        request.put("receipt", "skillcart_" + courseId + "_" + user.getId());
        Order order = razorpayClient.orders.create(request);

        Payment payment = Payment.builder()
                .user(user).course(course).amount(course.getPrice())
                .status(PaymentStatus.CREATED)
                .razorpayOrderId(order.get("id"))
                .build();
        Payment saved = paymentRepository.save(payment);
        return PaymentOrderResponse.builder()
                .message("Razorpay order created")
                .paymentId(saved.getId())
                .courseId(courseId)
                .razorpayOrderId(order.get("id"))
                .razorpayKeyId(keyId)
                .amount(amountPaise)
                .currency("INR")
                .build();
    }

    public EnrollmentResponse verify(PaymentVerifyRequest req, String email) {
        User user = getUser(email);
        Payment payment = paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment order not found"));
        if (!payment.getUser().getId().equals(user.getId())) throw new BadRequestException("Payment does not belong to current user");

        boolean valid = PaymentSignatureUtil.verify(req.getRazorpayOrderId(), req.getRazorpayPaymentId(), req.getRazorpaySignature(), keySecret);
        if (!valid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Invalid payment signature");
        }
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
        payment.setRazorpaySignature(req.getRazorpaySignature());
        paymentRepository.save(payment);
        return createEnrollment(user, payment.getCourse(), payment, "Payment verified and enrollment created");
    }

    public EnrollmentResponse mockBuy(Long courseId, String email) {
        User user = getUser(email);
        Course course = getCourse(courseId);
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            Enrollment existing = enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId).orElseThrow();
            return EnrollmentResponse.from(existing, "Already enrolled");
        }
        Payment payment = Payment.builder()
                .user(user).course(course).amount(course.getPrice())
                .status(PaymentStatus.SUCCESS)
                .paymentReference("MOCK-" + UUID.randomUUID())
                .build();
        paymentRepository.save(payment);
        return createEnrollment(user, course, payment, "Mock payment successful and enrollment created");
    }

    private EnrollmentResponse createEnrollment(User user, Course course, Payment payment, String message) {
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            Enrollment existing = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId()).orElseThrow();
            return EnrollmentResponse.from(existing, "Already enrolled");
        }
        Enrollment enrollment = Enrollment.builder()
                .user(user).course(course).payment(payment)
                .progressPercentage(0.0).completed(false)
                .build();
        course.setTotalStudents((course.getTotalStudents() == null ? 0 : course.getTotalStudents()) + 1);
        courseRepository.save(course);
        return EnrollmentResponse.from(enrollmentRepository.save(enrollment), message);
    }

    private User getUser(String email) { return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
    private Course getCourse(Long id) { return courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found")); }
}
