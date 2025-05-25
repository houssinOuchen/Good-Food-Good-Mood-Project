package com.gfgm.dto;

import com.gfgm.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String token;
} 