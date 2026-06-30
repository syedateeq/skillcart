package com.ateeq.skillcart.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentOrderResponse {
    private String message;
    private Long paymentId;
    private Long courseId;
    private String razorpayOrderId;
    private String razorpayKeyId;
    private Integer amount;
    private String currency;
}
