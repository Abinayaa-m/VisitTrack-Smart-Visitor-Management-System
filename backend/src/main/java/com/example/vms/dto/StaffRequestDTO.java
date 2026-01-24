package com.example.vms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffRequestDTO {
    private String fullName;
    private String staffCode;
    private String department;
    private String designation;
    private String phone;
}

