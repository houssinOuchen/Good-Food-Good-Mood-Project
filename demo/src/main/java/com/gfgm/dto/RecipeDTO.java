package com.gfgm.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class RecipeDTO {
    private Long id;
    private String title;
    private String description;
    private String instructions;
    private String imageUrl;
    private Integer prepTime;
    private Integer cookTime;
    private Integer servings;
    private List<IngredientDTO> ingredients = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String category;
    private boolean isPublished;

    // Simple author info without the recipes list
    private UserSummaryDTO author;
}

