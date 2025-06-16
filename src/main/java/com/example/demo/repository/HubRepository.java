package com.example.demo.repository;

import com.example.demo.domain.Hub;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface HubRepository extends CrudRepository<Hub,Long> {

    @Modifying
    @Query("UPDATE Hub h SET h.isDeleted = true WHERE h.id = :id")
    void softDeleteById(@Param("id") Long id);
}
