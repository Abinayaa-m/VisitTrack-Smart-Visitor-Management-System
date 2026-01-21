package com.example.vms.controller;

import com.example.vms.model.Role;
import com.example.vms.model.User;
import com.example.vms.repository.UserRepository;
import com.example.vms.security.JwtUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private AuthenticationManager authenticationManager;



@Autowired
private JwtUtil jwtUtil;


    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {

        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return "username_exists";
        }

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return "email_exists";
        }

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())                  // NEW
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .build();

        userRepository.save(user);
        return "registered";
    }



    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {

        User user;

        // Check if identifier is email
        if (req.getIdentifier().contains("@")) {
            user = userRepository.findByEmail(req.getIdentifier())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        } else {
            user = userRepository.findByUsername(req.getIdentifier())
                    .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        }

        // Authenticate using username stored in DB
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), req.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token);
    }



@Data
static class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}


@Data
static class LoginRequest {
    private String identifier;
    private String password;
}


@Data
static class AuthResponse {
    private final String token;
}
}
