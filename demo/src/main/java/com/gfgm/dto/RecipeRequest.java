package com.gfgm.dto;

import com.gfgm.model.RecipeCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class RecipeRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Instructions are required")
    private String instructions;
    
    @NotNull(message = "Preparation time is required")
    @Positive(message = "Preparation time must be positive")
    private Integer prepTime;
    
    @NotNull(message = "Cooking time is required")
    @Positive(message = "Cooking time must be positive")
    private Integer cookTime;
    
    @NotNull(message = "Number of servings is required")
    @Positive(message = "Number of servings must be positive")
    private Integer servings;
    
    @NotNull(message = "Category is required")
    private RecipeCategory category;
    
    @NotEmpty(message = "At least one ingredient is required")
    @Valid
    private List<IngredientRequest> ingredients;
    
    private boolean isPublished = true;
}

