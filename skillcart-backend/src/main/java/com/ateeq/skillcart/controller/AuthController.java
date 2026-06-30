package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.request.LoginRequest;
import com.ateeq.skillcart.dto.request.RegisterRequest;
import com.ateeq.skillcart.dto.response.AuthResponse;
import com.ateeq.skillcart.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) { return authService.register(request); }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) { return authService.login(request); }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) { return authService.me(authentication.getName()); }
}
