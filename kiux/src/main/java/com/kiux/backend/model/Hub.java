package com.kiux.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
public class Hub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToMany
    @JoinTable(
            name = "hub_members",
            joinColumns = @JoinColumn(name = "hub_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

    // Default constructor
    public Hub() {}

    // Private constructor for the builder
    private Hub(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.creator = builder.creator;
        this.members = builder.members;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public User getCreator() {
        return creator;
    }

    public List<User> getMembers() {
        return members;
    }

    // Static inner Builder class
    public static class Builder {
        private Long id;
        private String name;
        private User creator;
        private List<User> members = new ArrayList<>();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder creator(User creator) {
            this.creator = creator;
            return this;
        }

        public Builder members(List<User> members) {
            this.members = members;
            return this;
        }

        public Hub build() {
            return new Hub(this);
        }
    }
}
