package com.cdac.ims.purchaseorder.controller;

import com.cdac.ims.purchaseorder.dto.*;
import com.cdac.ims.purchaseorder.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    @PostMapping
    public PurchaseOrderResponse create(@RequestBody @Valid PurchaseOrderRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<PurchaseOrderResponse> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PurchaseOrderResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public PurchaseOrderResponse update(@PathVariable Long id,
                                        @RequestBody @Valid PurchaseOrderRequest request){
        return service.update(id,request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

}