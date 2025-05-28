package com.example.project.service;
import com.example.project.model.User;
import com.example.project.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}