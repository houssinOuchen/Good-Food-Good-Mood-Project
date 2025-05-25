package com.gfgm.dto;

import com.gfgm.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private Role role;
    private String token; // Only present if admin updated their own username
    private Boolean selfUpdate; // Indicates if admin updated their own account
}
