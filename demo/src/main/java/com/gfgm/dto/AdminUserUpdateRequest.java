package com.gfgm.dto;

import com.gfgm.model.Role;
import lombok.Data;

@Data
public class AdminUserUpdateRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private Role role;
}
