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

/**
 * 관리자 전용 서비스
 *
 * 대시보드·스케줄·예약·회원·리뷰·프로그램·전시 관리 기능을 제공한다.
 * 클래스 레벨 @Transactional을 적용하고, 읽기 전용 메서드는
 * @Transactional(readOnly = true)를 별도 선언해 성능을 최적화한다.
 */
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

    // ── 대시보드 ────────────────────────────────────────────────────────────────

    /**
     * 관리자 대시보드 통계 집계.
     * - 오늘 예약 건수: visitDate 기준
     * - 이번 주 스케줄 수: 당일 월요일 ~ 일요일 범위의 공연·체험 스케줄 합산
     * - 최근 리뷰: 최신 5건
     */
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        String today = LocalDate.now().toString();
        long todayReservations = reservationRepository.countByVisitDate(today);

        // 이번 주 월요일 00:00 ~ 일요일 23:59 범위 계산
        LocalDateTime weekStart = LocalDate.now().with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime weekEnd = LocalDate.now().with(DayOfWeek.SUNDAY).atTime(23, 59, 59);
        long weekSchedules = performanceScheduleRepository.countByStartTimeBetween(weekStart, weekEnd)
                + experienceScheduleRepository.countByStartTimeBetween(weekStart, weekEnd);

        long totalUsers = userRepository.count();

        List<AdminReviewDto> recentReviews = postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream().limit(5).map(AdminReviewDto::new).collect(Collectors.toList());

        return new DashboardStatsDto(todayReservations, weekSchedules, totalUsers, recentReviews);
    }

    // ── 스케줄 ──────────────────────────────────────────────────────────────────

    /**
     * 스케줄 목록 조회.
     * 공연·체험 스케줄을 합쳐 시작 시간 오름차순으로 정렬한다.
     *
     * @param date 날짜 필터 (null이면 전체 조회)
     */
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

    /**
     * 스케줄 생성.
     * 프로그램 타입(PERFORMANCE / EXPERIENCE)에 따라 저장 대상 테이블을 분기한다.
     *
     * @param req 프로그램 ID·장소·시작 시각 요청 (startTime: "yyyy-MM-dd HH:mm" 형식)
     */
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

    /**
     * 스케줄 수정.
     *
     * @param type "PERFORMANCE" | "EXPERIENCE" - 수정 대상 테이블 식별
     */
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

    /** 스케줄 삭제 */
    public void deleteSchedule(Long id, String type) {
        if ("PERFORMANCE".equals(type)) {
            performanceScheduleRepository.deleteById(id);
        } else {
            experienceScheduleRepository.deleteById(id);
        }
    }

    /**
     * 스케줄 운영 중단·재개 토글.
     * 예약 데이터를 유지한 채로 isClosed 플래그만 반전한다.
     */
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

    // ── 예약 ────────────────────────────────────────────────────────────────────

    /**
     * 전체 예약 목록 조회 (관리자용).
     * fetch join으로 연관 엔티티를 한 번에 로드한 뒤 메모리에서 필터링한다.
     * 데이터 규모가 소규모인 현재 구조에 적합하며, 대용량 시 Querydsl 도입을 권장한다.
     *
     * @param date   YYYY-MM-DD 날짜 필터 (null·빈 문자열이면 전체)
     * @param status "CONFIRMED" | "CANCELLED" 상태 필터
     * @param search 이메일 또는 이름 검색어
     */
    @Transactional(readOnly = true)
    public List<AdminReservationDto> getAllReservations(String date, String status, String search) {
        return reservationRepository.findAllForAdmin().stream()
                .filter(r -> date == null || date.isBlank() || date.equals(r.getVisitDate()))
                .filter(r -> status == null || status.isBlank()
                        || (r.getStatus() != null && r.getStatus().name().equals(status)))
                .filter(r -> search == null || search.isBlank() || r.getUser() == null
                        || r.getUser().getEmail().contains(search) || r.getUser().getUsername().contains(search))
                .map(AdminReservationDto::new).collect(Collectors.toList());
    }

    /**
     * 예약 취소 (상태를 CANCELLED로 변경).
     * 실제 데이터를 삭제하지 않고 상태만 변경해 예약 이력을 보존한다.
     */
    public void cancelReservation(Long id) {
        Reservation r = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        r.setStatus(Reservation.ReservationStatus.CANCELLED);
    }

    // ── 회원 ────────────────────────────────────────────────────────────────────

    /**
     * 전체 회원 목록 조회.
     *
     * @param search 이메일 또는 이름 검색어 (null·빈 문자열이면 전체 반환)
     */
    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers(String search) {
        return userRepository.findAll().stream().filter(u -> search == null || search.isBlank()
                || u.getEmail().contains(search) || u.getUsername().contains(search)).map(AdminUserDto::new)
                .collect(Collectors.toList());
    }

    /**
     * 회원 역할 변경 (USER ↔ ADMIN).
     *
     * @param role "USER" | "ADMIN"
     */
    public void changeUserRole(Long id, String role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        user.updateRole(User.Role.valueOf(role));
    }

    /**
     * 회원 강제 탈퇴.
     * 외래 키 제약을 위해 연관된 게시글·예약을 먼저 삭제한 뒤 회원을 삭제한다.
     */
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        postRepository.deleteAll(postRepository.findByUser_Id(id));
        reservationRepository.deleteAll(reservationRepository.findByUser_Id(id));
        userRepository.delete(user);
    }

    // ── 리뷰 ────────────────────────────────────────────────────────────────────

    /** 전체 후기 목록 조회 (최신순) */
    @Transactional(readOnly = true)
    public List<AdminReviewDto> getAllReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW).stream().map(AdminReviewDto::new)
                .collect(Collectors.toList());
    }

    /** 후기 삭제 */
    public void deleteReview(Long id) {
        postRepository.deleteById(id);
    }

    // ── 프로그램 ─────────────────────────────────────────────────────────────────

    /** 전체 프로그램 목록 조회 */
    @Transactional(readOnly = true)
    public List<ProgramDto> getAllPrograms() {
        return programRepository.findAll().stream().map(ProgramDto::new).collect(Collectors.toList());
    }

    /** 프로그램 생성 */
    public void createProgram(AdminProgramRequest req) {
        Program p = new Program();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setType(Program.ProgramType.valueOf(req.getType()));
        p.setPrice(req.getPrice());
        programRepository.save(p);
    }

    /** 프로그램 수정 */
    public void updateProgram(Long id, AdminProgramRequest req) {
        Program p = programRepository.findById(id).orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setType(Program.ProgramType.valueOf(req.getType()));
        p.setPrice(req.getPrice());
    }

    /** 프로그램 삭제 */
    public void deleteProgram(Long id) {
        programRepository.deleteById(id);
    }

    // ── 전시 ────────────────────────────────────────────────────────────────────

    /** 전체 전시 목록 조회 */
    @Transactional(readOnly = true)
    public List<ExhibitionDto> getAllExhibitions() {
        return exhibitionRepository.findAll().stream().map(ExhibitionDto::new).collect(Collectors.toList());
    }

    /** 전시 생성 */
    public void createExhibition(AdminExhibitionRequest req) {
        Exhibition e = new Exhibition();
        e.setTitle(req.getTitle());
        e.setSubTitle(req.getSubTitle());
        e.setDescription(req.getDescription());
        e.setThemeColor(req.getThemeColor());
        exhibitionRepository.save(e);
    }

    /** 전시 수정 */
    public void updateExhibition(Long id, AdminExhibitionRequest req) {
        Exhibition e = exhibitionRepository.findById(id).orElseThrow(() -> new RuntimeException("전시를 찾을 수 없습니다."));
        e.setTitle(req.getTitle());
        e.setSubTitle(req.getSubTitle());
        e.setDescription(req.getDescription());
        e.setThemeColor(req.getThemeColor());
    }

    /** 전시 삭제 */
    public void deleteExhibition(Long id) {
        exhibitionRepository.deleteById(id);
    }
}
