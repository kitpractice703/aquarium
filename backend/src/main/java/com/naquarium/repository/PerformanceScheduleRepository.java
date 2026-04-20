package com.naquarium.repository;

import com.naquarium.entity.PerformanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface PerformanceScheduleRepository extends JpaRepository<PerformanceSchedule, Long> {

    List<PerformanceSchedule> findByProgramId(Long programId);

    List<PerformanceSchedule> findByStartTimeBetweenOrderByStartTimeAsc(LocalDateTime start, LocalDateTime end);

    List<PerformanceSchedule> findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(Long programId, LocalDateTime start, LocalDateTime end);
}
