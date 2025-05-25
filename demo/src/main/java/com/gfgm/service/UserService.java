package com.gfgm.service;

import com.gfgm.dto.RegisterRequest;
import com.gfgm.dto.UserPasswordUpdateRequest;
import com.gfgm.dto.UserSummaryDTO;
import com.gfgm.dto.UserUpdateRequest;
import com.gfgm.dto.UserUpdateResponse;
import com.gfgm.model.Role;
import com.gfgm.model.User;
import com.gfgm.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    private final String UPLOAD_DIR = "uploads/";

    public User registerUser(@Valid RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.USER); // Default role for new registrations
        
        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public List<UserSummaryDTO> getRecentUsers(int limit) {
        return userRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }

    private UserSummaryDTO convertToSummaryDTO(User user) {
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public UserUpdateResponse updateProfile(UserUpdateRequest request) {
        User currentUser = authService.getCurrentUser();
        boolean usernameChanged = false;

        if (request.getUsername() != null && !request.getUsername().equals(currentUser.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            currentUser.setUsername(request.getUsername());
            usernameChanged = true;
        }
        if (request.getFirstName() != null) {
            currentUser.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            currentUser.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email is already registered");
            }
            currentUser.setEmail(request.getEmail());
        }
        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }
        
        User savedUser = userRepository.save(currentUser);
        
        String token = null;
        if (usernameChanged) {
            token = authService.generateToken(savedUser);
        }
        
        return UserUpdateResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .profilePicture(savedUser.getProfilePicture())
                .bio(savedUser.getBio())
                .role(savedUser.getRole())
                .token(token)
                .build();
    }

    public User updateProfilePicture(MultipartFile file) {
        User currentUser = authService.getCurrentUser();
        
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Delete old profile picture if exists
            if (currentUser.getProfilePicture() != null) {
                Path oldFilePath = Paths.get(UPLOAD_DIR + currentUser.getProfilePicture());
                Files.deleteIfExists(oldFilePath);
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            currentUser.setProfilePicture(filename);
            return userRepository.save(currentUser);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store profile picture", e);
        }
    }

    public User updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete user's profile picture if exists
        if (user.getProfilePicture() != null) {
            try {
                Path filePath = Paths.get(UPLOAD_DIR + user.getProfilePicture());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log error but don't throw
            }
        }
        
        userRepository.delete(user);
    }

    public User updateUser(Long id, UserUpdateRequest request) {
        User user = getUserById(id);
        
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        
        return userRepository.save(user);
    }


    public void updatePassword(UserPasswordUpdateRequest request) {
        User currentUser = authService.getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }
} 