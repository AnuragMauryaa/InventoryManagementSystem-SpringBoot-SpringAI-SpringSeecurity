package com.cdac.ims.auth.service;

import com.cdac.ims.auth.dto.UserResponse;
import com.cdac.ims.auth.dto.UserRoleUpdateRequest;
import com.cdac.ims.auth.entity.Role;
import com.cdac.ims.auth.entity.User;
import com.cdac.ims.auth.repository.RoleRepository;
import com.cdac.ims.auth.repository.UserRepository;
import com.cdac.ims.common.constants.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserResponse updateUserAccess(Long id, UserRoleUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Role role = roleRepository.findByRoleType(RoleType.valueOf(request.getRole().toUpperCase()))
                .orElseThrow(() -> new RuntimeException("Role not found"));
                
        user.setRole(role);
        user.setEnabled(request.getEnabled());
        userRepository.save(user);
        
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getRoleType().name())
                .enabled(user.getEnabled())
                .build();
    }
}