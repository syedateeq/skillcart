package com.ateeq.skillcart.config;

import com.ateeq.skillcart.enums.Role;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.name:Admin}") private String adminName;
    @Value("${admin.email:admin@skillcart.com}") private String adminEmail;
    @Value("${admin.password:admin123}") private String adminPassword;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Created default admin: " + adminEmail + " / " + adminPassword);
        } else {
            System.out.println("Admin user already exists: " + adminEmail);
        }
    }
}
