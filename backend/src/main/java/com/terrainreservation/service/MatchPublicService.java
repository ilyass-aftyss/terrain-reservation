package com.terrainreservation.service;

import com.terrainreservation.dto.MatchPublicDTO;
import com.terrainreservation.entity.*;
import com.terrainreservation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MatchPublicService {

    @Autowired
    private MatchPublicRepository matchPublicRepository;

    @Autowired
    private MatchParticipantRepository matchParticipantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    @Transactional(readOnly = true)
    public List<MatchPublicDTO> getOpenMatches() {
        return matchPublicRepository.findByOuvertTrueAndDateMatchAfter(LocalDateTime.now())
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchPublicDTO> getMatchesByCreator(Long creatorId) {
        return matchPublicRepository.findByCreatorId(creatorId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchPublicDTO getMatchById(Long id) {
        MatchPublic match = matchPublicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));
        return convertToDTO(match);
    }

    public MatchPublicDTO createMatch(MatchPublicDTO dto) {
        User creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Créateur non trouvé"));
        Terrain terrain = terrainRepository.findById(dto.getTerrainId())
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé"));

        MatchPublic match = new MatchPublic();
        match.setCreator(creator);
        match.setTerrain(terrain);
        match.setDateMatch(dto.getDateMatch());
        match.setType(TerrainType.valueOf(dto.getType()));
        match.setMaxJoueurs(dto.getMaxJoueurs());
        match.setJoueursInscrits(1); // Le créateur est inclus
        match.setPrixParJoueur(dto.getPrixParJoueur());
        match.setDescription(dto.getDescription());
        match.setOuvert(true);
        match.setCreatedAt(LocalDateTime.now());

        MatchPublic saved = matchPublicRepository.save(match);

        // Le créateur rejoint automatiquement
        MatchParticipant participant = new MatchParticipant();
        participant.setMatchPublic(saved);
        participant.setUser(creator);
        participant.setPaye(false);
        participant.setJoinedAt(LocalDateTime.now());
        matchParticipantRepository.save(participant);

        return convertToDTO(saved);
    }

    public MatchPublicDTO joinMatch(Long matchId, Long userId) {
        MatchPublic match = matchPublicRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));

        if (!match.getOuvert()) {
            throw new RuntimeException("Ce match est fermé");
        }

        if (match.getJoueursInscrits() >= match.getMaxJoueurs()) {
            throw new RuntimeException("Ce match est complet");
        }

        if (matchParticipantRepository.existsByMatchPublicIdAndUserId(matchId, userId)) {
            throw new RuntimeException("Vous êtes déjà inscrit à ce match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        MatchParticipant participant = new MatchParticipant();
        participant.setMatchPublic(match);
        participant.setUser(user);
        participant.setPaye(false);
        participant.setJoinedAt(LocalDateTime.now());
        matchParticipantRepository.save(participant);

        match.setJoueursInscrits(match.getJoueursInscrits() + 1);
        if (match.getJoueursInscrits() >= match.getMaxJoueurs()) {
            match.setOuvert(false);
        }
        matchPublicRepository.save(match);

        return convertToDTO(match);
    }

    public void leaveMatch(Long matchId, Long userId) {
        MatchParticipant participant = matchParticipantRepository.findByMatchPublicIdAndUserId(matchId, userId)
                .orElseThrow(() -> new RuntimeException("Participation non trouvée"));

        MatchPublic match = matchPublicRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match non trouvé"));

        matchParticipantRepository.delete(participant);
        match.setJoueursInscrits(Math.max(0, match.getJoueursInscrits() - 1));
        match.setOuvert(true);
        matchPublicRepository.save(match);
    }

    private MatchPublicDTO convertToDTO(MatchPublic match) {
        MatchPublicDTO dto = new MatchPublicDTO();
        dto.setId(match.getId());
        if (match.getCreator() != null) {
            dto.setCreatorId(match.getCreator().getId());
            dto.setCreatorName(match.getCreator().getNom() + " " + match.getCreator().getPrenom());
        }
        if (match.getTerrain() != null) {
            dto.setTerrainId(match.getTerrain().getId());
            dto.setTerrainName(match.getTerrain().getNom());
            dto.setTerrainLocalisation(match.getTerrain().getLocalisation());
        }
        dto.setDateMatch(match.getDateMatch());
        dto.setType(match.getType() != null ? match.getType().toString() : null);
        dto.setMaxJoueurs(match.getMaxJoueurs());
        dto.setJoueursInscrits(match.getJoueursInscrits());
        dto.setPrixParJoueur(match.getPrixParJoueur());
        dto.setDescription(match.getDescription());
        dto.setOuvert(match.getOuvert());
        dto.setCreatedAt(match.getCreatedAt());

        // Ajouter les participants
        List<MatchParticipant> participants = matchParticipantRepository.findByMatchPublicId(match.getId());
        dto.setParticipants(participants.stream()
                .map(p -> p.getUser().getNom() + " " + p.getUser().getPrenom())
                .collect(Collectors.toList()));

        return dto;
    }
}
