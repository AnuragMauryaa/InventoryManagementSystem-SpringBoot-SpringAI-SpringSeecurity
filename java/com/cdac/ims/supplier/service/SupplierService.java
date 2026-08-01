package com.cdac.ims.supplier.service;

import com.cdac.ims.supplier.dto.*;
import com.cdac.ims.supplier.entity.Supplier;
import com.cdac.ims.supplier.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierResponse create(SupplierRequest request){

        if(repository.existsBySupplierCode(request.getSupplierCode()))
            throw new RuntimeException("Supplier already exists");

        Supplier supplier=Supplier.builder()
                .supplierName(request.getSupplierName())
                .supplierCode(request.getSupplierCode())
                .contactPerson(request.getContactPerson())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .active(true)
                .build();

        repository.save(supplier);

        return map(supplier);

    }

    public List<SupplierResponse> getAll(){

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }

    public SupplierResponse getById(Long id){

        return map(repository.findById(id)
                .orElseThrow(()->new RuntimeException("Supplier not found")));

    }

    public SupplierResponse update(Long id,SupplierRequest request){

        Supplier supplier=repository.findById(id)
                .orElseThrow(()->new RuntimeException("Supplier not found"));

        supplier.setSupplierName(request.getSupplierName());
        supplier.setSupplierCode(request.getSupplierCode());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setCity(request.getCity());
        supplier.setState(request.getState());
        supplier.setCountry(request.getCountry());
        supplier.setPincode(request.getPincode());

        repository.save(supplier);

        return map(supplier);

    }

    public void delete(Long id){

        repository.deleteById(id);

    }

    private SupplierResponse map(Supplier supplier){

        return SupplierResponse.builder()
                .supplierId(supplier.getSupplierId())
                .supplierName(supplier.getSupplierName())
                .supplierCode(supplier.getSupplierCode())
                .contactPerson(supplier.getContactPerson())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .city(supplier.getCity())
                .state(supplier.getState())
                .country(supplier.getCountry())
                .pincode(supplier.getPincode())
                .active(supplier.isActive())
                .build();

    }

}