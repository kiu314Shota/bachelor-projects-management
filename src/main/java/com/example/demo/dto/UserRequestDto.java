package com.example.demo.dto;

import com.example.demo.domain.YearOfStudy;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequestDto {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private YearOfStudy yearOfStudy;
    private String email;
    private String passwordHash;
    private String profilePictureUrl;


}

