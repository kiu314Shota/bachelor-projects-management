package com.example.demo.dto;


import com.example.demo.domain.YearOfStudy;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UserResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private YearOfStudy yearOfStudy;
    private String email;
    private List<Long> adminHubIds;
    private List<Long> memberHubIds;
    private String profilePictureUrl;

}
