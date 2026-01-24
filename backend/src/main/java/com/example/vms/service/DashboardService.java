package com.example.vms.service;

import com.example.vms.dto.DashboardDTO;
import com.example.vms.model.VisitorStatus;
import com.example.vms.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private VisitorRepository visitorRepository;

    public DashboardDTO getDashboardData(String range) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from;

        switch (range.toLowerCase()) {
            case "today" -> from = LocalDate.now().atStartOfDay();
            case "week" -> from = now.minusDays(7);
            case "month" -> from = now.minusMonths(1);
            case "6months" -> from = now.minusMonths(6);
            case "year" -> from = now.minusYears(1);
            default -> throw new RuntimeException("Invalid range! Allowed: today, week, month, 6months, year");
        }

        // Summary
        long total = visitorRepository.countByDateRange(from, now);
        long active = visitorRepository.countByStatusAndDateRange(VisitorStatus.ACTIVE, from, now);
        long exited = visitorRepository.countByStatusAndDateRange(VisitorStatus.EXITED, from, now);

        long overstayed = visitorRepository.findActiveVisitorsBefore(now.minusHours(3)).size();

        // Daily Trend
        List<DashboardDTO.DailyTrend> dailyTrend =
                visitorRepository.groupByDate(from, now).stream()
                        .map(obj -> new DashboardDTO.DailyTrend(obj[0].toString(), (Long) obj[1]))
                        .collect(Collectors.toList());

        // Status Distribution
        List<DashboardDTO.StatusDistribution> statusDistribution = List.of(
                new DashboardDTO.StatusDistribution("ACTIVE", active),
                new DashboardDTO.StatusDistribution("EXITED", exited)
        );

        // Peak Hours
        List<DashboardDTO.PeakHours> peakHours =
                visitorRepository.groupByPeakHours(from, now).stream()
                        .map(obj -> new DashboardDTO.PeakHours((Integer) obj[0], (Long) obj[1]))
                        .collect(Collectors.toList());

        return DashboardDTO.builder()
                .summary(new DashboardDTO.Summary(total, active, exited, overstayed))
                .dailyTrend(dailyTrend)
                .statusDistribution(statusDistribution)
                .peakHours(peakHours)
                .build();
    }
}

