package com.cdac.ims.auth.controller;

import com.cdac.ims.auth.dto.LoginRequest;
import com.cdac.ims.auth.dto.LoginResponse;
import com.cdac.ims.auth.dto.RegisterRequest;
import com.cdac.ims.auth.dto.UserProfileResponse;
import com.cdac.ims.auth.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cdac.ims.auth.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody @Valid LoginRequest request
    ) {

        return ResponseEntity.ok(
                authenticationService.login(request)
        );

    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody @Valid RegisterRequest request
    ) {

        return ResponseEntity.status(201).body(
                authenticationService.register(request)
        );

    }
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> currentUser(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ResponseEntity.ok(authenticationService.getProfile(user.getUsername()));
    }

}
