package com.cdac.ims.unit.controller;

import com.cdac.ims.unit.dto.UnitRequest;
import com.cdac.ims.unit.dto.UnitResponse;
import com.cdac.ims.unit.service.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService service;

    @PostMapping
    public UnitResponse create(@RequestBody @Valid UnitRequest request){
        return service.create(request);
    }

    @GetMapping
    public List<UnitResponse> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public UnitResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public UnitResponse update(@PathVariable Long id,
                               @RequestBody @Valid UnitRequest request){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}