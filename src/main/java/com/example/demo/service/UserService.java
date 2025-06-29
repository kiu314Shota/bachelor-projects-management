package com.example.demo.service;

import com.example.demo.domain.Hub;
import com.example.demo.domain.User;
import com.example.demo.domain.YearOfStudy;
import com.example.demo.repository.HubRepository;
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
    private final HubService hubService;

    public User save(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        if(user.getProfilePictureUrl().isEmpty() || user.getProfilePictureUrl() == null){
            user.setProfilePictureUrl("https://i.ibb.co/W4z4ktHq/default.jpg");
        }
        Hub hub = hubService.findById(1L).orElseGet(() -> {
            Hub defaultHub = new Hub();
            defaultHub.setName("general");
            defaultHub.setPublic(true);
            defaultHub.setDescription("Auto-created default hub");
            return hubService.save(defaultHub);
        });

        hubService.addMember(hub, user);
        return repository.save(user);
    }

    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(repository.findByEmail(email)).get();
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

    @Transactional
    public boolean tryUpdateProfilePicture(Long userId, String imageUrl) {
        Optional<User> optionalUser = repository.findById(userId);
        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();

        // თუ დღეს უკვე განახლებულია
        if (user.getProfilePictureLastUpdated() != null &&
                user.getProfilePictureLastUpdated().isEqual(LocalDate.now())) {
            return false;
        }

        // განახლება დაშვებულია
        user.setProfilePictureUrl(imageUrl);
        user.setProfilePictureLastUpdated(LocalDate.now());
        repository.save(user);
        return true;
    }

    @Transactional
    public void deleteProfilePicture(Long userId) {
        Optional<User> optionalUser = repository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setProfilePictureUrl("");
            user.setProfilePictureLastUpdated(LocalDate.now());
            repository.save(user);
        }
    }



}
