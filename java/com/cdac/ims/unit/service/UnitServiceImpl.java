package com.cdac.ims.unit.service;

import com.cdac.ims.unit.dto.UnitRequest;
import com.cdac.ims.unit.dto.UnitResponse;
import com.cdac.ims.unit.entity.Unit;
import com.cdac.ims.unit.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitServiceImpl implements UnitService {

    private final UnitRepository repository;

    @Override
    public UnitResponse create(UnitRequest request) {

        if(repository.existsByUnitName(request.getUnitName()))
            throw new RuntimeException("Unit already exists");

        Unit unit = Unit.builder()
                .unitName(request.getUnitName())
                .description(request.getDescription())
                .build();

        repository.save(unit);

        return map(unit);
    }

    @Override
    public List<UnitResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public UnitResponse getById(Long id) {

        return map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found")));
    }

    @Override
    public UnitResponse update(Long id, UnitRequest request) {

        Unit unit = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        unit.setUnitName(request.getUnitName());
        unit.setDescription(request.getDescription());

        repository.save(unit);

        return map(unit);
    }

    @Override
    public void delete(Long id) {

        repository.deleteById(id);

    }

    private UnitResponse map(Unit unit){

        return UnitResponse.builder()
                .unitId(unit.getUnitId())
                .unitName(unit.getUnitName())
                .description(unit.getDescription())
                .build();
    }

}