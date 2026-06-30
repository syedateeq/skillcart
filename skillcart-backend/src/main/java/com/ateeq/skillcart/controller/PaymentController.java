package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.request.PaymentVerifyRequest;
import com.ateeq.skillcart.dto.response.EnrollmentResponse;
import com.ateeq.skillcart.dto.response.PaymentOrderResponse;
import com.ateeq.skillcart.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order/{courseId}")
    public PaymentOrderResponse createOrder(@PathVariable Long courseId, Authentication auth) throws Exception {
        return paymentService.createOrder(courseId, auth.getName());
    }

    @PostMapping("/verify")
    public EnrollmentResponse verify(@Valid @RequestBody PaymentVerifyRequest request, Authentication auth) {
        return paymentService.verify(request, auth.getName());
    }

    @PostMapping("/mock-buy/{courseId}")
    public EnrollmentResponse mockBuy(@PathVariable Long courseId, Authentication auth) {
        return paymentService.mockBuy(courseId, auth.getName());
    }
}
