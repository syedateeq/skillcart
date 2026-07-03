package com.ateeq.skillcart.dto.response;

import com.ateeq.skillcart.model.Certificate;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CertificateResponse {
    private String certificateCode;
    private String studentName;
    private String courseName;
    private String instructorName;
    private LocalDateTime issueDate;
    private LocalDateTime completionDate;

    public static CertificateResponse from(Certificate c) {
        return CertificateResponse.builder()
                .certificateCode(c.getCertificateCode())
                .studentName(c.getUser().getName())
                .courseName(c.getCourse().getTitle())
                .instructorName(c.getInstructorName())
                .issueDate(c.getIssueDate())
                .completionDate(c.getCompletionDate())
                .build();
    }
}
