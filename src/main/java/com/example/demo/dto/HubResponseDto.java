package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class HubResponseDto {
    private Long id;
    private String name;
    private String description;
    private boolean isPublic;
    private boolean isDeleted;

    private List<Long> postIds;
    private List<Long> adminIds;
    private List<Long> memberIds;
}
