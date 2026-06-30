package com.ateeq.skillcart.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String message;
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
}
