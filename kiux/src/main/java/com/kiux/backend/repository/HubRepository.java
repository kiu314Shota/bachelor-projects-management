package com.kiux.backend.repository;

import com.kiux.backend.model.Hub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface HubRepository extends JpaRepository<Hub, Long> {}