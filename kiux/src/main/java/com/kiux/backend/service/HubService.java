package com.kiux.backend.service;

import com.kiux.backend.model.Hub;
import com.kiux.backend.model.User;
import com.kiux.backend.repository.HubRepository;
import com.kiux.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class HubService {
    private final HubRepository hubRepo;
    private final UserRepository userRepo;

    @Autowired
    public HubService(HubRepository hubRepo, UserRepository userRepo) {
        this.hubRepo = hubRepo;
        this.userRepo = userRepo;
    }

    public Hub createHub(Long creatorId, String name) {
        User creator = userRepo.findById(creatorId).orElseThrow();
        Hub hub = new Hub.Builder()
            .name(name)
            .creator(creator)
            .build();
        hub.getMembers().add(creator);
        return hubRepo.save(hub);
    }

    public void addUserToHub(Long hubId, Long userId) {
        Hub hub = hubRepo.findById(hubId).orElseThrow();
        User user = userRepo.findById(userId).orElseThrow();
        hub.getMembers().add(user);
        hubRepo.save(hub);
    }

    public List<Hub> getAllHubs() {
        return hubRepo.findAll();
    }
}
