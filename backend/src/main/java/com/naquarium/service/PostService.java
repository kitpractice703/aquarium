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

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviews() {
        return postRepository.findByCategoryOrderByCreatedAtDesc(Post.Category.REVIEW)
                .stream().map(ReviewDto::new).collect(Collectors.toList());
    }

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
