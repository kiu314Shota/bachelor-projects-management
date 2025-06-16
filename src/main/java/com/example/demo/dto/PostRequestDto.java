package com.example.demo.dto;

import lombok.Data;

@Data
public class PostRequestDto {
    private String text;
    private Long authorId;
    private Long hubId;
}
