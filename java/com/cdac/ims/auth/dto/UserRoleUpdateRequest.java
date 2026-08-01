package com.cdac.ims.auth.dto;

import lombok.Data;

@Data
public class UserRoleUpdateRequest {
    private String role;
    private Boolean enabled;
}