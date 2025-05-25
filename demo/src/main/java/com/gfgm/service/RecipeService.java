package com.gfgm.service;

import com.gfgm.dto.IngredientRequest;
import com.gfgm.dto.RecipeRequest;
import com.gfgm.dto.RecipeDTO;
import com.gfgm.dto.AdminRecipeUpdateRequest;
import com.gfgm.mapper.RecipeMapper;
import com.gfgm.model.Ingredient;
import com.gfgm.model.Recipe;
import com.gfgm.model.RecipeCategory;
import com.gfgm.model.User;
import com.gfgm.repository.IngredientRepository;
import com.gfgm.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final AuthService authService;
    private final String UPLOAD_DIR = "uploads/";
    private final RecipeMapper recipeMapper;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository, RecipeMapper recipeMapper, IngredientRepository ingredientRepository, AuthService authService) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.authService = authService;
        this.recipeMapper = recipeMapper;
    }

    public Page<RecipeDTO> getAllRecipes(Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.findAll(pageable);
        List<RecipeDTO> recipeDTOs = recipeMapper.toDTOList(recipePage.getContent());
        return new PageImpl<>(recipeDTOs, pageable, recipePage.getTotalElements());
    }

    public Optional<RecipeDTO> getRecipeById(Long id) {
        return recipeRepository.findById(id)
                .map(recipeMapper::toDTO);
    }

    // Helper method for internal use that returns the Recipe entity directly
    private Recipe getRecipeEntityById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    // NEW: Admin recipe update method
    @Transactional
    public RecipeDTO adminUpdateRecipe(Long id, AdminRecipeUpdateRequest request) {
        Recipe recipe = getRecipeEntityById(id);

        if (request.getTitle() != null) {
            recipe.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            recipe.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            recipe.setCategory(RecipeCategory.valueOf(request.getCategory()));
        }
        if (request.getPublished() != null) {
            recipe.setPublished(request.getPublished());
        }
        if (request.getInstructions() != null) {
            recipe.setInstructions(request.getInstructions().toString());
        }
        if (request.getPrepTime() != null) {
            recipe.setPrepTime(request.getPrepTime());
        }
        if (request.getCookTime() != null) {
            recipe.setCookTime(request.getCookTime());
        }
        if (request.getServings() != null) {
            recipe.setServings(request.getServings());
        }

        // Update nutrition information
        if (request.getCalories() != null) {
            recipe.setCalories(request.getCalories());
        }
        if (request.getProtein() != null) {
            recipe.setProtein(request.getProtein());
        }
        if (request.getCarbs() != null) {
            recipe.setCarbs(request.getCarbs());
        }
        if (request.getFat() != null) {
            recipe.setFat(request.getFat());
        }
        if (request.getFiber() != null) {
            recipe.setFiber(request.getFiber());
        }
        if (request.getSugar() != null) {
            recipe.setSugar(request.getSugar());
        }

        // Update ingredients if provided
        if (request.getIngredients() != null) {
            ingredientRepository.deleteAllByRecipe(recipe);
            saveIngredients(recipe, request.getIngredients());
        }

        Recipe savedRecipe = recipeRepository.save(recipe);
        return recipeMapper.toDTO(savedRecipe);
    }

    public Page<RecipeDTO> searchRecipes(String query, Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.searchRecipes(query, pageable);
        List<RecipeDTO> recipeDTOs = recipeMapper.toDTOList(recipePage.getContent());
        return new PageImpl<>(recipeDTOs, pageable, recipePage.getTotalElements());
    }

    public Page<Recipe> getUserRecipes(Pageable pageable) {
        return recipeRepository.findAllByUser(authService.getCurrentUser(), pageable);
    }

    @Transactional
    public Recipe createRecipe(RecipeRequest request, MultipartFile image) {
        User currentUser = authService.getCurrentUser();
        Recipe recipe = new Recipe();
        updateRecipeFromRequest(recipe, request);
        recipe.setUser(currentUser);

        if (image != null && !image.isEmpty()) {
            recipe.setImageUrl(saveImage(image));
        }

        Recipe savedRecipe = recipeRepository.save(recipe);
        saveIngredients(savedRecipe, request.getIngredients());
        return savedRecipe;
    }

    @Transactional
    public Recipe updateRecipe(Long id, RecipeRequest request, MultipartFile image) {
        Recipe recipe = getRecipeEntityById(id);
        checkRecipeOwnership(recipe);

        updateRecipeFromRequest(recipe, request);
        if (image != null && !image.isEmpty()) {
            deleteOldImage(recipe.getImageUrl());
            recipe.setImageUrl(saveImage(image));
        }

        ingredientRepository.deleteAllByRecipe(recipe);
        Recipe savedRecipe = recipeRepository.save(recipe);
        saveIngredients(savedRecipe, request.getIngredients());
        return savedRecipe;
    }

    @Transactional
    public void deleteRecipe(Long id) {
        Recipe recipe = getRecipeEntityById(id);
        checkRecipeOwnership(recipe);
        deleteOldImage(recipe.getImageUrl());
        recipeRepository.delete(recipe);
    }

    private void updateRecipeFromRequest(Recipe recipe, RecipeRequest request) {
        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setInstructions(request.getInstructions());
        recipe.setPrepTime(request.getPrepTime());
        recipe.setCookTime(request.getCookTime());
        recipe.setServings(request.getServings());
        recipe.setCategory(request.getCategory());
        recipe.setPublished(request.isPublished());
        
        // Nutrition information
        recipe.setCalories(request.getCalories());
        recipe.setProtein(request.getProtein());
        recipe.setCarbs(request.getCarbs());
        recipe.setFat(request.getFat());
        recipe.setFiber(request.getFiber());
        recipe.setSugar(request.getSugar());
    }

    private void saveIngredients(Recipe recipe, List<IngredientRequest> ingredientRequests) {
        List<Ingredient> ingredients = ingredientRequests.stream()
                .map(req -> {
                    Ingredient ingredient = new Ingredient();
                    ingredient.setName(req.getName());
                    ingredient.setAmount(req.getAmount());
                    ingredient.setUnit(req.getUnit());
                    ingredient.setRecipe(recipe);
                    return ingredient;
                })
                .collect(Collectors.toList());
        ingredientRepository.saveAll(ingredients);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private void deleteOldImage(String imageUrl) {
        if (imageUrl != null) {
            try {
                Path filePath = Paths.get(UPLOAD_DIR + imageUrl);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log error but don't throw
            }
        }
    }

    private void checkRecipeOwnership(Recipe recipe) {
        User currentUser = authService.getCurrentUser();
        if (!recipe.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to modify this recipe");
        }
    }

    public long getTotalRecipes() {
        return recipeRepository.count();
    }

    public long getTotalAiGeneratedRecipes() {
        return recipeRepository.countByGeneratedByAiTrue();
    }

    public Page<Recipe> getAiGeneratedRecipes(Pageable pageable) {
        return recipeRepository.findAllByGeneratedByAiTrue(pageable);
    }

    @Transactional
    public Recipe saveAiGeneratedRecipe(RecipeRequest request) {
        User currentUser = authService.getCurrentUser();
        Recipe recipe = new Recipe();
        updateRecipeFromRequest(recipe, request);
        recipe.setUser(currentUser);
        recipe.setGeneratedByAi(true);

        Recipe savedRecipe = recipeRepository.save(recipe);
        saveIngredients(savedRecipe, request.getIngredients());
        return savedRecipe;
    }
}