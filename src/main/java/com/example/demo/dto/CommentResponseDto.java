package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class CommentResponseDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private int upVotes;
    private int downVotes;
    private Long postId;
    private Long authorId;
}
