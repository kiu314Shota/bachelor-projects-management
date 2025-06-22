package com.example.demo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.*;

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
    private LocalDate profilePictureLastUpdated;

    @ManyToMany
    @JoinTable(
            name = "hub_admins",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hub_id")
    )
    private List<Hub> adminHubs = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "hub_members",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hub_id")
    )
    private List<Hub> memberHubs=new ArrayList<>();


    @Enumerated(EnumType.STRING)
    private Role role;


    @ManyToMany(mappedBy = "upVotedUsers")
    private Set<Post> likedPosts = new HashSet<>();

    @ManyToMany(mappedBy = "downVotedUsers")
    private Set<Post> dislikedPosts = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }


    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}


