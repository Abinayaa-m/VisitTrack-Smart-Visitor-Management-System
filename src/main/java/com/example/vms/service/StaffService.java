package com.example.vms.service;

import com.example.vms.dto.*;
import com.example.vms.mapper.StaffMapper;
import com.example.vms.model.Staff;
import com.example.vms.model.User;
import com.example.vms.model.Visitor;
import com.example.vms.model.VisitorStatus;
import com.example.vms.repository.StaffRepository;
import com.example.vms.repository.UserRepository;
import com.example.vms.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VisitorRepository visitorRepository;



    /**
     * Create staff profile for the currently logged-in user.
     * - user must exist
     * - user.role must be ROLE_STAFF
     * - staff profile must not already exist for that user
     */
    @Transactional
    public StaffResponseDTO createForUser(String username, StaffRequestDTO dto) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == null || !user.getRole().name().equals("ROLE_STAFF")) {
            throw new RuntimeException("User is not a staff account");
        }

        // check whether profile already exists
        if (staffRepository.findByUser_Id(user.getId()).isPresent()) {
            throw new RuntimeException("Staff profile already exists for this user");
        }

        // staffCode unique
        if (staffRepository.existsByStaffCode(dto.getStaffCode())) {
            throw new RuntimeException("Staff code already exists");
        }

        Staff entity = staffMapper.toEntity(dto, user);
        Staff saved = staffRepository.save(entity);
        return staffMapper.toResponse(saved);
    }

    public StaffResponseDTO getByStaffId(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
        return staffMapper.toResponse(staff);
    }


    public StaffResponseDTO getByUserName(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        return staffMapper.toResponse(staff);
    }


    public StaffResponseDTO getByCode(String code) {
        Staff staff = staffRepository.findByStaffCode(code)
                .orElseThrow(() -> new RuntimeException("No staff with this code"));
        return staffMapper.toResponse(staff);
    }

    /**
     * Search staff (for security) by partial name or staffCode.
     * returns a page so frontend can show suggestions while typing.
     */
    public Page<StaffResponseDTO> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Staff> results = staffRepository.findByFullNameIgnoreCaseContainingOrStaffCodeIgnoreCaseContaining(query, query, pageable);
        return results.map(staffMapper::toResponse);
    }

    @Transactional
    public StaffResponseDTO updateStaffForUser(String username, StaffRequestDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        staff.setFullName(dto.getFullName());
        staff.setDepartment(dto.getDepartment());
        staff.setDesignation(dto.getDesignation());
        staff.setPhone(dto.getPhone());

        // staffCode should not be updated — it is unique identity
        Staff saved = staffRepository.save(staff);
        return staffMapper.toResponse(saved);
    }


    public Page<StaffResponseDTO> getAllStaff(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fullName").ascending());

        Page<Staff> staffPage;
        if (search.trim().isEmpty()) {
            staffPage = staffRepository.findAll(pageable);
        } else {
            staffPage = staffRepository.findByFullNameIgnoreCaseContainingOrStaffCodeIgnoreCaseContaining(
                    search, search, pageable);
        }

        return staffPage.map(staffMapper::toResponse);
    }


    @Transactional
    public void deleteMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        staffRepository.delete(staff);
    }

    @Transactional
    public void deleteStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Long userId = staff.getUser().getId();

        staffRepository.delete(staff);
        userRepository.deleteById(userId);   // deleting user login also
    }

    @Transactional
    public StaffResponseDTO updateStaffByAdmin(Long id, StaffRequestDTO dto) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        staff.setFullName(dto.getFullName());
        staff.setDepartment(dto.getDepartment());
        staff.setDesignation(dto.getDesignation());
        staff.setPhone(dto.getPhone());

        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    public void changePassword(String username, String oldPassword, String newPassword) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 validate old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // 🔒 update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


    public StaffDashboardDTO getDashboard(String authName) {

        // 🔑 Get User properly
        User user = userRepository.findByUsername(authName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Staff staff = staffRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        long todayVisitors = visitorRepository.countTodayVisitorsByStaff(
                staff.getId(),
                startOfDay,
                endOfDay
        );

        long activeVisitors = visitorRepository.countByStaff_IdAndStatus(
                staff.getId(),
                VisitorStatus.ACTIVE
        );

        return new StaffDashboardDTO(todayVisitors, activeVisitors);
    }


    public List<ActiveVisitorDTO> getNotExitedVisitors(String username) {

        return visitorRepository.findActiveVisitorsByStaff(username)
                .stream()
                .map(v -> new ActiveVisitorDTO(
                        v.getId(),
                        v.getName(),
                        v.getPhone(),
                        v.getPurpose(),
                        v.getEntryTime()
                ))
                .toList();
    }




}


