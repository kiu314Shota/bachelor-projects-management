package com.example.demo.service;

import com.example.demo.domain.Hub;
import com.example.demo.domain.User;
import com.example.demo.repository.HubRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor

public class HubService {

    private final HubRepository repository;

    public Hub save(Hub entity) {
        return repository.save(entity);
    }
    @Transactional
    public Hub createHubByUser(Hub hub, User creator) {
        hub.setDeleted(false);
        hub.setAdmins(List.of(creator));
        creator.getAdminHubs().add(hub);
        return repository.save(hub);
    }

    @Transactional
    public void addMember(Hub hub, User user) {
        hub.getMembers().add(user);
        user.getMemberHubs().add(hub);
        repository.save(hub);
    }

    @Transactional
    public void addAdmin(Hub hub, User user) {
        hub.getAdmins().add(user);
        user.getAdminHubs().add(hub);
        repository.save(hub);
    }


    public List<Hub> findHubsByAdmin(User admin) {
        return findAllActive().stream()
                .filter(hub -> hub.getAdmins().contains(admin))
                .toList();
    }

    public List<Hub> findHubsByMember(User member) {
        return findAllActive().stream()
                .filter(hub -> hub.getMembers().contains(member))
                .toList();
    }


    public  Iterable<Hub> saveAll(Iterable<Hub> entities) {
        return repository.saveAll(entities);
    }

    public Optional<Hub> findById(Long aLong) {
        return repository.findById(aLong);
    }
    public Optional<Hub> findActiveById(Long id) {
        return repository.findById(id).filter(hub -> !hub.isDeleted());
    }

    public boolean existsById(Long aLong) {
        return repository.existsById(aLong);
    }

    public Iterable<Hub> findAll() {
        return repository.findAll();
    }
    public List<Hub> findPublicHubs() {
        return findAllActive().stream()
                .filter(Hub::isPublic)
                .toList();
    }

    public Iterable<Hub> findAllById(Iterable<Long> longs) {
        return repository.findAllById(longs);
    }
    public List<Hub> findAllActive() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(hub -> !hub.isDeleted())
                .toList();
    }

    public long count() {
        return repository.count();
    }

    @Transactional
    public void softDeleteById(Long id) {
        repository.softDeleteById(id);
    }


    @Transactional
    public void removeMember(Hub hub, User user) {
        hub.getMembers().remove(user);
        user.getMemberHubs().remove(hub);
        repository.save(hub);
    }
    @Transactional
    public void leaveHubAsAdmin(Hub hub, User user) {
        hub.getAdmins().remove(user);
        user.getAdminHubs().remove(hub);
        repository.save(hub);
    }


}
