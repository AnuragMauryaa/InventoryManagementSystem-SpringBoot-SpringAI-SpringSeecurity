package com.cdac.ims.dashboard.controller;

import com.cdac.ims.dashboard.dto.DashboardResponse;
import com.cdac.ims.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardResponse dashboard() {
        return service.getDashboard();
    }

}