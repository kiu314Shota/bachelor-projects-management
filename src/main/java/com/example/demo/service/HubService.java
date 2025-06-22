package com.example.demo.service;

import com.example.demo.domain.Hub;
import com.example.demo.domain.HubJoinRequest;
import com.example.demo.domain.User;
import com.example.demo.dto.HubActivityDto;
import com.example.demo.repository.HubRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class HubService {

    private final HubRepository repository;
    private final HubJoinRequestService joinRequestService;

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

    @Transactional
    public void approveJoinRequest(Hub hub, User admin, User requestSender) {
        if (!isAdminOfHub(admin, hub)) {
            throw new SecurityException("Only admins can approve join requests.");
        }

        addMember(hub, requestSender);

        joinRequestService.findBySender(requestSender).stream()
                .filter(r -> r.getTargetHub().equals(hub))
                .findFirst()
                .ifPresent(r -> joinRequestService.deleteRequest(r.getId()));
    }
    @Transactional
    public void makeHubPublic(Long hubId, Long adminId) {
        Hub hub = repository.findById(hubId)
                .orElseThrow(() -> new IllegalArgumentException("Hub not found"));
        if (!isAdminOfHubById(adminId, hub)) {
            throw new SecurityException("Only admins can change visibility");
        }
        hub.setPublic();
        repository.save(hub);
    }

    @Transactional
    public void makeHubPrivate(Long hubId, Long adminId) {
        Hub hub = repository.findById(hubId)
                .orElseThrow(() -> new IllegalArgumentException("Hub not found"));
        if (!isAdminOfHubById(adminId, hub)) {
            throw new SecurityException("Only admins can change visibility");
        }
        hub.setPrivate();
        repository.save(hub);
    }


    @Transactional
    public boolean tryUpdatePhoto(Long hubId, String url) {
        Optional<Hub> optionalHub = repository.findById(hubId);
        if (optionalHub.isEmpty()) return false;

        Hub hub = optionalHub.get();

        if (hub.getPhotoLastUpdated() != null &&
                hub.getPhotoLastUpdated().isEqual(LocalDate.now())) {
            return false;
        }

        hub.setPhotoUrl(url);
        hub.setPhotoLastUpdated(LocalDate.now());
        repository.save(hub);
        return true;
    }

    @Transactional
    public void deletePhoto(Long hubId) {
        Optional<Hub> optionalHub = repository.findById(hubId);
        if (optionalHub.isPresent()) {
            Hub hub = optionalHub.get();
            hub.setPhotoUrl(null);
            hub.setPhotoLastUpdated(null);
            repository.save(hub);
        }
    }


    public List<HubActivityDto> getTopActiveHubsInLastNHours(int hours, int limit) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hours);

        return findAllActive().stream()
                .map(hub -> {
                    long count = hub.getPosts().stream()
                            .filter(post -> post.getCreatedAt() != null && post.getCreatedAt().isAfter(cutoff))
                            .count();
                    return new HubActivityDto(hub.getId(), hub.getName(), count);
                })
                .filter(dto -> dto.getNumberOfPosts() > 0)
                .sorted(Comparator.comparingLong(HubActivityDto::getNumberOfPosts).reversed())
                .limit(limit)
                .toList();
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

    public Iterable<Hub> saveAll(Iterable<Hub> entities) {
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

    public boolean isAdminOfHub(User user, Hub hub) {
        return hub.getAdmins().contains(user);
    }

    public boolean isAdminOfHubById(Long userId, Hub hub) {
        return hub.getAdmins().stream().anyMatch(admin -> admin.getId().equals(userId));
    }

    public boolean isMemberOfHub(User user, Hub hub) {
        return hub.getMembers().contains(user);
    }

    public boolean isActiveHub(Hub hub) {
        return !hub.isDeleted();
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
