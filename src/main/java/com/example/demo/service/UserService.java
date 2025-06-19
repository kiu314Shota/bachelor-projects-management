package com.example.demo.service;

import com.example.demo.domain.User;
import com.example.demo.domain.YearOfStudy;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public User save(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash())); // encrypt password
        return repository.save(user);
    }

    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(repository.findByEmail(email));
    }

    public Iterable<User> listActiveUsers() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(user -> !user.isDeleted())
                .collect(Collectors.toList());
    }


    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public Iterable<User> findAll() {
        return repository.findAll();
    }

    public Iterable<User> findAllById(Iterable<Long> longs) {
        return repository.findAllById(longs);
    }
    public Iterable<User> findAllByBirthDay(LocalDate date) {
        return repository.findAllByDateOfBirth(date);
    }
    public long count() {
        return repository.count();
    }

    @Transactional
    public void deleteById(Long id) {
        repository.softDeleteById(id);
    }
    @Transactional
    public void deleteByEmail(String email) {
        repository.softDeleteByEmail(email);
    }


    @Transactional
    public void updateYearOfStudy(Long userId, YearOfStudy newYear) {
        Optional<User> optionalUser = repository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setYearOfStudy(newYear);
            repository.save(user);
        }
    }

    @Transactional
    public void updatePasswordHash(Long userId, String newHash) {
        Optional<User> optionalUser = repository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPasswordHash(newHash);
            repository.save(user);
        }
    }

}
