package com.example.demo.controller;

import com.example.demo.domain.Hub;
import com.example.demo.domain.User;
import com.example.demo.dto.HubRequestDto;
import com.example.demo.dto.HubResponseDto;
import com.example.demo.service.HubService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/hubs")
@RequiredArgsConstructor
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

    @DeleteMapping("/{hubId}/remove-member")
    public void removeMember(@PathVariable Long hubId, @RequestParam Long userId) {
        Hub hub = hubService.findActiveById(hubId).orElseThrow();
        User user = userService.findById(userId).orElseThrow();
        hubService.removeMember(hub, user);
    }

    @DeleteMapping("/{hubId}/leave-admin")
    public void leaveAsAdmin(@PathVariable Long hubId, @RequestParam Long userId) {
        Hub hub = hubService.findActiveById(hubId).orElseThrow();
        User user = userService.findById(userId).orElseThrow();
        hubService.leaveHubAsAdmin(hub, user);
    }

    @DeleteMapping("/{hubId}")
    public void softDelete(@PathVariable Long hubId) {
        hubService.softDeleteById(hubId);
    }

    private HubResponseDto toDto(Hub hub) {
        HubResponseDto dto = modelMapper.map(hub, HubResponseDto.class);
        dto.setAdminIds(hub.getAdmins() != null ? hub.getAdmins().stream().map(User::getId).toList() : List.of());
        dto.setMemberIds(hub.getMembers() != null ? hub.getMembers().stream().map(User::getId).toList() : List.of());
        dto.setPostIds(hub.getPosts() != null ? hub.getPosts().stream().map(p -> p.getId()).toList() : List.of());
        return dto;
    }
}
