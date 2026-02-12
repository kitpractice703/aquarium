package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * 일반 로그인 사용자 인증 서비스
 * - Spring Security의 UserDetailsService 구현체
 * - 이메일(email)을 username으로 사용하여 DB에서 사용자 조회
 * - AuthenticationManager가 내부적으로 호출
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 이메일 기반 사용자 조회 및 UserDetails 변환
     * - Spring Security가 로그인 시 자동 호출
     * - 반환된 UserDetails의 password와 입력 비밀번호를 PasswordEncoder로 비교
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}