package com.aquarium.Naquarium.repository;

import com.aquarium.Naquarium.entity.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // [기능] 특정 카테고리의 글들을 작성일 내림차순(최신순)으로 조회
    @EntityGraph(attributePaths = {"user"})
    List<Post> findByCategoryOrderByCreatedAtDesc(Post.Category category);
}