package com.gfgm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class IngredientRequest {
    @NotBlank(message = "Ingredient name is required")
    private String name;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    @NotBlank(message = "Unit is required")
    private String unit;
}
