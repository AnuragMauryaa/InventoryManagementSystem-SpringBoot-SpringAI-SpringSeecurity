package com.cdac.ims.auth.controller;

import com.cdac.ims.auth.dto.UserResponse;
import com.cdac.ims.auth.dto.UserRoleUpdateRequest;
import com.cdac.ims.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/access")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUserAccess(
            @PathVariable Long id, 
            @RequestBody UserRoleUpdateRequest request) {
        return userService.updateUserAccess(id, request);
    }
}