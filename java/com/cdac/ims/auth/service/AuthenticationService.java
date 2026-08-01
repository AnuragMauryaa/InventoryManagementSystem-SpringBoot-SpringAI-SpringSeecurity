package com.cdac.ims.auth.service;

import com.cdac.ims.auth.dto.LoginRequest;
import com.cdac.ims.auth.dto.LoginResponse;
import com.cdac.ims.auth.dto.RegisterRequest;
import com.cdac.ims.auth.dto.UserProfileResponse;

public interface AuthenticationService {

    LoginResponse login(LoginRequest request);

    String register(RegisterRequest request);

    UserProfileResponse getProfile(String username);

}
