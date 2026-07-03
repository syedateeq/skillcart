package com.ateeq.skillcart.controller;

import com.ateeq.skillcart.dto.response.CertificateResponse;
import com.ateeq.skillcart.exception.ResourceNotFoundException;
import com.ateeq.skillcart.model.User;
import com.ateeq.skillcart.repository.CertificateRepository;
import com.ateeq.skillcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<CertificateResponse> getMyCertificates(org.springframework.security.core.Authentication auth) {
        if (auth == null || auth.getName() == null) throw new ResourceNotFoundException("Not authenticated");
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return certificateRepository.findByUser(user).stream()
                .map(CertificateResponse::from)
                .toList();
    }

    @GetMapping("/{certificateCode}")
    public CertificateResponse getCertificate(@PathVariable String certificateCode) {
        return certificateRepository.findByCertificateCode(certificateCode)
                .map(CertificateResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @GetMapping("/download/{certificateCode}")
    public CertificateResponse downloadCertificate(@PathVariable String certificateCode) {
        return certificateRepository.findByCertificateCode(certificateCode)
                .map(CertificateResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @GetMapping("/course/{courseId}")
    public CertificateResponse getMyCertificateByCourse(@PathVariable Long courseId, org.springframework.security.core.Authentication auth) {
        if (auth == null || auth.getName() == null) throw new ResourceNotFoundException("Not authenticated");
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return certificateRepository.findByUser(user).stream()
                .filter(c -> c.getCourse().getId().equals(courseId))
                .findFirst()
                .map(CertificateResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not generated yet"));
    }
}
