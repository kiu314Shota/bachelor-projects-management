package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class CommentRequestDto {
    private String content;
    private Long postId;
    private Long authorId;
    private Long HubId;
}
