package com.example.demo.repository;

import com.example.demo.domain.HubJoinRequest;


import com.example.demo.domain.Hub;
import com.example.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HubJoinRequestRepository extends JpaRepository<HubJoinRequest, Long> {

    boolean existsBySenderAndTargetHub(User sender, Hub targetHub);

    List<HubJoinRequest> findByTargetHub(Hub hub);

    List<HubJoinRequest> findBySender(User sender);
}
