package com.example.demo.controller;

import com.example.demo.domain.Hub;
import com.example.demo.domain.HubJoinRequest;
import com.example.demo.domain.User;
import com.example.demo.dto.HubJoinRequestDto;
import com.example.demo.service.HubJoinRequestService;
import com.example.demo.service.HubService;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hub-join-requests")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class HubJoinRequestController {

    private final HubJoinRequestService joinRequestService;
    private final HubService hubService;
    private final UserService userService;

    @PostMapping("/send")
    public ResponseEntity<String> sendJoinRequest(@RequestParam Long senderId,
                                             @RequestParam Long hubId,
                                             @RequestParam(required = false) String message) {
        User sender = userService.findById(senderId).orElseThrow();
        Hub hub = hubService.findById(hubId).orElseThrow();

        if (hub.isPublic()) {
            return ResponseEntity.badRequest().body("This hub is public. You can join directly.");
        }

        joinRequestService.createRequest(sender, hub, message == null ? "" : message);
        return ResponseEntity.ok("Request sent.");
    }

    @GetMapping("/by-hub/{hubId}")
    public ResponseEntity<List<HubJoinRequestDto>> getRequestsForHub(
            @PathVariable Long hubId,
            @RequestParam Long adminId) {

        Hub hub = hubService.findById(hubId).orElseThrow();
        User admin = userService.findById(adminId).orElseThrow();

        if (!hubService.isAdminOfHub(admin, hub)) {
            return ResponseEntity.status(403).build();
        }

        List<HubJoinRequestDto> dtoList = joinRequestService.findByHub(hub).stream()
                .map(this::toDto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/approve")
    @Transactional
    public ResponseEntity<String> approveRequest(@RequestParam Long adminId,
                                            @RequestParam Long senderId,
                                            @RequestParam Long hubId) {
        User admin = userService.findById(adminId).orElseThrow();
        User sender = userService.findById(senderId).orElseThrow();
        Hub hub = hubService.findById(hubId).orElseThrow();

        if (!hubService.isAdminOfHub(admin, hub)) {
            return ResponseEntity.status(403).body("Only admins can approve join requests.");
        }

        HubJoinRequest request = joinRequestService.findBySender(sender).stream()
                .filter(r -> r.getTargetHub().getId().equals(hub.getId()))
                .findFirst()
                .orElse(null);

        if (request == null) {
            return ResponseEntity.status(404).body("Join request not found for this user and hub.");
        }

        hubService.addMember(hub, sender);
        joinRequestService.deleteRequest(request.getId());

        return ResponseEntity.ok("Request approved.");
    }

    @DeleteMapping("/delete")
    @Transactional
    public ResponseEntity<HubJoinRequestDto> deleteRequest(@RequestParam Long adminId,
                                                           @RequestParam Long senderId,
                                                           @RequestParam Long hubId) {
        User admin = userService.findById(adminId).orElseThrow();
        User sender = userService.findById(senderId).orElseThrow();
        Hub hub = hubService.findById(hubId).orElseThrow();

        if (!hubService.isAdminOfHub(admin, hub)) {
            return ResponseEntity.status(403).build();
        }

        HubJoinRequest request = joinRequestService.findBySender(sender).stream()
                .filter(r -> r.getTargetHub().equals(hub))
                .findFirst()
                .orElseThrow();

        HubJoinRequestDto dto = toDto(request);
        joinRequestService.deleteRequest(request.getId());

        return ResponseEntity.ok(dto);
    }


    private HubJoinRequestDto toDto(HubJoinRequest request) {
        HubJoinRequestDto dto = new HubJoinRequestDto();
        dto.setRequestId(request.getId());
        dto.setSenderId(request.getSender().getId());
        dto.setFirstName(request.getSender().getFirstName());
        dto.setLastName(request.getSender().getLastName());
        dto.setMessage(request.getMessage());
        dto.setRequestTime(request.getRequestTime());
        return dto;
    }
}
