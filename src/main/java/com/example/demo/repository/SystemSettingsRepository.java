package com.example.demo.repository;

import com.example.demo.domain.SystemSettings;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSettingsRepository extends CrudRepository<SystemSettings, Long> {
}
