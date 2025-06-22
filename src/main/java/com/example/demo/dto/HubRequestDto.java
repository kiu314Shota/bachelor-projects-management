package com.example.demo.dto;

import lombok.Data;

import java.util.List;
@Data
public class HubRequestDto {
    private String name;
    private String description;
    private boolean isPublic;
    private String photoUrl;

   }
