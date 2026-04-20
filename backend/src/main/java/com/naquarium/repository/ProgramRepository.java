package com.naquarium.repository;

import com.naquarium.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByType(Program.ProgramType type);
}
