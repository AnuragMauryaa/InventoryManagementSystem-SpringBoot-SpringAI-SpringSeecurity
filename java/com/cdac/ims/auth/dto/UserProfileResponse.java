package com.cdac.ims.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {

    private String fullName;

    private String username;

    private String role;
}
