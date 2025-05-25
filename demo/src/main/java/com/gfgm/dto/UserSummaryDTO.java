package com.gfgm.dto;

import com.gfgm.model.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String profilePicture;
    private Role role;
    private LocalDateTime createdAt;
}
