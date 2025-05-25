package com.gfgm.controller;

import com.gfgm.dto.UserPasswordUpdateRequest;
import com.gfgm.dto.UserUpdateRequest;
import com.gfgm.dto.UserUpdateResponse;
import com.gfgm.model.User;
import com.gfgm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<UserUpdateResponse> updateProfile(@RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/profile/picture")
    public ResponseEntity<User> updateProfilePicture(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(userService.updateProfilePicture(image));
    }

    @PutMapping("/profile/password")
    public ResponseEntity<?> updatePassword(@RequestBody UserPasswordUpdateRequest request) {
        userService.updatePassword(request);
        return ResponseEntity.ok().body("Password updated successfully");
    }
} 