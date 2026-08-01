package com.cdac.ims.salesorder.controller;

import com.cdac.ims.salesorder.dto.SalesOrderRequest;
import com.cdac.ims.salesorder.dto.SalesOrderResponse;
import com.cdac.ims.salesorder.service.SalesOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
public class SalesOrderController {

    private final SalesOrderService service;

    @PostMapping
    public SalesOrderResponse create(@RequestBody @Valid SalesOrderRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<SalesOrderResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SalesOrderResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public SalesOrderResponse update(@PathVariable Long id,
                                     @RequestBody @Valid SalesOrderRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

}