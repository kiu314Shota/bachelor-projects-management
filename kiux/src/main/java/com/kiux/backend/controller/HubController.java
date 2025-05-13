package com.kiux.backend.controller;

import com.kiux.backend.model.Hub;
import com.kiux.backend.service.HubService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hubs")
public class HubController {
    private final HubService hubService;

    @Autowired
    public HubController(HubService hubService) {
        this.hubService = hubService;
    }

    @PostMapping
    public Hub createHub(@RequestParam Long creatorId, @RequestParam String name) {
        return hubService.createHub(creatorId, name);
    }

    @PostMapping("/{hubId}/join")
    public void joinHub(@PathVariable Long hubId, @RequestParam Long userId) {
        hubService.addUserToHub(hubId, userId);
    }

    @GetMapping
    public List<Hub> getAllHubs() {
        return hubService.getAllHubs();
    }
}
