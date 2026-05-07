package com.naquarium.config;

import com.naquarium.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Google OAuth2 로그인 성공 핸들러
 *
 * OAuth2 인증 완료 후 호출되며, JWT를 발급해 프론트엔드로 전달한다.
 *
 * 토큰 전달 방식: 쿼리스트링 (?token=...)으로 리다이렉트
 *   - 프론트엔드(AuthContext)가 URL 파라미터에서 토큰을 추출해 localStorage에 저장
 *   - 저장 후 replaceState로 토큰을 URL에서 제거해 브라우저 히스토리에 남지 않게 처리
 *
 * 리다이렉트 대상 URL은 환경변수(oauth2.success-url)로 관리해 dev/prod를 분리한다.
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Value("${oauth2.success-url}")
    private String successUrl;

    /**
     * OAuth2 인증 성공 시 JWT를 생성하고 프론트엔드로 리다이렉트한다.
     * DB에서 실제 역할(ADMIN 포함)을 조회해 토큰에 포함한다.
     * 사용자가 DB에 없으면 "USER"를 기본 역할로 사용한다.
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        // DB에 저장된 실제 역할을 조회 (CustomOAuth2UserService에서 upsert된 데이터)
        String role = userRepository.findByEmail(email)
                .map(u -> u.getRole() != null ? u.getRole().name() : "USER")
                .orElse("USER");

        String token = jwtProvider.generateToken(email, role);
        getRedirectStrategy().sendRedirect(request, response, successUrl + "?token=" + token);
    }
}
