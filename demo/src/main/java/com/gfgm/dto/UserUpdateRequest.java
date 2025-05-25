package com.gfgm.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String bio;
} 