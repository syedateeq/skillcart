package com.ateeq.skillcart.service;

import com.ateeq.skillcart.dto.request.LoginRequest;
import com.ateeq.skillcart.dto.request.RegisterRequest;
import com.ateeq.skillcart.dto.response.AuthResponse;
import com.ateeq.skillcart.enums.Role;
import com.ateeq.skillcart.exception.BadRequestException;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new BadRequestException("Email already registered");
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        User saved = userRepository.save(user);
        return authResponse(saved, "Registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) throw new BadRequestException("Invalid email or password");
        return authResponse(user, "Login successful");
    }

    public AuthResponse me(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return AuthResponse.builder()
                .message("Current user")
                .userId(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole().name())
                .build();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private AuthResponse authResponse(User user, String message) {
        return AuthResponse.builder()
                .message(message)
                .token(jwtService.generateToken(user))
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
