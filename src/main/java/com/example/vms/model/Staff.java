package com.example.vms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👇 Link this staff profile with user login
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String fullName;

    @Column(nullable = false, unique = true)
    private String staffCode;   // 🔥 unique code

    private String department;

    private String designation;

    private String phone;
}

