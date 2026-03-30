package com.terrainreservation.controller;

import com.terrainreservation.dto.ReservationDTO;
import com.terrainreservation.entity.Reservation;
import com.terrainreservation.repository.ReservationRepository;
import com.terrainreservation.service.PdfService;
import com.terrainreservation.service.QrCodeService;
import com.terrainreservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private QrCodeService qrCodeService;

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @GetMapping("/terrain/{terrainId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByTerrain(@PathVariable Long terrainId) {
        return ResponseEntity.ok(reservationService.getReservationsByTerrain(terrainId));
    }

    @GetMapping("/check-conflict")
    public ResponseEntity<?> checkConflict(
            @RequestParam Long terrainId,
            @RequestParam String dateDebut,
            @RequestParam String dateFin) {
        java.time.LocalDateTime debut = java.time.LocalDateTime.parse(dateDebut);
        java.time.LocalDateTime fin = java.time.LocalDateTime.parse(dateFin);
        boolean conflict = reservationService.hasConflict(terrainId, debut, fin);
        return ResponseEntity.ok(Map.of("conflict", conflict));
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationDTO dto) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(@PathVariable Long id, @RequestBody ReservationDTO dto) {
        return ResponseEntity.ok(reservationService.updateReservation(id, dto));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReservationDTO> cancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        byte[] pdfBytes = pdfService.generateReservationPdf(reservation);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("reservation_" + reservation.getNumeroReservation() + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        String qrContent = String.format("RES:%s|T:%s|D:%s",
                reservation.getNumeroReservation(),
                reservation.getTerrain().getNom(),
                reservation.getDateDebut().toString());

        byte[] qrBytes = qrCodeService.generateQrCodeBytes(qrContent);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(qrBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/scan/{numeroReservation}")
    public ResponseEntity<?> scanQrCode(@PathVariable String numeroReservation) {
        try {
            ReservationDTO result = reservationService.scanQrCode(numeroReservation);
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "message", "QR Code validé avec succès",
                    "reservation", result
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", e.getMessage()
            ));
        }
    }
}
