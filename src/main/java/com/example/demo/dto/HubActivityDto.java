package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HubActivityDto {

    private long hubId;
    private String hubName;
    private long NumberOfPosts;
}
