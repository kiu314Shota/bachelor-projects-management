package com.example.demo.service;

import com.example.demo.domain.Hub;
import com.example.demo.domain.HubJoinRequest;
import com.example.demo.domain.User;
import com.example.demo.repository.HubJoinRequestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HubJoinRequestService {

    private final HubJoinRequestRepository repository;

    public List<HubJoinRequest> findAll() {
        return repository.findAll();
    }

    public Optional<HubJoinRequest> findById(Long id) {
        return repository.findById(id);
    }

    public boolean existsPendingRequest(User sender, Hub hub) {
        return repository.existsBySenderAndTargetHub(sender, hub);
    }

    @Transactional
    public HubJoinRequest createRequest(User sender, Hub hub, String message) {
        if (existsPendingRequest(sender, hub)) {
            throw new IllegalStateException("You already have a pending request to this hub.");
        }

        HubJoinRequest request = new HubJoinRequest();
        request.setSender(sender);
        request.setTargetHub(hub);
        request.setMessage(message);
        return repository.save(request);
    }

    @Transactional
    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }


    public List<HubJoinRequest> findByHub(Hub hub) {
        return repository.findByTargetHub(hub);
    }

    public List<HubJoinRequest> findBySender(User sender) {
        return repository.findBySender(sender);
    }
}
