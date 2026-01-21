package com.example.vms.controller;

import com.example.vms.dto.ChangePasswordRequest;
import com.example.vms.dto.UpdateProfileRequest;
import com.example.vms.dto.UserProfileResponse;
import com.example.vms.model.User;
import com.example.vms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponse getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        return new UserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    @PutMapping("/me")
    public String updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        userService.updateProfile(authentication.getName(), request.getEmail());
        return "profile_updated";
    }

    @PutMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(
                authentication.getName(),
                request.getOldPassword(),
                request.getNewPassword()
        );
        return "password_changed";
    }
}
