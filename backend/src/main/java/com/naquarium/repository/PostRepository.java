package com.naquarium.repository;

import com.naquarium.entity.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 게시글(후기) 레포지토리
 *
 * 후기 목록 조회 시 작성자(user) 이름이 필요하므로
 * @EntityGraph로 LAZY 로딩 대신 즉시 로딩해 N+1 문제를 방지한다.
 */
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * 카테고리별 게시글 조회 (최신순).
     * @EntityGraph(attributePaths = {"user"}): user를 LEFT JOIN FETCH로 즉시 로딩
     *
     * @param category 조회할 카테고리 (현재 REVIEW만 사용)
     */
    @EntityGraph(attributePaths = {"user"})
    List<Post> findByCategoryOrderByCreatedAtDesc(Post.Category category);

    /** 회원 탈퇴 시 해당 회원의 게시글 목록 조회 (cascade 삭제용) */
    List<Post> findByUser_Id(Long userId);
}
