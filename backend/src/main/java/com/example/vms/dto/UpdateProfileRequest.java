package com.example.vms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;
}


