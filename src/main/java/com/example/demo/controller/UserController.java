package com.example.demo.controller;

import com.example.demo.domain.User;
import com.example.demo.domain.YearOfStudy;
import com.example.demo.dto.UserRequestDto;
import com.example.demo.dto.UserResponseDto;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @PostMapping
    public UserResponseDto createUser(@RequestBody UserRequestDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        return toDto(userService.save(user));
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable Long id) {
        return userService.findById(id).map(this::toDto).orElse(null);
    }

    @GetMapping("/email")
    public UserResponseDto getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email).map(this::toDto).orElse(null);
    }

    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return StreamSupport.stream(userService.findAll().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/active")
    public List<UserResponseDto> getActiveUsers() {
        return StreamSupport.stream(userService.listActiveUsers().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/birthday/{date}")
    public ResponseEntity<List<UserResponseDto>> getUsersByBirthday(@PathVariable String date) {
        try {
            LocalDate parsed = LocalDate.parse(date);
            List<UserResponseDto> users = StreamSupport.stream(userService.findAllByBirthDay(parsed).spliterator(), false)
                    .map(this::toDto)
                    .toList();
            return ResponseEntity.ok(users);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @PutMapping("/{id}/year")
    public void updateYear(@PathVariable Long id, @RequestParam YearOfStudy year) {
        userService.updateYearOfStudy(id, year);
    }

    @PutMapping("/{id}/password")
    public void updatePassword(@PathVariable Long id, @RequestParam String hash) {
        userService.updatePasswordHash(id, hash);
    }

    @DeleteMapping("/{id}")
    public void softDeleteById(@PathVariable Long id) {
        userService.deleteById(id);
    }

    @DeleteMapping("/email")
    public void softDeleteByEmail(@RequestParam String email) {
        userService.deleteByEmail(email);
    }

    private UserResponseDto toDto(User user) {
        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);

        if (user.getAdminHubs() != null) {
            dto.setAdminHubIds(user.getAdminHubs().stream()
                    .map(h -> h.getId())
                    .toList());
        } else {
            dto.setAdminHubIds(List.of());
        }

        if (user.getMemberHubs() != null) {
            dto.setMemberHubIds(user.getMemberHubs().stream()
                    .map(h -> h.getId())
                    .toList());
        } else {
            dto.setMemberHubIds(List.of());
        }

        return dto;
    }

}
