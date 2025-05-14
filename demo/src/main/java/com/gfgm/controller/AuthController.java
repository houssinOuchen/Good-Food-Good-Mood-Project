package com.gfgm.controller;

import com.gfgm.dto.AuthRequest;
import com.gfgm.dto.RegisterRequest;
import com.gfgm.model.User;
import com.gfgm.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authService.authenticate(request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("username", authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}