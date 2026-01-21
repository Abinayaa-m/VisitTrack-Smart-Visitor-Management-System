package com.example.vms.controller;

import com.example.vms.dto.VisitorRequestDTO;
import com.example.vms.dto.VisitorResponseDTO;
import com.example.vms.model.VisitorStatus;
import com.example.vms.service.QrService;
import com.example.vms.service.VisitorService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/visitors")
public class VisitorController {

    @Autowired
    private VisitorService visitorService;

    @Autowired
    private QrService qrService;


    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SECURITY')")
    public VisitorResponseDTO addVisitor(@RequestBody VisitorRequestDTO dto)
    {
        return visitorService.addVisitor(dto);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public List<VisitorResponseDTO> getAllVisitors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return visitorService.getAllVisitors(page, size).getContent();
    }


    @PostMapping("/exit")
    @PreAuthorize("hasAuthority('ROLE_SECURITY')")
    public ResponseEntity<VisitorResponseDTO> exitVisitor(@RequestBody Map<String, Long> request)
    {
        Long visitorId = request.get("visitorId");
        return ResponseEntity.ok(visitorService.exitVisitor(visitorId));
    }



    @GetMapping("/active")
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF','ROLE_ADMIN')")
    public List<VisitorResponseDTO> active(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return visitorService.listActive(page, size).getContent();
    }



    @GetMapping("/overdue/{minutes}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<VisitorResponseDTO> overdue(@PathVariable int minutes) {
        LocalDateTime cutoff = LocalDateTime.now().minus(minutes, ChronoUnit.MINUTES);
        return visitorService.findOverdue(cutoff);
    }


    @GetMapping("/scan")
    public ResponseEntity<VisitorResponseDTO> scanVisitor(@RequestParam String data, Authentication authentication)
    {
        return ResponseEntity.ok(visitorService.scanVisitor(data, authentication));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SECURITY')")
    public List<VisitorResponseDTO> searchVisitors(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return visitorService.search(keyword, page, size).getContent();
    }


    @GetMapping("/filter/today")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY','ROLE_STAFF')")
    public List<VisitorResponseDTO> filterToday(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return visitorService.filterToday(page, size).getContent();
    }


    @GetMapping("/filter/date")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY','ROLE_STAFF')")
    public List<VisitorResponseDTO> filterByDateRange(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        LocalDateTime fromDate = LocalDateTime.parse(from + "T00:00:00");
        LocalDateTime toDate = LocalDateTime.parse(to + "T23:59:59");

        return visitorService.filterByDateRange(fromDate, toDate, page, size).getContent();
    }


    @GetMapping("/filter/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public List<VisitorResponseDTO> filterByStatus(
            @RequestParam VisitorStatus value,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return visitorService.filterByStatus(value, page, size).getContent();
    }


    @GetMapping("/my-visitors")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public Page<VisitorResponseDTO> myVisitors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) VisitorStatus status,
            Authentication authentication
    ) {
        return visitorService.filterByStaff(
                authentication.getName(),
                status,
                page,
                size
        );
    }






    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void exportVisitorsToExcel(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(defaultValue = "latest") String sort,
            HttpServletResponse response
    ) throws IOException {

        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;

        if (from != null && to != null) {
            fromDate = LocalDateTime.parse(from + "T00:00:00");
            toDate = LocalDateTime.parse(to + "T23:59:59");
        }

        visitorService.exportVisitorsToExcel(fromDate, toDate, sort, response);
    }


    @GetMapping("/export/csv")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void exportVisitorsToCSV(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(defaultValue = "latest") String sort,
            HttpServletResponse response
    ) throws IOException {

        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;

        if (from != null && to != null) {
            fromDate = LocalDateTime.parse(from + "T00:00:00");
            toDate = LocalDateTime.parse(to + "T23:59:59");
        }

        visitorService.exportVisitorsToCSV(fromDate, toDate, sort, response);
    }

    @GetMapping("/stats/today")
    @PreAuthorize("hasAuthority('ROLE_SECURITY')")
    public Map<String, Long> getTodayStats() {
        return visitorService.getTodayStats();
    }

    @GetMapping("/advanced-search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public Page<VisitorResponseDTO> advancedSearch(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String staff,
            @RequestParam(required = false) VisitorStatus status,

            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "entryTime,desc") String sort
    ) {

        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;

        try {
            if (from != null && !from.isEmpty()) {
                fromDate = LocalDateTime.parse(from + "T00:00:00");
            }
            if (to != null && !to.isEmpty()) {
                toDate = LocalDateTime.parse(to + "T23:59:59");
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Use yyyy-MM-dd");
        }

        return visitorService.advancedSearch(
                name,
                email,
                phone,
                staff,
                status,
                fromDate,
                toDate,
                page,
                size,
                sort
        );
    }

    @GetMapping("/stats/today-hourly")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public Map<Integer, Long> getTodayHourlyStats() {
        return visitorService.getTodayHourlyStats();
    }

    @GetMapping("/stats/hourly")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SECURITY')")
    public Map<Integer, Long> getHourlyStatsByRange(
            @RequestParam String range
    ) {
        return visitorService.getHourlyStatsByRange(range);
    }




}

