package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@NoArgsConstructor
@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "post_seq_gen", sequenceName = "post_seq", allocationSize = 1)
    private Long id;

    private String text;
    private LocalDateTime createdAt;
    private int upVotes;
    private int downVotes;

    @ManyToOne
    @JoinColumn(name = "author_id") // ბაზაში იქნება author_id foreign key
    private User author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @ManyToOne
    @JoinColumn(name = "hub_id")
    private Hub hub;

    @ManyToMany
    @JoinTable(
            name = "post_up_voted_users",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> upVotedUsers = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "post_down_voted_users",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> downVotedUsers = new HashSet<>();



}
