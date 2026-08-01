package com.cdac.ims.warehouse.controller;

import com.cdac.ims.warehouse.dto.WarehouseRequest;
import com.cdac.ims.warehouse.dto.WarehouseResponse;
import com.cdac.ims.warehouse.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService service;

    @PostMapping
    public WarehouseResponse create(@RequestBody @Valid WarehouseRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<WarehouseResponse> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public WarehouseResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public WarehouseResponse update(@PathVariable Long id,
                                    @RequestBody @Valid WarehouseRequest request){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}