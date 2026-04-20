package com.naquarium.repository;

import com.naquarium.entity.ExperienceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ExperienceScheduleRepository extends JpaRepository<ExperienceSchedule, Long> {

    List<ExperienceSchedule> findByProgramId(Long programId);

    List<ExperienceSchedule> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    List<ExperienceSchedule> findByProgramIdAndStartTimeBetweenOrderByStartTimeAsc(Long programId, LocalDateTime start, LocalDateTime end);
}
