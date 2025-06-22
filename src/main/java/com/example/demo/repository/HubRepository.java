package com.example.demo.repository;

import com.example.demo.domain.Hub;
import com.example.demo.dto.HubActivityDto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HubRepository extends CrudRepository<Hub,Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Hub h SET h.isDeleted = true WHERE h.id = :id")
    void softDeleteById(@Param("id") Long id);


    Optional<Hub> findByNameIgnoreCase(String name);


}
