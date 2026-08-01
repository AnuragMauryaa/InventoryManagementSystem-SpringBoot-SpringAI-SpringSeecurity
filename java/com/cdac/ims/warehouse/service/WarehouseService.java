package com.cdac.ims.warehouse.service;

import com.cdac.ims.warehouse.dto.WarehouseRequest;
import com.cdac.ims.warehouse.dto.WarehouseResponse;
import com.cdac.ims.warehouse.entity.Warehouse;
import com.cdac.ims.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository repository;

    public WarehouseResponse create(WarehouseRequest request){

        if(repository.existsByWarehouseCode(request.getWarehouseCode()))
            throw new RuntimeException("Warehouse Code already exists");

        Warehouse warehouse = Warehouse.builder()
                .warehouseCode(request.getWarehouseCode())
                .warehouseName(request.getWarehouseName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .contactPerson(request.getContactPerson())
                .contactNumber(request.getContactNumber())
                .active(true)
                .build();

        repository.save(warehouse);

        return map(warehouse);

    }

    public List<WarehouseResponse> getAll(){

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }

    public WarehouseResponse getById(Long id){

        return map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found")));

    }

    public WarehouseResponse update(Long id, WarehouseRequest request){

        Warehouse warehouse = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        warehouse.setWarehouseCode(request.getWarehouseCode());
        warehouse.setWarehouseName(request.getWarehouseName());
        warehouse.setAddress(request.getAddress());
        warehouse.setCity(request.getCity());
        warehouse.setState(request.getState());
        warehouse.setCountry(request.getCountry());
        warehouse.setPincode(request.getPincode());
        warehouse.setContactPerson(request.getContactPerson());
        warehouse.setContactNumber(request.getContactNumber());

        repository.save(warehouse);

        return map(warehouse);

    }

    public void delete(Long id){

        repository.deleteById(id);

    }

    private WarehouseResponse map(Warehouse warehouse){

        return WarehouseResponse.builder()
                .warehouseId(warehouse.getWarehouseId())
                .warehouseCode(warehouse.getWarehouseCode())
                .warehouseName(warehouse.getWarehouseName())
                .address(warehouse.getAddress())
                .city(warehouse.getCity())
                .state(warehouse.getState())
                .country(warehouse.getCountry())
                .pincode(warehouse.getPincode())
                .contactPerson(warehouse.getContactPerson())
                .contactNumber(warehouse.getContactNumber())
                .active(warehouse.isActive())
                .build();

    }

}