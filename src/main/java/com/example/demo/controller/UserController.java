package com.example.demo.controller;

import com.example.demo.domain.User;
import com.example.demo.domain.YearOfStudy;
import com.example.demo.dto.UserRequestDto;
import com.example.demo.dto.UserResponseDto;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    // PUBLIC: register
    @PostMapping
    public UserResponseDto createUser(@RequestBody UserRequestDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        return toDto(userService.save(user));
    }

    // SECURED endpoints
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable Long id) {
        return userService.findById(id).map(this::toDto).orElse(null);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/email")
    public UserResponseDto getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email).map(this::toDto).orElse(null);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return StreamSupport.stream(userService.findAll().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/active")
    public List<UserResponseDto> getActiveUsers() {
        return StreamSupport.stream(userService.listActiveUsers().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @SecurityRequirement(name = "bearerAuth")
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

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}/year")
    public void updateYear(@PathVariable Long id, @RequestParam YearOfStudy year) {
        userService.updateYearOfStudy(id, year);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}/password")
    public void updatePassword(@PathVariable Long id, @RequestParam String hash) {
        userService.updatePasswordHash(id, hash);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public void softDeleteById(@PathVariable Long id) {
        userService.deleteById(id);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/email")
    public void softDeleteByEmail(@RequestParam String email) {
        userService.deleteByEmail(email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}/profile-picture")
    public boolean tryUpdateProfilePicture(
            @PathVariable Long id,
            @RequestParam String url
    ) {
        return userService.tryUpdateProfilePicture(id, url);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}/profile-picture")
    public void deleteProfilePicture(@PathVariable Long id) {
        userService.deleteProfilePicture(id);
    }

    private UserResponseDto toDto(User user) {
        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);

        dto.setAdminHubIds(user.getAdminHubs() != null ?
                user.getAdminHubs().stream().map(h -> h.getId()).toList() : List.of());

        dto.setMemberHubIds(user.getMemberHubs() != null ?
                user.getMemberHubs().stream().map(h -> h.getId()).toList() : List.of());

        return dto;
    }
}
