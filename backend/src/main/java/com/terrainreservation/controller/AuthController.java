package com.terrainreservation.controller;

import com.terrainreservation.dto.LoginRequest;
import com.terrainreservation.dto.LoginResponse;
import com.terrainreservation.entity.User;
import com.terrainreservation.entity.UserRole;
import com.terrainreservation.repository.UserRepository;
import com.terrainreservation.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
            .map(user -> {
                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
                    return ResponseEntity.ok(new LoginResponse(
                        token,
                        user.getId(),
                        user.getEmail(),
                        user.getNom(),
                        user.getPrenom(),
                        user.getRole().toString()
                    ));
                }
                return ResponseEntity.status(401).body(Map.of("error", "Mot de passe incorrect"));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Email non trouvé")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        if (userRepository.existsByEmail(request.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }

        User user = new User();
        user.setEmail(request.get("email"));
        user.setPassword(passwordEncoder.encode(request.get("password")));
        user.setNom(request.getOrDefault("nom", ""));
        user.setPrenom(request.getOrDefault("prenom", ""));
        user.setTelephone(request.get("telephone"));
        String roleStr = request.getOrDefault("role", "JOUEUR");
        user.setRole(UserRole.valueOf(roleStr));
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), saved.getRole().toString());
        return ResponseEntity.ok(new LoginResponse(
            token,
            saved.getId(),
            saved.getEmail(),
            saved.getNom(),
            saved.getPrenom(),
            saved.getRole().toString()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }
        try {
            String token = authHeader.substring(7);
            Long userId = jwtService.extractUserId(token);
            return userRepository.findById(userId)
                    .map(u -> ResponseEntity.ok(Map.of(
                            "id", u.getId(),
                            "email", u.getEmail(),
                            "nom", u.getNom(),
                            "prenom", u.getPrenom(),
                            "role", u.getRole().toString(),
                            "telephone", u.getTelephone() != null ? u.getTelephone() : ""
                    )))
                    .orElse(ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé")));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide"));
        }
    }
}
