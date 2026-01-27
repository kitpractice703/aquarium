package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.Exhibition;
import com.aquarium.Naquarium.entity.ProgramSchedule;
import com.aquarium.Naquarium.repository.ExhibitionRepository;
import com.aquarium.Naquarium.repository.ProgramScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AquariumService {

    private final ExhibitionRepository exhibitionRepository;
    private final ProgramScheduleRepository programScheduleRepository;

    // 1. 모든 테마 전시 목록 가져오기
    @Transactional(readOnly = true)
    public List<Exhibition> getAllExhibitions() {
        return exhibitionRepository.findAll();
    }

    // 2. 모든 프로그램 일정 가져오기 (공연 정보 포함)
    @Transactional(readOnly = true)
    public List<ProgramSchedule> getAllSchedules() {
        return programScheduleRepository.findAll();
    }
}