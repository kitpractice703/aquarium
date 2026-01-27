package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("=== 로그인 시도: " + email + " ==="); // [로그 1]

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println(">>> 에러: DB에서 유저를 찾을 수 없음"); // [로그 2]
                    return new UsernameNotFoundException("유저를 찾을 수 없습니다: " + email);
                });

        System.out.println(">>> DB 조회 성공: " + user.getUsername());
        System.out.println(">>> DB 암호(Hash): " + user.getPassword()); // [로그 3]
        System.out.println(">>> 유저 권한: " + user.getRole()); // [로그 4]

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}