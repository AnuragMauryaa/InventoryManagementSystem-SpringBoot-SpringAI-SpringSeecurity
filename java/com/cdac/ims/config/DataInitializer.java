package com.cdac.ims.config;

import com.cdac.ims.auth.entity.Role;
import com.cdac.ims.auth.entity.User;
import com.cdac.ims.auth.repository.RoleRepository;
import com.cdac.ims.auth.repository.UserRepository;
import com.cdac.ims.common.constants.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        createRole(RoleType.ADMIN);
        createRole(RoleType.MANAGER);
        createRole(RoleType.STAFF);

        createDefaultUsers();
    }

    private void createRole(RoleType roleType) {

        if (roleRepository.findByRoleType(roleType).isPresent()) {
            return;
        }

        Role role = Role.builder()
                .roleType(roleType)
                .build();

        roleRepository.save(role);
    }

    private void createDefaultUsers() {

        createUser(
                "System Administrator",
                "admin",
                "admin@ims.com",
                "9999999999",
                "Admin@123",
                RoleType.ADMIN
        );

        createUser(
                "Store Manager",
                "manager",
                "manager@ims.com",
                "8888888888",
                "Manager@123",
                RoleType.MANAGER
        );

        createUser(
                "Store Staff",
                "staff",
                "staff@ims.com",
                "7777777777",
                "Staff@123",
                RoleType.STAFF
        );
    }

    private void createUser(
            String fullName,
            String username,
            String email,
            String phone,
            String password,
            RoleType roleType
    ) {

        if (userRepository.findByUsername(username).isPresent()) {
            return;
        }

        Role role = roleRepository
                .findByRoleType(roleType)
                .orElseThrow(() ->
                        new RuntimeException("Role not found: " + roleType));

        User user = User.builder()
                .fullName(fullName)
                .username(username)
                .email(email)
                .phone(phone)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        userRepository.save(user);
    }
}