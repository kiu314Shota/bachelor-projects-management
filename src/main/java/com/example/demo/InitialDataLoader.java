package com.example.demo;

import com.example.demo.domain.*;
import com.example.demo.repository.HubRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitialDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HubRepository hubRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Check if the hub exists
        Hub generalHub = hubRepository.findByNameIgnoreCase("General").orElseGet(() -> {
            Hub newHub = new Hub();
            newHub.setName("General");
            newHub.setDescription("Default hub for all users");
            newHub.setPublic(true);
            return hubRepository.save(newHub);
        });

        // Check if anonymous user exists
        userRepository.findByEmail("anonymous@kiux.ge").orElseGet(() -> {
            User anon = new User();
            anon.setFirstName("Anonymous");
            anon.setLastName("User");
            anon.setEmail("anonymous@kiux.ge");
            anon.setPasswordHash("anon123");
            anon.setDateOfBirth(LocalDate.of(2000, 1, 1));
            anon.setYearOfStudy(YearOfStudy.FRESHMAN);
            anon.setProfilePictureUrl("https://i.ibb.co/xKqjpfJF/download.png");
            anon.setRole(Role.USER);
            //აქ ანონიმურის ფოტა დასამატებელი
            anon.setProfilePictureUrl("");

            // Link hub to user (with modifiable lists)
            List<Hub> adminHubs = new ArrayList<>();
            adminHubs.add(generalHub);
            anon.setAdminHubs(adminHubs);

            List<Hub> memberHubs = new ArrayList<>();
            memberHubs.add(generalHub);
            anon.setMemberHubs(memberHubs);

            User saved = userRepository.save(anon);

            // Link user to hub
            List<User> admins = new ArrayList<>();
            admins.add(saved);
            generalHub.setAdmins(admins);

            List<User> members = new ArrayList<>();
            members.add(saved);
            generalHub.setMembers(members);

            hubRepository.save(generalHub);

            return saved;
        });
    }
}
