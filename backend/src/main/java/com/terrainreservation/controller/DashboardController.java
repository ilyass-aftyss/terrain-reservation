package com.terrainreservation.controller;

import com.terrainreservation.dto.DashboardDTO;
import com.terrainreservation.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/president/{presidentId}")
    public ResponseEntity<DashboardDTO> getPresidentDashboard(@PathVariable Long presidentId) {
        return ResponseEntity.ok(dashboardService.getPresidentDashboard(presidentId));
    }

    @GetMapping("/admin")
    public ResponseEntity<DashboardDTO> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }
}
