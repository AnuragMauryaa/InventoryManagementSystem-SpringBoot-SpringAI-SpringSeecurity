package com.cdac.ims.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String role;
    private Boolean enabled;
}