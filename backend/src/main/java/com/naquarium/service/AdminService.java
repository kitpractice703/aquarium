package com.naquarium.service;

import com.naquarium.dto.*;
import com.naquarium.entity.*;
import com.naquarium.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ExperienceScheduleRepository experienceScheduleRepository;
    private final ProgramRepository programRepository;
    private final PostRepository postRepository;
    private final ExhibitionRepository exhibitionRepository;

    // ── Dashboard ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        String today = LocalDate.now().toString();
        long todayReservations = reservationRepository.countByVisitDate(today);

        LocalDateTime weekStart = LocalDate.now().with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime weekEnd = LocalDate.now().with(DayOfWeek.SUNDAY).atTime(23, 59, 59);
        long weekSchedules = performanceScheduleRepository.countByStartTimeBetween(weekStart, weekEnd)
                + experienceScheduleRepository.countByStartTimeBetween(weekStart, weekEnd);

        long totalUsers = userRepository.count();

        List<AdminReviewDto> recentReviews = postRepository
                .findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream().limit(5).map(AdminReviewDto::new).collect(Collectors.toList());

        return new DashboardStatsDto(todayReservations, weekSchedules, totalUsers, recentReviews);
    }

    // ── Schedules ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AdminScheduleDto> getAllSchedules(LocalDate date) {
        List<AdminScheduleDto> result = new ArrayList<>();
        if (date != null) {
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(23, 59, 59);
            performanceScheduleRepository.findByStartTimeBetweenOrderByStartTimeAsc(start, end)
                    .forEach(s -> result.add(new AdminScheduleDto(s)));
            experienceScheduleRepository.findByStartTimeBetween(start, end)
                    .forEach(s -> result.add(new AdminScheduleDto(s)));
        } else {
            performanceScheduleRepository.findAll().forEach(s -> result.add(new AdminScheduleDto(s)));
            experienceScheduleRepository.findAll().forEach(s -> result.add(new AdminScheduleDto(s)));
        }
        result.sort(Comparator.comparing(AdminScheduleDto::getStartTime));
        return result;
    }

    public void createSchedule(AdminScheduleRequest req) {
        Program program = programRepository.findById(req.getProgramId())
                .orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));
        LocalDateTime startTime = LocalDateTime.parse(req.getStartTime(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        if (program.getType() == Program.ProgramType.PERFORMANCE) {
            PerformanceSchedule s = new PerformanceSchedule();
            s.setProgram(program);
            s.setLocation(req.getLocation());
            s.setStartTime(startTime);
            performanceScheduleRepository.save(s);
        } else {
            ExperienceSchedule s = new ExperienceSchedule();
            s.setProgram(program);
            s.setLocation(req.getLocation());
            s.setStartTime(startTime);
            experienceScheduleRepository.save(s);
        }
    }

    public void updateSchedule(Long id, String type, AdminScheduleRequest req) {
        LocalDateTime startTime = LocalDateTime.parse(req.getStartTime(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        if ("PERFORMANCE".equals(type)) {
            PerformanceSchedule s = performanceScheduleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
            s.setLocation(req.getLocation());
            s.setStartTime(startTime);
        } else {
            ExperienceSchedule s = experienceScheduleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
            s.setLocation(req.getLocation());
            s.setStartTime(startTime);
        }
    }

    public void deleteSchedule(Long id, String type) {
        if ("PERFORMANCE".equals(type)) {
            performanceScheduleRepository.deleteById(id);
        } else {
            experienceScheduleRepository.deleteById(id);
        }
    }

    public void toggleSchedule(Long id, String type) {
        if ("PERFORMANCE".equals(type)) {
            PerformanceSchedule s = performanceScheduleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
            s.setClosed(!s.isClosed());
        } else {
            ExperienceSchedule s = experienceScheduleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
            s.setClosed(!s.isClosed());
        }
    }

    // ── Reservations ───────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AdminReservationDto> getAllReservations(String date, String status, String search) {
        return reservationRepository.findAllForAdmin().stream()
                .filter(r -> date == null || date.isBlank() || date.equals(r.getVisitDate()))
                .filter(r -> status == null || status.isBlank()
                        || (r.getStatus() != null && r.getStatus().name().equals(status)))
                .filter(r -> search == null || search.isBlank() || r.getUser() == null
                        || r.getUser().getEmail().contains(search)
                        || r.getUser().getUsername().contains(search))
                .map(AdminReservationDto::new)
                .collect(Collectors.toList());
    }

    public void cancelReservation(Long id) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        r.setStatus(Reservation.ReservationStatus.CANCELLED);
    }

    // ── Users ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers(String search) {
        return userRepository.findAll().stream()
                .filter(u -> search == null || search.isBlank()
                        || u.getEmail().contains(search)
                        || u.getUsername().contains(search))
                .map(AdminUserDto::new)
                .collect(Collectors.toList());
    }

    public void changeUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        user.updateRole(User.Role.valueOf(role));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        postRepository.deleteAll(postRepository.findByUser_Id(id));
        reservationRepository.deleteAll(reservationRepository.findByUser_Id(id));
        userRepository.delete(user);
    }

    // ── Reviews ────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AdminReviewDto> getAllReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream().map(AdminReviewDto::new).collect(Collectors.toList());
    }

    public void deleteReview(Long id) {
        postRepository.deleteById(id);
    }

    // ── Programs ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ProgramDto> getAllPrograms() {
        return programRepository.findAll().stream().map(ProgramDto::new).collect(Collectors.toList());
    }

    public void createProgram(AdminProgramRequest req) {
        Program p = new Program();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setType(Program.ProgramType.valueOf(req.getType()));
        p.setPrice(req.getPrice());
        programRepository.save(p);
    }

    public void updateProgram(Long id, AdminProgramRequest req) {
        Program p = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setType(Program.ProgramType.valueOf(req.getType()));
        p.setPrice(req.getPrice());
    }

    public void deleteProgram(Long id) {
        programRepository.deleteById(id);
    }

    // ── Exhibitions ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ExhibitionDto> getAllExhibitions() {
        return exhibitionRepository.findAll().stream().map(ExhibitionDto::new).collect(Collectors.toList());
    }

    public void createExhibition(AdminExhibitionRequest req) {
        Exhibition e = new Exhibition();
        e.setTitle(req.getTitle());
        e.setSubTitle(req.getSubTitle());
        e.setDescription(req.getDescription());
        e.setThemeColor(req.getThemeColor());
        exhibitionRepository.save(e);
    }

    public void updateExhibition(Long id, AdminExhibitionRequest req) {
        Exhibition e = exhibitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("전시를 찾을 수 없습니다."));
        e.setTitle(req.getTitle());
        e.setSubTitle(req.getSubTitle());
        e.setDescription(req.getDescription());
        e.setThemeColor(req.getThemeColor());
    }

    public void deleteExhibition(Long id) {
        exhibitionRepository.deleteById(id);
    }
}
