package com.terrainreservation.controller;

import com.terrainreservation.dto.MatchPublicDTO;
import com.terrainreservation.service.MatchPublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/matches")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MatchPublicController {

    @Autowired
    private MatchPublicService matchPublicService;

    @GetMapping
    public ResponseEntity<List<MatchPublicDTO>> getOpenMatches() {
        return ResponseEntity.ok(matchPublicService.getOpenMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchPublicDTO> getMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchPublicService.getMatchById(id));
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<MatchPublicDTO>> getMatchesByCreator(@PathVariable Long creatorId) {
        return ResponseEntity.ok(matchPublicService.getMatchesByCreator(creatorId));
    }

    @PostMapping
    public ResponseEntity<MatchPublicDTO> createMatch(@RequestBody MatchPublicDTO dto) {
        return ResponseEntity.ok(matchPublicService.createMatch(dto));
    }

    @PostMapping("/{matchId}/join")
    public ResponseEntity<?> joinMatch(@PathVariable Long matchId, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        matchPublicService.joinMatch(matchId, userId);
        return ResponseEntity.ok(Map.of("message", "Inscription au match réussie"));
    }

    @DeleteMapping("/{matchId}/leave")
    public ResponseEntity<?> leaveMatch(@PathVariable Long matchId, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        matchPublicService.leaveMatch(matchId, userId);
        return ResponseEntity.ok(Map.of("message", "Désistement du match réussi"));
    }
}
