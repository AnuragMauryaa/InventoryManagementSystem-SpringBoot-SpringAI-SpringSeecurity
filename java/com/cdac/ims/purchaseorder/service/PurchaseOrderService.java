package com.cdac.ims.purchaseorder.service;

import com.cdac.ims.purchaseorder.dto.*;
import com.cdac.ims.purchaseorder.entity.PurchaseOrder;
import com.cdac.ims.purchaseorder.repository.PurchaseOrderRepository;
import com.cdac.ims.supplier.entity.Supplier;
import com.cdac.ims.supplier.repository.SupplierRepository;
import com.cdac.ims.warehouse.entity.Warehouse;
import com.cdac.ims.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository repository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;

    public PurchaseOrderResponse create(PurchaseOrderRequest request){

        Supplier supplier=supplierRepository.findById(request.getSupplierId())
                .orElseThrow(()->new RuntimeException("Supplier not found"));
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        PurchaseOrder order=PurchaseOrder.builder()
                .orderNumber(request.getOrderNumber())
                .supplier(supplier)
                .warehouse(warehouse)
                .orderDate(request.getOrderDate())
                .status(request.getStatus())
                .totalAmount(request.getTotalAmount())
                .build();

        repository.save(order);

        return map(order);
    }

    public List<PurchaseOrderResponse> getAll(){
        return repository.findAll().stream().map(this::map).toList();
    }

    public PurchaseOrderResponse getById(Long id){
        return map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found")));
    }

    public PurchaseOrderResponse update(Long id, PurchaseOrderRequest request){              
      PurchaseOrder order=repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                
        if (!isAdmin && (request.getStatus().equals("APPROVED") || request.getStatus().equals("RECEIVED"))) {
            throw new RuntimeException("Unauthorized: Only Administrators can approve or receive purchase orders.");
        }
        Supplier supplier=supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        order.setOrderNumber(request.getOrderNumber());
        order.setSupplier(supplier);
        order.setWarehouse(warehouse);
        order.setOrderDate(request.getOrderDate());
        order.setStatus(request.getStatus());
        order.setTotalAmount(request.getTotalAmount());

        repository.save(order);

        return map(order);
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    private PurchaseOrderResponse map(PurchaseOrder order){

        return PurchaseOrderResponse.builder()
                .purchaseOrderId(order.getPurchaseOrderId())
                .orderNumber(order.getOrderNumber())
                .supplierId(order.getSupplier().getSupplierId())
                .supplierName(order.getSupplier().getSupplierName())
                .warehouseId(order.getWarehouse() != null ? order.getWarehouse().getWarehouseId() : null)
                .warehouseName(order.getWarehouse() != null ? order.getWarehouse().getWarehouseName() : null)
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .build();
    }
}
