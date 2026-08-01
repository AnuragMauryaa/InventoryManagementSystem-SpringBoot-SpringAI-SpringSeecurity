package com.cdac.ims.category.controller;

import com.cdac.ims.category.dto.CategoryRequest;
import com.cdac.ims.category.dto.CategoryResponse;
import com.cdac.ims.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping
    public CategoryResponse create(@RequestBody @Valid CategoryRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<CategoryResponse> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CategoryResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Long id,
                                   @RequestBody @Valid CategoryRequest request){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}