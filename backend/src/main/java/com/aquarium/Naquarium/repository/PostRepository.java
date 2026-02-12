package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/** 게시글 데이터 접근 레포지토리 */
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * 카테고리별 게시글 목록 조회 (최신순)
     * - @EntityGraph: user를 즉시 로딩하여 N+1 문제 방지
     */
    @EntityGraph(attributePaths = {"user"})
    List<Post> findByCategoryOrderByCreatedAtDesc(Post.Category category);
}