package com.gfgm.mapper;

import com.gfgm.dto.IngredientDTO;
import com.gfgm.dto.RecipeDTO;
import com.gfgm.dto.UserSummaryDTO;
import com.gfgm.model.Ingredient;
import com.gfgm.model.Recipe;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RecipeMapper {

    public RecipeDTO toDTO(Recipe recipe) {
        if (recipe == null) {
            return null;
        }

        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setDescription(recipe.getDescription());
        dto.setInstructions(recipe.getInstructions());
        dto.setImageUrl(recipe.getImageUrl());
        dto.setPrepTime(recipe.getPrepTime());
        dto.setCookTime(recipe.getCookTime());
        dto.setServings(recipe.getServings());
        dto.setCreatedAt(recipe.getCreatedAt());
        dto.setUpdatedAt(recipe.getUpdatedAt());
        dto.setCategory(recipe.getCategory() != null ? recipe.getCategory().name() : null);
        dto.setPublished(recipe.isPublished());

        // Convert ingredients
        if (recipe.getIngredients() != null) {
            List<IngredientDTO> ingredientDTOs = recipe.getIngredients().stream()
                    .map(this::toIngredientDTO)
                    .collect(Collectors.toList());
            dto.setIngredients(ingredientDTOs);
        }

        // Add basic user info without the recipes list to avoid cycles
        if (recipe.getUser() != null) {
            UserSummaryDTO userDTO = new UserSummaryDTO();
            userDTO.setId(recipe.getUser().getId());
            userDTO.setUsername(recipe.getUser().getUsername());
            userDTO.setFirstName(recipe.getUser().getFirstName());
            userDTO.setLastName(recipe.getUser().getLastName());
            userDTO.setProfilePicture(recipe.getUser().getProfilePicture());
            dto.setAuthor(userDTO);
        }

        return dto;
    }

    public IngredientDTO toIngredientDTO(Ingredient ingredient) {
        if (ingredient == null) {
            return null;
        }

        IngredientDTO dto = new IngredientDTO();
        dto.setId(ingredient.getId());
        dto.setName(ingredient.getName());
        dto.setAmount(ingredient.getAmount());
        dto.setUnit(ingredient.getUnit());
        return dto;
    }

    public List<RecipeDTO> toDTOList(List<Recipe> recipes) {
        if (recipes == null) {
            return List.of();
        }
        return recipes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}