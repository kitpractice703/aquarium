package com.naquarium.service;

import com.naquarium.dto.ReviewDto;
import com.naquarium.entity.Post;
import com.naquarium.entity.User;
import com.naquarium.repository.PostRepository;
import com.naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 게시글(후기) 서비스
 *
 * 현재는 후기(REVIEW) 카테고리만 사용한다.
 * 후기 목록 조회는 공개 API로, 후기 작성은 로그인이 필요하다.
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * 전체 후기 목록 조회 (최신순).
     * @EntityGraph로 user를 즉시 로딩해 작성자 이름 조회 시 N+1을 방지한다.
     */
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream().map(ReviewDto::new).collect(Collectors.toList());
    }

    /**
     * 후기 작성 (로그인 필요).
     *
     * @param email   현재 로그인 사용자 이메일
     * @param title   후기 제목
     * @param content 후기 본문
     * @param rating  평점 (1.0 ~ 5.0)
     */
    @Transactional
    public void createReview(String email, String title, String content, Double rating) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보 없음"));
        Post post = Post.builder()
                .user(user)
                .title(title)
                .content(content)
                .rating(rating)
                .category(Post.Category.REVIEW)
                .build();
        postRepository.save(post);
    }
}
