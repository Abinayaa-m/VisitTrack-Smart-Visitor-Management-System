package com.example.vms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long visitorId;

    // ✅ which staff owns this visit
    private String staffUsername;

    // ENTERED / EXITED
    private String action;

    private LocalDateTime timestamp;
}
