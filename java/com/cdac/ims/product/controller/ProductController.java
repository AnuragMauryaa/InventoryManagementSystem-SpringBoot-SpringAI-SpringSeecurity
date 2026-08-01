package com.cdac.ims.product.controller;

import com.cdac.ims.product.dto.ProductRequest;
import com.cdac.ims.product.dto.ProductResponse;
import com.cdac.ims.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping
    public ProductResponse create(@RequestBody @Valid ProductRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<ProductResponse> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id,
                                  @RequestBody @Valid ProductRequest request){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}