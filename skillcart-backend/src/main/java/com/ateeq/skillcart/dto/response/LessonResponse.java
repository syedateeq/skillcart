package com.ateeq.skillcart.dto.response;

import com.ateeq.skillcart.model.Lesson;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LessonResponse {
    private Long id;
    private Long courseId;
    private String title;
    private String content;
    private String resourceUrl;
    private String durationText;
    private Integer orderNumber;
    private Long sectionId;

    public static LessonResponse from(Lesson l) {
        return LessonResponse.builder()
                .id(l.getId())
                .courseId(l.getCourse().getId())
                .title(l.getTitle())
                .content(l.getContent())
                .resourceUrl(l.getResourceUrl())
                .durationText(l.getDurationText())
                .orderNumber(l.getOrderNumber())
                .sectionId(l.getSection() != null ? l.getSection().getId() : null)
                .build();
    }
}
