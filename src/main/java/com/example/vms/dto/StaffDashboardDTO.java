package com.example.vms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StaffDashboardDTO {
    private long todayVisitors;
    private long activeVisitors;

}


