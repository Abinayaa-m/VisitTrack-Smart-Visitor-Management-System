package com.example.vms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDTO {

    private Summary summary;
    private List<DailyTrend> dailyTrend;
    private List<StatusDistribution> statusDistribution;
    private List<PeakHours> peakHours;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Summary {
        private long total;
        private long active;
        private long exited;
        private long overstayed;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class DailyTrend {
        private String date;
        private long count;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class StatusDistribution {
        private String status;
        private long count;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class PeakHours {
        private int hour;
        private long count;
    }
}

