package com.example.vms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String purpose;

    private Long staffId;
    private String staffUsername;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private String status;
    private String qrPath;
    private boolean canExit;
}

