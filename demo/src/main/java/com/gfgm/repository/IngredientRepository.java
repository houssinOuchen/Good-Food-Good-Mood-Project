package com.gfgm.repository;

import com.gfgm.model.Ingredient;
import com.gfgm.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findAllByRecipe(Recipe recipe);
    void deleteAllByRecipe(Recipe recipe);
} 