package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HubJoinRequestDto {
    private Long requestId;
    private Long senderId;
    private String firstName;
    private String lastName;
    private String message;
    private LocalDateTime requestTime;
}
