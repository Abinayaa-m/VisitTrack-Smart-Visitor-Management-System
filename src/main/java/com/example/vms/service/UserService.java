package com.example.vms.service;

import com.example.vms.model.User;
import com.example.vms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String username, String newEmail) {

        if (newEmail == null || !EMAIL_PATTERN.matcher(newEmail).matches()) {
            throw new RuntimeException("Invalid email format");
        }

        User user = getUserByUsername(username);

        userRepository.findByEmail(newEmail)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(u -> {
                    throw new RuntimeException("Email already in use");
                });

        user.setEmail(newEmail);
        return userRepository.save(user);
    }

    public void changePassword(String username, String oldPassword, String newPassword) {

        User user = getUserByUsername(username);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}


