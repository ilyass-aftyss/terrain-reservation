package com.terrainreservation.controller;

import com.terrainreservation.entity.User;
import com.terrainreservation.entity.Terrain;
import com.terrainreservation.repository.UserRepository;
import com.terrainreservation.repository.TerrainRepository;
import com.terrainreservation.repository.ReservationRepository;
import com.terrainreservation.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("nom", u.getNom());
            map.put("prenom", u.getPrenom());
            map.put("telephone", u.getTelephone());
            map.put("role", u.getRole().toString());
            map.put("active", u.getActive());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setActive(!user.getActive());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Statut utilisateur modifié", "active", user.getActive()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé"));
    }

    @GetMapping("/terrains")
    public ResponseEntity<?> getAllTerrains() {
        return ResponseEntity.ok(terrainRepository.findAll().stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("nom", t.getNom());
            map.put("localisation", t.getLocalisation());
            map.put("actif", t.getActif());
            if (t.getPresident() != null) {
                map.put("presidentName", t.getPresident().getNom() + " " + t.getPresident().getPrenom());
            }
            map.put("prix5x5", t.getPrix5x5());
            map.put("prix7x7", t.getPrix7x7());
            map.put("createdAt", t.getCreatedAt());
            return map;
        }).collect(Collectors.toList()));
    }

    @PutMapping("/terrains/{id}/validate")
    public ResponseEntity<?> validateTerrain(@PathVariable Long id) {
        Terrain terrain = terrainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé"));
        terrain.setActif(true);
        terrainRepository.save(terrain);
        return ResponseEntity.ok(Map.of("message", "Terrain validé"));
    }

    @PutMapping("/terrains/{id}/deactivate")
    public ResponseEntity<?> deactivateTerrain(@PathVariable Long id) {
        Terrain terrain = terrainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé"));
        terrain.setActif(false);
        terrainRepository.save(terrain);
        return ResponseEntity.ok(Map.of("message", "Terrain désactivé"));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalTerrains", terrainRepository.count());
        stats.put("totalReservations", reservationRepository.count());
        stats.put("totalPayments", paymentRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(paymentRepository.findAll().stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("transactionId", p.getTransactionId());
            map.put("montant", p.getMontant());
            map.put("commission", p.getCommissionPlateforme());
            map.put("montantPresident", p.getMontantPresident());
            map.put("statut", p.getStatut().toString());
            map.put("methode", p.getMethodePaiement());
            map.put("createdAt", p.getCreatedAt());
            if (p.getUser() != null) {
                map.put("userName", p.getUser().getNom() + " " + p.getUser().getPrenom());
            }
            return map;
        }).collect(Collectors.toList()));
    }
}
