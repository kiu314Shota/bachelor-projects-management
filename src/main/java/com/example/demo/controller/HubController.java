package com.example.demo.controller;

import com.example.demo.domain.Hub;
import com.example.demo.domain.User;
import com.example.demo.dto.HubActivityDto;
import com.example.demo.dto.HubRequestDto;
import com.example.demo.dto.HubResponseDto;
import com.example.demo.service.HubService;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/hubs")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")

public class HubController {

    private final HubService hubService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @PostMapping
    public HubResponseDto createHub(@RequestBody HubRequestDto request, @RequestParam Long creatorId) {
        User creator = userService.findById(creatorId).orElseThrow();
        Hub hub = modelMapper.map(request, Hub.class);
        return toDto(hubService.createHubByUser(hub, creator));
    }

    @GetMapping("/{id}")
    public HubResponseDto getHubById(@PathVariable Long id) {
        return hubService.findActiveById(id).map(this::toDto).orElse(null);
    }

    @GetMapping
    public List<HubResponseDto> getAllHubs() {
        return StreamSupport.stream(hubService.findAll().spliterator(), false)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/public")
    public List<HubResponseDto> getPublicHubs() {
        return hubService.findPublicHubs().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    @GetMapping("/top-active")
    public ResponseEntity<List<HubActivityDto>> getTopActiveHubs(
            @RequestParam(defaultValue = "3") int hours,
            @RequestParam(defaultValue = "5") int limit) {

        List<HubActivityDto> topHubs = hubService.getTopActiveHubsInLastNHours(hours, limit);
        return ResponseEntity.ok(topHubs);
    }


    @PostMapping("/{hubId}/add-member")
    public void addMember(@PathVariable Long hubId, @RequestParam Long userId) {
        Hub hub = hubService.findActiveById(hubId).orElseThrow();
        User user = userService.findById(userId).orElseThrow();
        hubService.addMember(hub, user);
    }

    @PostMapping("/{hubId}/add-admin")
    public void addAdmin(@PathVariable Long hubId, @RequestParam Long userId) {
        Hub hub = hubService.findActiveById(hubId).orElseThrow();
        User user = userService.findById(userId).orElseThrow();
        hubService.addAdmin(hub, user);
    }

    @PutMapping("/{hubId}/make-public")
    public ResponseEntity<String> makeHubPublic(@PathVariable Long hubId, @RequestParam Long adminId) {
        hubService.makeHubPublic(hubId, adminId);
        return ResponseEntity.ok("Hub is now public");
    }

    @PutMapping("/{hubId}/make-private")
    public ResponseEntity<String> makeHubPrivate(@PathVariable Long hubId, @RequestParam Long adminId) {
        hubService.makeHubPrivate(hubId, adminId);
        return ResponseEntity.ok("Hub is now private");
    }

    @DeleteMapping("/{hubId}/remove-member")
    public ResponseEntity<String> removeMember(
            @PathVariable Long hubId,
            @RequestParam Long userId,
            @RequestParam Long adminId
    ) {
        Hub hub = hubService.findActiveById(hubId).orElseThrow();
        User user = userService.findById(userId).orElseThrow();
        User admin = userService.findById(adminId).orElseThrow();

        try {
            hubService.removeMember(hub, user, admin);
            return ResponseEntity.ok("Member removed");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Only admins can remove members.");
        }
    }

    @DeleteMapping("/{hubId}/leave-hub")
    public ResponseEntity<String> leaveHub(@PathVariable Long hubId, @RequestParam Long userId) {
        Hub hub = hubService.findActiveById(hubId).orElseThrow();
        User user = userService.findById(userId).orElseThrow();

        boolean isAdmin = hub.getAdmins().contains(user);
        boolean isMember = hub.getMembers().contains(user);

        if (!isAdmin && !isMember) return ResponseEntity.badRequest().body("User not part of the hub");

        if (isAdmin && hub.getAdmins().size() == 1) {
            hubService.softDeleteById(hubId);
            return ResponseEntity.ok("Hub deleted because the last admin left.");
        }

        hubService.leaveHub(hub, user);
        return ResponseEntity.ok("You have left the hub.");
    }



    @DeleteMapping("/{hubId}")
    public void softDelete(@PathVariable Long hubId) {
        hubService.softDeleteById(hubId);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}/photo")
    public boolean tryUpdatePhoto(@PathVariable Long id, @RequestParam String url) {
        return hubService.tryUpdatePhoto(id, url);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}/photo")
    public void deletePhoto(@PathVariable Long id) {
        hubService.deletePhoto(id);
    }

    private HubResponseDto toDto(Hub hub) {
        HubResponseDto dto = modelMapper.map(hub, HubResponseDto.class);
        dto.setAdminIds(hub.getAdmins() != null ? hub.getAdmins().stream().map(User::getId).toList() : List.of());
        dto.setMemberIds(hub.getMembers() != null ? hub.getMembers().stream().map(User::getId).toList() : List.of());
        dto.setPostIds(hub.getPosts() != null ? hub.getPosts().stream().map(p -> p.getId()).toList() : List.of());
        return dto;
    }
}
