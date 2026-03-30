package com.terrainreservation.controller;

import com.terrainreservation.dto.PaymentDTO;
import com.terrainreservation.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> request) {
        try {
            Long reservationId = Long.valueOf(request.get("reservationId").toString());
            Long userId = Long.valueOf(request.get("userId").toString());
            String methode = request.getOrDefault("methodePaiement", "CMI").toString();

            PaymentDTO payment = paymentService.processPayment(reservationId, userId, methode);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<?> getPaymentByReservation(@PathVariable Long reservationId) {
        PaymentDTO payment = paymentService.getPaymentByReservation(reservationId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
