package com.example.demo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50)
    private String lastName;


    @Past(message = "Date of birth must be in the past")
    private  LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Year of study is required")
    private YearOfStudy yearOfStudy;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password hash is required")
    private String passwordHash;

    private boolean isDeleted = false;

    private String profilePictureUrl;

    @ManyToMany
    @JoinTable(
            name = "hub_admins",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hub_id")
    )
    private List<Hub> adminHubs;

    @ManyToMany
    @JoinTable(
            name = "hub_members",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hub_id")
    )
    private List<Hub> memberHubs;


    @Enumerated(EnumType.STRING)
    private Role role;


}

//yearsofstudy ze
//pasword hash
