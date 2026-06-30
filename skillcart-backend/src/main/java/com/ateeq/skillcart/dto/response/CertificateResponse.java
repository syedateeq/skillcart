package com.ateeq.skillcart.dto.response;

import com.ateeq.skillcart.model.Certificate;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CertificateResponse {
    private String id;
    private String studentName;
    private String courseName;
    private String instructorName;
    private LocalDateTime issueDate;

    public static CertificateResponse from(Certificate c) {
        return CertificateResponse.builder()
                .id(c.getCertificateHash())
                .studentName(c.getUser().getName())
                .courseName(c.getCourse().getTitle())
                .instructorName(c.getCourse().getInstructorName())
                .issueDate(c.getIssueDate())
                .build();
    }
}
