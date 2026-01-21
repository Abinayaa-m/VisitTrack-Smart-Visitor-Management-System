package com.example.vms.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.setAllowedOrigins(List.of("http://localhost:5173"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setExposedHeaders(List.of("Authorization"));
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth

                        // Allow preflight (React browser OPTIONS requests)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public (login/register)
                                // Public auth endpoints
                                .requestMatchers("/auth/login", "/auth/register").permitAll()

                              // Change password (must be authenticated)
                                .requestMatchers("/auth/change-password")
                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF", "ROLE_SECURITY")


                                // ⭐ Admin-only export endpoints
                        .requestMatchers("/visitors/export/**")
                        .hasAuthority("ROLE_ADMIN")

                        // ⭐ Visitor APIs (fine-grained access handled by @PreAuthorize)
                        .requestMatchers("/visitors/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_SECURITY", "ROLE_STAFF")

                        // Staff operations
                        .requestMatchers("/staff/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_SECURITY" , "ROLE_STAFF")


                        // Everything else
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authProvider());

        // Add JWT filter BEFORE username auth filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}




