package com.aquarium.Naquarium.service;

import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.UserRepository;
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
 * Google OAuth2 소셜 로그인 사용자 처리 서비스
 * - Google 인증 후 사용자 정보(이메일, 이름)를 DB에 저장/갱신
 * - 신규 사용자: 자동 회원가입 (provider="google", password=null)
 * - 기존 사용자: 기존 정보 유지
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    /**
     * OAuth2 인증 성공 후 호출되는 메서드
     * - Google에서 받은 사용자 정보(email, name)를 추출하여 DB에 저장/갱신
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // OAuth2 제공자 식별 (google, naver 등)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // DB에 사용자 저장 또는 기존 사용자 조회
        saveOrUpdate(email, name, registrationId);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                userNameAttributeName
        );
    }

    /**
     * 사용자 저장 또는 조회
     * - 이메일로 기존 사용자 존재 여부 확인
     * - 미존재 시 신규 생성 (소셜 회원가입)
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