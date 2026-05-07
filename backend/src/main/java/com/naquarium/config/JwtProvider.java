package com.naquarium.config;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰 생성·파싱·검증 컴포넌트
 *
 * 서명 알고리즘: HMAC-SHA256 (HS256)
 * 서명 키: 환경변수(jwt.secret)에서 주입받아 HMAC 키로 변환
 * 만료 시간: 환경변수(jwt.expiration)로 관리 (단위: ms)
 *
 * 토큰 페이로드 구조:
 *   sub  = 사용자 이메일 (식별자)
 *   role = USER | ADMIN (권한)
 *   iat  = 발급 시각
 *   exp  = 만료 시각
 */
@Component
public class JwtProvider {

    private final SecretKey key;
    private final long expiration;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    /**
     * JWT 생성.
     * 이메일을 subject로, 역할을 커스텀 클레임으로 포함한다.
     *
     * @param email 사용자 이메일 (subject)
     * @param role  사용자 권한 ("USER" | "ADMIN")
     * @return 서명된 JWT 문자열
     */
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 토큰에서 이메일(subject) 추출.
     *
     * @param token 검증이 완료된 JWT
     * @return 사용자 이메일
     */
    public String getEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    /**
     * 토큰에서 역할 클레임 추출.
     * role 클레임이 없는 경우 "USER"를 기본값으로 반환한다.
     *
     * @param token 검증이 완료된 JWT
     * @return 사용자 권한 문자열
     */
    public String getRole(String token) {
        Object role = Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role");
        return role != null ? role.toString() : "USER";
    }

    /**
     * 토큰 유효성 검증.
     * 서명 불일치, 만료, 형식 오류를 모두 JwtException으로 포괄 처리한다.
     *
     * @param token 검증할 JWT 문자열
     * @return 유효하면 true, 만료·변조·형식 오류면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
