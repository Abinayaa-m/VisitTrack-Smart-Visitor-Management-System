package com.example.vms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String purpose;

    // ✅ FIXED: Visitor points to Staff, NOT User
    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    @Enumerated(EnumType.STRING)
    private VisitorStatus status;

    private String qrPath;
}
