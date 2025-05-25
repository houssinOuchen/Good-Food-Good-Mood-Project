package com.gfgm.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminRecipeUpdateRequest {
    private String title;
    private String description;
    private String category;
    private Boolean published;
    private List<IngredientRequest> ingredients;
    private List<String> instructions;
    private Integer prepTime;
    private Integer cookTime;
    private Integer servings;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;
    private Double sugar;
}
