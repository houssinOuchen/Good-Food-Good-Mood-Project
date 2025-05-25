package com.gfgm.repository;

import com.gfgm.model.Recipe;
import com.gfgm.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Page<Recipe> findAllByIsPublishedTrue(Pageable pageable);
    Page<Recipe> findAllByUser(User user, Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE " +
           "r.isPublished = true AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Recipe> searchRecipes(@Param("query") String query, Pageable pageable);
    
    List<Recipe> findTop5ByUserOrderByCreatedAtDesc(User user);
    
    long countByGeneratedByAiTrue();
    
    Page<Recipe> findAllByGeneratedByAiTrue(Pageable pageable);
} 