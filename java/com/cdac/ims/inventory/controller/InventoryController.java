package com.cdac.ims.inventory.controller;

import com.cdac.ims.inventory.dto.InventoryRequest;
import com.cdac.ims.inventory.dto.InventoryResponse;
import com.cdac.ims.inventory.dto.InventoryMovementRequest;
import com.cdac.ims.inventory.dto.InventoryMovementResponse;
import com.cdac.ims.inventory.service.InventoryMovementService;
import com.cdac.ims.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;
    private final InventoryMovementService movementService;

    @PostMapping("/movements")
    public InventoryMovementResponse adjust(@RequestBody @Valid InventoryMovementRequest request) {
        return movementService.create(request);
    }

    @GetMapping("/movements")
    public List<InventoryMovementResponse> getMovements() {
        return movementService.getAll();
    }

    @PostMapping
    public InventoryResponse create(@RequestBody @Valid InventoryRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<InventoryResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public InventoryResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public InventoryResponse update(@PathVariable Long id,
                                    @RequestBody @Valid InventoryRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
