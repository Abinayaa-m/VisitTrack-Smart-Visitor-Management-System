package com.example.vms.scheduler;

import com.example.vms.model.VisitLog;
import com.example.vms.model.Visitor;
import com.example.vms.model.VisitorStatus;
import com.example.vms.repository.VisitLogRepository;
import com.example.vms.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.util.List;


@Component
public class OverdueScheduler {


    @Autowired
    private VisitorRepository visitorRepository;


    @Autowired
    private VisitLogRepository visitLogRepository;


    // runs every 30 minutes
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void markOverdue() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(3); // example: 3 hours stay allowed
        List<Visitor> overdue = visitorRepository.findActiveVisitorsBefore(cutoff);
        for (Visitor v : overdue) {
            v.setStatus(VisitorStatus.OVERDUE);
            visitorRepository.save(v);
            VisitLog log = VisitLog.builder().visitorId(v.getId()).action("OVERDUE_MARKED").timestamp(LocalDateTime.now()).build();
            visitLogRepository.save(log);
        }
    }
}
