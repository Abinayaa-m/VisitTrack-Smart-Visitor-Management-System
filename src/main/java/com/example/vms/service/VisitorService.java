package com.example.vms.service;

import com.example.vms.dto.VisitorRequestDTO;
import com.example.vms.dto.VisitorResponseDTO;
import com.example.vms.mapper.VisitorMapper;
import com.example.vms.model.*;
import com.example.vms.repository.StaffRepository;
import com.example.vms.repository.VisitLogRepository;
import com.example.vms.repository.VisitorRepository;
import com.example.vms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class VisitorService {

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private VisitLogRepository visitLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QrService qrService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VisitorMapper visitorMapper;

    @Autowired
    private StaffRepository staffRepository;

    // -------------------------------
    // CREATE / ADD VISITOR
    // -------------------------------
    @Transactional
    public VisitorResponseDTO addVisitor(VisitorRequestDTO dto) {

        if (dto.getEmail() == null || !dto.getEmail().contains("@")) {
            throw new RuntimeException("Valid email is required");
        }

        Visitor visitor = visitorMapper.toEntity(dto);

        // Load staff
        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        visitor.setStaff(staff);

        visitor.setEntryTime(LocalDateTime.now());
        visitor.setStatus(VisitorStatus.ACTIVE);

        Visitor saved = visitorRepository.save(visitor);

        // Generate QR
        String qrPath = qrService.generateQrForVisitor(saved);
        saved.setQrPath(qrPath);
        visitorRepository.save(saved);

        // Email QR
        emailService.sendVisitorQr(
                saved.getEmail(),
                saved.getName(),
                saved.getQrPath()
        );

        return visitorMapper.toResponse(saved);
    }

    public Page<VisitorResponseDTO> getAllVisitors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("entryTime").descending());
        Page<Visitor> visitors = visitorRepository.findAll(pageable);
        return visitors.map(visitorMapper::toResponse);
    }


    // ----------------------------------
    // EXIT VISITOR (manual exit button)
    // ----------------------------------
    @Transactional
    public VisitorResponseDTO exitVisitor(Long visitorId) {

        Visitor visitor = visitorRepository.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));

        if (!visitor.getStatus().equals(VisitorStatus.ACTIVE)) {
            throw new RuntimeException("Visitor already exited");
        }

        visitor.setExitTime(LocalDateTime.now());
        visitor.setStatus(VisitorStatus.EXITED);
        visitorRepository.save(visitor);

        visitLogRepository.save(
                VisitLog.builder()
                        .visitorId(visitorId)
                        .action("EXITED")
                        .timestamp(LocalDateTime.now())
                        .build()
        );

        return visitorMapper.toResponse(visitor);
    }


    // --------------------------------------
    // QR SCAN — RETURN VISITOR + canExit
    // --------------------------------------
    public VisitorResponseDTO scanVisitor(String data, Authentication auth) {

        if (!data.startsWith("VMS_VISITOR:")) {
            throw new RuntimeException("Invalid QR format");
        }

        Long visitorId;
        try {
            visitorId = Long.parseLong(data.split(":")[1]);
        } catch (Exception e) {
            throw new RuntimeException("Invalid QR data");
        }

        Visitor visitor = visitorRepository.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));

        // Convert to DTO
        VisitorResponseDTO dto = visitorMapper.toResponse(visitor);

        // Check logged-in role
        boolean isSecurity = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SECURITY"));

        // Only security guard can exit visitor
        dto.setCanExit(isSecurity);

        return dto;
    }


    // --------------------------------------
    // OTHER EXISTING METHODS
    // --------------------------------------

    public Page<VisitorResponseDTO> listActive(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("entryTime").descending());
        Page<Visitor> visitors = visitorRepository.findByStatus(VisitorStatus.ACTIVE, pageable);
        return visitors.map(visitorMapper::toResponse);
    }



    public List<VisitorResponseDTO> findOverdue(LocalDateTime cutoff) {
        List<Visitor> visitors = visitorRepository.findActiveVisitorsBefore(cutoff);
        return visitorMapper.toResponseList(visitors);
    }


    public Page<VisitorResponseDTO> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Visitor> visitors = visitorRepository.searchAll(keyword, pageable);
        return visitors.map(visitorMapper::toResponse);
    }


//                            ----Filters----
public Page<VisitorResponseDTO> filterToday(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("entryTime").descending());

    LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
    LocalDateTime end = LocalDateTime.now();

    Page<Visitor> visitors =
            visitorRepository.findTodayVisitors(start, end, pageable);

    return visitors.map(visitorMapper::toResponse);
}




    public Page<VisitorResponseDTO> filterByDateRange(LocalDateTime from, LocalDateTime to, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("entryTime").descending());
        Page<Visitor> visitors = visitorRepository.findByDateRange(from, to, pageable);
        return visitors.map(visitorMapper::toResponse);
    }



    public Page<VisitorResponseDTO> filterByStatus(VisitorStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("entryTime").descending());
        Page<Visitor> visitors = visitorRepository.findByStatus(status, pageable);
        return visitors.map(visitorMapper::toResponse);
    }


    public Page<VisitorResponseDTO> filterByStaff(
            String username,
            VisitorStatus status,
            int page,
            int size
    ) {
        LocalDateTime startOfDay = LocalDateTime.now()
                .toLocalDate()
                .atStartOfDay();

        LocalDateTime endOfDay = LocalDateTime.now();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("entryTime").descending()
        );

        return visitorRepository
                .findTodayByStaffAndStatus(
                        username,
                        startOfDay,
                        endOfDay,
                        status, // 👈 NULL = all
                        pageable
                )
                .map(visitorMapper::toResponse);
    }







    public void exportVisitorsToExcel(LocalDateTime fromDate, LocalDateTime toDate,
                                      String sort, HttpServletResponse response) throws IOException {

        List<Visitor> visitors = visitorRepository.findByDateRange(fromDate, toDate);

        // 🔥 Apply sorting manually (same as CSV)
        visitors.sort((v1, v2) -> {
            if (sort.equalsIgnoreCase("name")) {
                return v1.getName().compareToIgnoreCase(v2.getName());
            } else {
                return v2.getEntryTime().compareTo(v1.getEntryTime()); // latest first
            }
        });

        // 🔥 Generate Excel sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Visitors");

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Name");
        header.createCell(1).setCellValue("Email");
        header.createCell(2).setCellValue("Phone");
        header.createCell(3).setCellValue("Entry Time");
        header.createCell(4).setCellValue("Exit Time");
        header.createCell(5).setCellValue("Status");
        header.createCell(6).setCellValue("Staff Visited");

        int rowCount = 1;
        for (Visitor v : visitors) {
            Row row = sheet.createRow(rowCount++);
            row.createCell(0).setCellValue(v.getName());
            row.createCell(1).setCellValue(v.getEmail());
            row.createCell(2).setCellValue(v.getPhone());
            row.createCell(3).setCellValue(String.valueOf(v.getEntryTime()));
            row.createCell(4).setCellValue(v.getExitTime() != null ? String.valueOf(v.getExitTime()) : "Still Inside");
            row.createCell(5).setCellValue(v.getStatus().name());
            row.createCell(6).setCellValue(
                    v.getStaff() != null && v.getStaff().getUser() != null
                            ? v.getStaff().getUser().getUsername()
                            : "N/A"
            );

        }

        String filename = "visitors_export.xlsx";

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=" + filename);

        workbook.write(response.getOutputStream());
        workbook.close();
    }


    public void exportVisitorsToCSV(LocalDateTime fromDate, LocalDateTime toDate,
                                    String sort, HttpServletResponse response) throws IOException {

        Sort sorting;
        if (sort.equalsIgnoreCase("name")) {
            sorting = Sort.by("name").ascending();
        } else {
            sorting = Sort.by("entryTime").descending();
        }

        // Fetch visitors by date range
        List<Visitor> visitors = visitorRepository.findByDateRange(fromDate, toDate);

        // Apply sorting manually
        visitors.sort((v1, v2) -> {
            if (sort.equalsIgnoreCase("name")) {
                return v1.getName().compareToIgnoreCase(v2.getName());
            } else {
                return v2.getEntryTime().compareTo(v1.getEntryTime()); // latest first
            }
        });

        // CSV Response Headers
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=visitors_report.csv");

        // CSV Writing
        String header = "Visitor Name,Phone,Email,Staff Name,Entry Time,Exit Time,Status\n";
        response.getWriter().write(header);

        for (Visitor v : visitors) {
            response.getWriter().write(
                    String.format(
                            "%s,%s,%s,%s,%s,%s,%s\n",
                            v.getName(),
                            v.getPhone(),
                            v.getEmail(),
                            (v.getStaff() != null && v.getStaff().getUser() != null
                                    ? v.getStaff().getUser().getUsername()
                                    : "N/A"),
                            v.getEntryTime(),
                            v.getExitTime() != null ? v.getExitTime() : "",
                            v.getStatus().name()
                    )
            );
        }

        response.getWriter().flush();
    }

    public Map<String, Long> getTodayStats() {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = LocalDateTime.now();

        long total = visitorRepository.countByDateRange(start, end);
        long active = visitorRepository.countByStatusAndDateRange(VisitorStatus.ACTIVE, start, end);
        long exited = visitorRepository.countByStatusAndDateRange(VisitorStatus.EXITED, start, end);

        return Map.of(
                "totalVisitorsToday", total,
                "activeVisitors", active,
                "exitedVisitors", exited
        );
    }

    public Page<VisitorResponseDTO> advancedSearch(
            String name,
            String email,
            String phone,
            String staff,
            VisitorStatus status,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            int page,
            int size,
            String sort
    ) {

        String[] sortParts = sort.split(",");
        Sort.Direction direction =
                sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        Sort sorting = Sort.by(direction, sortParts[0]);

        Pageable pageable = PageRequest.of(page, size, sorting);

        return visitorRepository.advancedSearch(
                name,
                email,
                phone,
                staff,
                status,
                fromDate,
                toDate,
                pageable
        ).map(visitorMapper::toResponse);
    }

    public Map<Integer, Long> getTodayHourlyStats() {

        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = LocalDateTime.now();

        List<Object[]> rows =
                visitorRepository.countHourlyVisitorsToday(start, end);

        Map<Integer, Long> result = new LinkedHashMap<>();

        // Ensure all 24 hours exist
        for (int i = 0; i < 24; i++) {
            result.put(i, 0L);
        }

        for (Object[] r : rows) {
            result.put((Integer) r[0], (Long) r[1]);
        }

        return result;
    }


    public Map<Integer, Long> getHourlyStatsByRange(String range) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from;

        switch (range.toLowerCase()) {
            case "today":
                from = now.toLocalDate().atStartOfDay();
                break;
            case "week":
                from = now.minusWeeks(1);
                break;
            case "month":
                from = now.minusMonths(1);
                break;
            case "6months":
                from = now.minusMonths(6);
                break;
            case "year":
                from = now.minusYears(1);
                break;
            default:
                throw new IllegalArgumentException("Invalid range");
        }

        List<Object[]> rows =
                visitorRepository.countHourlyVisitorsBetween(from, now);

        Map<Integer, Long> result = new LinkedHashMap<>();

        // Ensure all 24 hours exist
        for (int i = 0; i < 24; i++) {
            result.put(i, 0L);
        }

        for (Object[] r : rows) {
            result.put((Integer) r[0], (Long) r[1]);
        }

        return result;
    }



}




