package com.cdac.ims.customer.service;

import com.cdac.ims.customer.dto.*;
import com.cdac.ims.customer.entity.Customer;
import com.cdac.ims.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerResponse create(CustomerRequest request) {

        if (repository.existsByCustomerCode(request.getCustomerCode()))
            throw new RuntimeException("Customer Code already exists");

        Customer customer = Customer.builder()
                .customerName(request.getCustomerName())
                .customerCode(request.getCustomerCode())
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

        repository.save(customer);

        return map(customer);
    }

    public List<CustomerResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public CustomerResponse getById(Long id) {
        return map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found")));
    }

    public CustomerResponse update(Long id, CustomerRequest request) {

        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setCustomerName(request.getCustomerName());
        customer.setCustomerCode(request.getCustomerCode());
        customer.setContactPerson(request.getContactPerson());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setCountry(request.getCountry());
        customer.setPincode(request.getPincode());

        repository.save(customer);

        return map(customer);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private CustomerResponse map(Customer customer) {

        return CustomerResponse.builder()
                .customerId(customer.getCustomerId())
                .customerName(customer.getCustomerName())
                .customerCode(customer.getCustomerCode())
                .contactPerson(customer.getContactPerson())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .address(customer.getAddress())
                .city(customer.getCity())
                .state(customer.getState())
                .country(customer.getCountry())
                .pincode(customer.getPincode())
                .active(customer.isActive())
                .build();
    }
}