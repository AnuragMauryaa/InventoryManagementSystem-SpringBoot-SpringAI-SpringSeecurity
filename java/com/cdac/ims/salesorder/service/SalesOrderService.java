package com.cdac.ims.salesorder.service;

import com.cdac.ims.customer.entity.Customer;
import com.cdac.ims.customer.repository.CustomerRepository;
import com.cdac.ims.salesorder.dto.SalesOrderRequest;
import com.cdac.ims.salesorder.dto.SalesOrderResponse;
import com.cdac.ims.salesorder.entity.SalesOrder;
import com.cdac.ims.salesorder.repository.SalesOrderRepository;
import com.cdac.ims.warehouse.entity.Warehouse;
import com.cdac.ims.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesOrderService {

    private final SalesOrderRepository repository;
    private final CustomerRepository customerRepository;
    private final WarehouseRepository warehouseRepository;

    public SalesOrderResponse create(SalesOrderRequest request) {

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        SalesOrder order = SalesOrder.builder()
                .orderNumber(request.getOrderNumber())
                .customer(customer)
                .warehouse(warehouse)
                .orderDate(request.getOrderDate())
                .status(request.getStatus())
                .totalAmount(request.getTotalAmount())
                .build();

        repository.save(order);

        return map(order);
    }

    public List<SalesOrderResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }

    public SalesOrderResponse getById(Long id) {

        return map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found")));

    }

    public SalesOrderResponse update(Long id, SalesOrderRequest request) {

        SalesOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                
        if (!isAdmin && (request.getStatus().equals("CONFIRMED") || request.getStatus().equals("SHIPPED"))) {
            throw new RuntimeException("Unauthorized: Only Administrators can confirm or ship sales orders.");
        }
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        order.setOrderNumber(request.getOrderNumber());
        order.setCustomer(customer);
        order.setWarehouse(warehouse);
        order.setOrderDate(request.getOrderDate());
        order.setStatus(request.getStatus());
        order.setTotalAmount(request.getTotalAmount());

        repository.save(order);

        return map(order);
    }

    public void delete(Long id) {

        repository.deleteById(id);

    }

    private SalesOrderResponse map(SalesOrder order) {

        return SalesOrderResponse.builder()
                .salesOrderId(order.getSalesOrderId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer().getCustomerId())
                .customerName(order.getCustomer().getCustomerName())
                .warehouseId(order.getWarehouse() != null ? order.getWarehouse().getWarehouseId() : null)
                .warehouseName(order.getWarehouse() != null ? order.getWarehouse().getWarehouseName() : null)
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .build();

    }

}
