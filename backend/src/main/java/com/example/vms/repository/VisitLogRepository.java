package com.example.vms.repository;

import com.example.vms.model.VisitLog;
import com.example.vms.model.VisitorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface VisitLogRepository extends JpaRepository<VisitLog, Long> {


}

