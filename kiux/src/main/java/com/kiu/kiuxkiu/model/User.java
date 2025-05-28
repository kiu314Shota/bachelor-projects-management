package com.example.project.model;
import jakarta.persistence.*;
import java.util.*;
@Entity
public class User {
    @Id @GeneratedValue private UUID id;
    private String username;
    private String email;
    private String passwordHash;
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();
}