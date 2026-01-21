package com.example.vms.controller;

import com.example.vms.dto.*;
import com.example.vms.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // --- create profile for logged-in staff (one-time) ---
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<StaffResponseDTO> createForCurrentUser(
            @RequestBody StaffRequestDTO dto,
            Authentication authentication
    ) {
        String username = authentication.getName();
        StaffResponseDTO resp = staffService.createForUser(username, dto);
        return ResponseEntity.ok(resp);
    }

    // --- get staff profile for current user (frontend checks this at login) ---
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<StaffResponseDTO> myProfile(Authentication authentication) {
        String username = authentication.getName();
        StaffResponseDTO resp = staffService.getByUserName(username);
        return ResponseEntity.ok(resp);
    }

    // --- get by staff code ---
    @GetMapping("/code/{staffCode}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public ResponseEntity<StaffResponseDTO> getByCode(@PathVariable String staffCode) {
        return ResponseEntity.ok(staffService.getByCode(staffCode));
    }

    // --- search for security (autocomplete) ---
    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public ResponseEntity<Page<StaffResponseDTO>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<StaffResponseDTO> resp = staffService.search(q, page, size);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<StaffResponseDTO> updateMyStaff(
            @RequestBody StaffRequestDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(staffService.updateStaffForUser(auth.getName(), dto));
    }



    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<StaffResponseDTO>> getAllStaff(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(
                staffService.getAllStaff(page, size, search)
        );
    }





    @DeleteMapping("/delete/me")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<String> deleteMyProfile(Authentication authentication) {
        String username = authentication.getName();
        staffService.deleteMyProfile(username);
        return ResponseEntity.ok("Staff profile deleted");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public ResponseEntity<StaffResponseDTO> getByStaffId(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getByStaffId(id));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteStaffByAdmin(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok("Staff deleted successfully");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<StaffResponseDTO> updateStaffByAdmin(
            @PathVariable Long id,
            @RequestBody StaffRequestDTO dto
    ) {
        return ResponseEntity.ok(
                staffService.updateStaffByAdmin(id, dto)
        );
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        staffService.changePassword(
                authentication.getName(),
                request.getOldPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<StaffDashboardDTO> dashboard(Authentication auth) {
        return ResponseEntity.ok(
                staffService.getDashboard(auth.getName())
        );
    }

    @GetMapping("/not-exited")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<List<ActiveVisitorDTO>> notExitedVisitors(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                staffService.getNotExitedVisitors(authentication.getName())
        );
    }

}

