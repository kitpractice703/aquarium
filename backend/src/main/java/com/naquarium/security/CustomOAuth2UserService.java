package com.naquarium.security;

import com.naquarium.entity.User;
import com.naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

/**
 * Google OAuth2 사용자 정보 처리 서비스
 *
 * OAuth2 인증 완료 후 Google로부터 받은 사용자 정보를 처리한다.
 * - 기존 회원: 정보 유지 (이름 업데이트 없음)
 * - 신규 회원: 이메일·이름·provider를 저장해 자동 회원가입
 *
 * 최종적으로 SecurityContextHolder에 등록될 OAuth2User 객체를 반환한다.
 * 역할은 Spring Security 레벨에서 "ROLE_USER"로 설정하고,
 * OAuth2SuccessHandler에서 DB 조회를 통해 실제 역할을 재확인한다.
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // OAuth2 제공자 식별 ("google" 등)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        // Google의 경우 "sub" 클레임이 사용자 고유 식별자
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        saveOrUpdate(email, name, registrationId);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                userNameAttributeName
        );
    }

    /**
     * 신규 회원이면 저장(INSERT), 기존 회원이면 그대로 유지(UPDATE 없음).
     * 소셜 로그인의 경우 회원 정보 변경은 마이페이지를 통해 별도 처리한다.
     */
    private User saveOrUpdate(String email, String name, String provider) {
        User user = userRepository.findByEmail(email)
                .map(entity -> entity)
                .orElseGet(() -> User.builder()
                        .email(email)
                        .username(name)
                        .role(User.Role.USER)
                        .provider(provider)
                        .build());

        return userRepository.save(user);
    }
}
