package com.naquarium.service;

import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Security 이메일·비밀번호 인증을 위한 UserDetailsService 구현체
 *
 * AuthenticationManager가 로그인 시 호출하며, 이메일로 사용자를 조회해
 * Spring Security의 UserDetails 형식으로 변환해 반환한다.
 *
 * 역할 이름은 Spring Security 규약에 따라 "ROLE_" 접두사가 자동으로 붙는다
 * (roles() 메서드 내부에서 처리됨).
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 이메일(username)로 사용자를 조회해 UserDetails를 반환한다.
     *
     * @param email 로그인 요청의 이메일 (Spring Security에서 username으로 처리)
     * @throws UsernameNotFoundException 해당 이메일의 사용자가 없을 경우
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
