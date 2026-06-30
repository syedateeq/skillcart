package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.CertificateResponse;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {
    private final CertificateRepository certificateRepository;

    @GetMapping("/{hash}")
    public CertificateResponse getCertificate(@PathVariable String hash) {
        return certificateRepository.findByCertificateHash(hash)
                .map(CertificateResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @GetMapping("/course/{courseId}")
    public CertificateResponse getMyCertificate(@PathVariable Long courseId, org.springframework.security.core.Authentication auth) {
        if (auth == null || auth.getName() == null) throw new ResourceNotFoundException("Not authenticated");
        // For simplicity, we just find by email directly from auth since user relation exists
        return certificateRepository.findAll().stream()
                .filter(c -> c.getCourse().getId().equals(courseId) && c.getUser().getEmail().equals(auth.getName()))
                .findFirst()
                .map(CertificateResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not generated yet"));
    }
}
