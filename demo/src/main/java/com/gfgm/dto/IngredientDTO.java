package com.gfgm.dto;

import lombok.Data;

@Data
public class IngredientDTO {
    private Long id;
    private String name;
    private Double amount;
    private String unit;
}
