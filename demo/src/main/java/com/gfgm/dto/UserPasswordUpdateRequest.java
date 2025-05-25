package com.gfgm.dto;

import lombok.Data;

@Data
public class UserPasswordUpdateRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}