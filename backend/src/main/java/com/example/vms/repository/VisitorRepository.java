package com.example.vms.repository;

import com.example.vms.model.Visitor;
import com.example.vms.model.VisitorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    /* ---------------- BASIC ---------------- */

    Page<Visitor> findByStatus(VisitorStatus status, Pageable pageable);

    @Query("""
        SELECT v FROM Visitor v
        WHERE v.status = 'ACTIVE'
        AND v.entryTime < :cutoff
    """)
    List<Visitor> findActiveVisitorsBefore(@Param("cutoff") LocalDateTime cutoff);

    @Query("""
    SELECT v FROM Visitor v
    WHERE LOWER(v.staff.user.username) = LOWER(:username)
""")
    Page<Visitor> findByStaffUsername(
            @Param("username") String username,
            Pageable pageable
    );



    /* ---------------- SEARCH ---------------- */

    @Query("""
        SELECT v FROM Visitor v
        WHERE LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(v.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(v.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<Visitor> searchAll(@Param("keyword") String keyword, Pageable pageable);

    /* ---------------- TODAY FILTER (FIXED) ---------------- */
    /* ⚠️ Service MUST pass startOfDay & endOfDay */

    @Query("""
        SELECT v FROM Visitor v
        WHERE v.entryTime BETWEEN :start AND :end
    """)
    Page<Visitor> findTodayVisitors(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    /* ---------------- DATE RANGE ---------------- */

    @Query("""
        SELECT v FROM Visitor v
        WHERE v.entryTime BETWEEN :from AND :to
    """)
    Page<Visitor> findByDateRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable
    );

    @Query("""
        SELECT v FROM Visitor v
        WHERE v.entryTime BETWEEN :from AND :to
        ORDER BY v.entryTime DESC
    """)
    List<Visitor> findByDateRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    /* ---------------- COUNTS ---------------- */

    @Query("""
        SELECT COUNT(v)
        FROM Visitor v
        WHERE v.entryTime BETWEEN :from AND :to
    """)
    long countByDateRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
        SELECT COUNT(v)
        FROM Visitor v
        WHERE v.status = :status
        AND v.entryTime BETWEEN :from AND :to
    """)
    long countByStatusAndDateRange(
            @Param("status") VisitorStatus status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    /* ---------------- DAILY TREND (FIXED) ---------------- */

    @Query("""
        SELECT FUNCTION('DATE', v.entryTime), COUNT(v)
        FROM Visitor v
        WHERE v.entryTime BETWEEN :from AND :to
        GROUP BY FUNCTION('DATE', v.entryTime)
        ORDER BY FUNCTION('DATE', v.entryTime)
    """)
    List<Object[]> groupByDate(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    /* ---------------- PEAK HOURS ---------------- */

    @Query("""
        SELECT FUNCTION('HOUR', v.entryTime), COUNT(v)
        FROM Visitor v
        WHERE v.entryTime BETWEEN :from AND :to
        GROUP BY FUNCTION('HOUR', v.entryTime)
        ORDER BY FUNCTION('HOUR', v.entryTime)
    """)
    List<Object[]> groupByPeakHours(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    /* ---------------- ADVANCED SEARCH ---------------- */

    @Query("""
    SELECT v FROM Visitor v
    JOIN v.staff s
    JOIN s.user u
    WHERE (:name IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%', :name, '%')))
      AND (:email IS NULL OR LOWER(v.email) LIKE LOWER(CONCAT('%', :email, '%')))
      AND (:phone IS NULL OR LOWER(v.phone) LIKE LOWER(CONCAT('%', :phone, '%')))
      AND (:staff IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :staff, '%')))
      AND (:status IS NULL OR v.status = :status)
      AND (:fromDate IS NULL OR v.entryTime >= :fromDate)
      AND (:toDate IS NULL OR v.entryTime <= :toDate)
""")
    Page<Visitor> advancedSearch(
            @Param("name") String name,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("staff") String staff,
            @Param("status") VisitorStatus status,
            @Param("fromDate") LocalDateTime from,
            @Param("toDate") LocalDateTime to,
            Pageable pageable
    );


    /* ---------------- HOURLY STATS ---------------- */

    @Query("""
        SELECT FUNCTION('HOUR', v.entryTime), COUNT(v)
        FROM Visitor v
        WHERE v.entryTime BETWEEN :start AND :end
        GROUP BY FUNCTION('HOUR', v.entryTime)
        ORDER BY FUNCTION('HOUR', v.entryTime)
    """)
    List<Object[]> countHourlyVisitorsToday(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT FUNCTION('HOUR', v.entryTime), COUNT(v)
        FROM Visitor v
        WHERE v.entryTime BETWEEN :from AND :to
        GROUP BY FUNCTION('HOUR', v.entryTime)
        ORDER BY FUNCTION('HOUR', v.entryTime)
    """)
    List<Object[]> countHourlyVisitorsBetween(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );



    @Query("""
    SELECT v FROM Visitor v
    JOIN v.staff s
    JOIN s.user u
    WHERE LOWER(u.username) = LOWER(:username)
      AND v.entryTime BETWEEN :start AND :end
      AND (:status IS NULL OR v.status = :status)
""")
    Page<Visitor> findTodayByStaffAndStatus(
            @Param("username") String username,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") VisitorStatus status,
            Pageable pageable
    );

    // ✅ Today visitors for staff
    @Query("""
    SELECT COUNT(v)
    FROM Visitor v
    WHERE v.staff.id = :staffId
      AND v.entryTime BETWEEN :start AND :end
""")
    long countTodayVisitorsByStaff(
            @Param("staffId") Long staffId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // ✅ Active visitors for staff
    long countByStaff_IdAndStatus(Long staffId, VisitorStatus status);

    @Query("""
    SELECT v
    FROM Visitor v
    JOIN v.staff s
    JOIN s.user u
    WHERE LOWER(u.username) = LOWER(:username)
      AND v.status = com.example.vms.model.VisitorStatus.ACTIVE
    ORDER BY v.entryTime ASC
""")
    List<Visitor> findActiveVisitorsByStaff(
            @Param("username") String username
    );




}


