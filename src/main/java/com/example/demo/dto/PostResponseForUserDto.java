package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data

public class PostResponseForUserDto {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private int upVotes;
    private int downVotes;
    private Long authorId;
    private Long hubId;
    private List<Long> commentIds;

    private boolean likedByMe;
    private boolean dislikedByMe;
}
