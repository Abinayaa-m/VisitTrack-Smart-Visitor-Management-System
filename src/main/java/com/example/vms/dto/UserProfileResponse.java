package com.example.vms.dto;

import com.example.vms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private String username;
    private String email;
    private Role role;
}

