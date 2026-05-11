package com.naquarium.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT 인증 필터
 *
 * 모든 HTTP 요청에서 Authorization 헤더를 파싱해 JWT를 검증하고,
 * 유효한 경우 SecurityContext에 인증 정보를 등록한다.
 *
 * OncePerRequestFilter 를 상속해 서블릿 포워딩 시 필터가 중복 실행되는 것을 방지한다.
 * SecurityConfig에서 UsernamePasswordAuthenticationFilter 앞에 등록된다.
 */
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);
        if (StringUtils.hasText(token) && jwtProvider.validateToken(token)) {
            String email = jwtProvider.getEmail(token);
            String role = jwtProvider.getRole(token);

            // Spring Security 인증 객체 생성 (비밀번호 자리에 null - JWT에서는 불필요)
            // 역할은 "ROLE_" 접두사를 붙여 Spring Security 권한 규약에 맞춘다.
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }

    /**
     * Authorization 헤더에서 Bearer 토큰을 추출한다.
     * "Bearer " 접두사(7자)를 제거한 순수 토큰 문자열을 반환하며,
     * 헤더가 없거나 형식이 맞지 않으면 null을 반환한다.
     */
    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
