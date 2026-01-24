package com.example.vms.controller;

import com.example.vms.dto.DashboardDTO;
import com.example.vms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/analytics")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<DashboardDTO> getDashboard(
            @RequestParam String range
    ) {
        return ResponseEntity.ok(dashboardService.getDashboardData(range));
    }
}

