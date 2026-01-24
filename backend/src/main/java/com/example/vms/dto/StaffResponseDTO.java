package com.example.vms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffResponseDTO {
    private Long id;
    private Long userId;
    private String username;   // login username
    private String fullName;
    private String staffCode;
    private String department;
    private String designation;
    private String phone;
}


