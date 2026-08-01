package com.cdac.ims.auth.service;

import com.cdac.ims.auth.dto.LoginRequest;
import com.cdac.ims.auth.dto.LoginResponse;
import com.cdac.ims.auth.dto.RegisterRequest;
import com.cdac.ims.auth.dto.UserProfileResponse;
import com.cdac.ims.auth.entity.Role;
import com.cdac.ims.auth.entity.User;
import com.cdac.ims.auth.repository.RoleRepository;
import com.cdac.ims.auth.repository.UserRepository;
import com.cdac.ims.auth.security.JwtService;
import com.cdac.ims.auth.security.CustomUserDetails;
import com.cdac.ims.common.constants.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow();
        
        String token = jwtService.generateToken(
                new CustomUserDetails(user)
        );
        
        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().getRoleType().name())
                .build();
    }

    @Override
    public String register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername())){
            throw new IllegalArgumentException("Username already exists");
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email already exists");
        }

        // Extract role from request, fallback to STAFF if empty or invalid
        RoleType requestedRoleType;
        try {
            requestedRoleType = RoleType.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            requestedRoleType = RoleType.STAFF; 
        }

        Role assignedRole = roleRepository
                .findByRoleType(requestedRoleType)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(assignedRole)
                .build();
                
        userRepository.save(user);
        return "User Registered Successfully";
    }

    @Override
    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new java.util.NoSuchElementException("User not found"));
                
        return UserProfileResponse.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .role(user.getRole().getRoleType().name())
                .build();
    }
}
