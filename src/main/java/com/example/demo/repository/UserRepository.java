package com.example.demo.repository;

import com.example.demo.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    @Modifying
    @Query("UPDATE User u SET u.isDeleted = true WHERE u.email = :email")
    void softDeleteByEmail(@Param("email") String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isDeleted = true WHERE u.id = :id")
    void softDeleteById(@Param("id") Long id);

    User findByEmail(String email);
    Iterable<User> findAllByDateOfBirth(LocalDate dateOfBirth); // ✅ სწორი
}
