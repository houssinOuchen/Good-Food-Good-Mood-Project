package com.gfgm.controller;

import com.gfgm.dto.RecipeDTO;
import com.gfgm.dto.RecipeRequest;
import com.gfgm.model.Recipe;
import com.gfgm.mapper.RecipeMapper;
import com.gfgm.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(
            @Valid @RequestPart("recipe") RecipeRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(recipeService.createRecipe(request, image));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(
            @PathVariable Long id,
            @Valid @RequestPart("recipe") RecipeRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, request, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipe(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<RecipeDTO>> getAllRecipes(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<RecipeDTO> recipes = recipeService.getAllRecipes(pageable);
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/my-recipes")
    public ResponseEntity<Page<RecipeDTO>> getUserRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Recipe> recipePage = recipeService.getUserRecipes(pageable);
        Page<RecipeDTO> dtoPage = recipePage.map(recipeMapper::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecipeDTO>> searchRecipes(
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeDTO> recipes = recipeService.searchRecipes(query, pageable);
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/ai")
    public ResponseEntity<Page<RecipeDTO>> getAiGeneratedRecipes(
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Recipe> recipePage = recipeService.getAiGeneratedRecipes(pageable);
        Page<RecipeDTO> dtoPage = recipePage.map(recipeMapper::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @PostMapping("/ai/save")
    public ResponseEntity<RecipeDTO> saveAiGeneratedRecipe(@RequestBody RecipeRequest request) {
        Recipe recipe = recipeService.saveAiGeneratedRecipe(request);
        return ResponseEntity.ok(recipeMapper.toDTO(recipe));
    }
}