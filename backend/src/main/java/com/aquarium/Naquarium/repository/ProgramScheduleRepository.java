package com.aquarium.Naquarium.repository;
import com.aquarium.Naquarium.entity.ProgramSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProgramScheduleRepository extends JpaRepository<ProgramSchedule, Long> {
    // 특정 프로그램의 일정만 가져오기
    List<ProgramSchedule> findByProgramId(Long programId);
}