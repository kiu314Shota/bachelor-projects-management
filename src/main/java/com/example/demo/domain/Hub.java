package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor
@Entity
@Data
public class Hub {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hub_seq")
    @SequenceGenerator(name = "hub_seq", sequenceName = "hub_id_seq", allocationSize = 1)    private Long id;

    private String name;
    private String description;
    private boolean isPublic;
    @Column(nullable = false)
    private boolean isDeleted = false;

    @OneToMany(mappedBy = "hub", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    @ManyToMany(mappedBy = "adminHubs")
    private List<User> admins;

    @ManyToMany(mappedBy = "memberHubs")
    private List<User> members;


}
