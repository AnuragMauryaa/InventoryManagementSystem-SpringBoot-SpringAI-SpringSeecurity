package com.cdac.ims.supplier.controller;

import com.cdac.ims.supplier.dto.SupplierRequest;
import com.cdac.ims.supplier.dto.SupplierResponse;
import com.cdac.ims.supplier.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService service;

    @PostMapping
    public SupplierResponse create(@RequestBody @Valid SupplierRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<SupplierResponse> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SupplierResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public SupplierResponse update(@PathVariable Long id,
                                   @RequestBody @Valid SupplierRequest request){
        return service.update(id,request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

}