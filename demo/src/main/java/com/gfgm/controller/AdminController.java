package com.gfgm.controller;

import com.gfgm.dto.*;
import com.gfgm.model.Role;
import com.gfgm.model.User;
import com.gfgm.service.RecipeService;
import com.gfgm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getTotalUsers());
        stats.put("totalRecipes", recipeService.getTotalRecipes());
        stats.put("aiGeneratedRecipes", recipeService.getTotalAiGeneratedRecipes());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getUsers() {
        return ResponseEntity.ok(userService.getRecentUsers(10));
    }

    @GetMapping("/recipes")
    public ResponseEntity<Page<RecipeDTO>> getRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(recipeService.getAllRecipes(PageRequest.of(page, size)));
    }

    // Updated: Admin user update endpoint with token refresh support
    @PutMapping("/users/{userId}")
    public ResponseEntity<AdminUserUpdateResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody AdminUserUpdateRequest request) {
        return ResponseEntity.ok(userService.adminUpdateUser(userId, request));
    }

    // NEW: Admin recipe update endpoint
    @PutMapping("/recipes/{recipeId}")
    public ResponseEntity<RecipeDTO> updateRecipe(
            @PathVariable Long recipeId,
            @RequestBody AdminRecipeUpdateRequest request) {
        return ResponseEntity.ok(recipeService.adminUpdateRecipe(recipeId, request));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role) {
        return ResponseEntity.ok(userService.updateUserRole(userId, role));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/recipes/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long recipeId) {
        recipeService.deleteRecipe(recipeId);
        return ResponseEntity.noContent().build();
    }
} 