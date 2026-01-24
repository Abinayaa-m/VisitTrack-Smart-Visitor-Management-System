package com.example.vms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActiveVisitorDTO {

    private Long id;
    private String name;
    private String phone;
    private String purpose;
    private LocalDateTime entryTime;
}

