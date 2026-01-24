package com.example.vms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorRequestDTO {

    private String name;
    private String email;
    private String phone;
    private String purpose;

    private Long staffId;  // instead of nested staff object
}

