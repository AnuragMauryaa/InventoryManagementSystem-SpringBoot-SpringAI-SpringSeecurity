package com.cdac.ims.inventory.service;

import com.cdac.ims.common.constants.MovementType;
import com.cdac.ims.inventory.dto.InventoryMovementRequest;
import com.cdac.ims.inventory.dto.InventoryMovementResponse;
import com.cdac.ims.inventory.entity.Inventory;
import com.cdac.ims.inventory.entity.InventoryMovement;
import com.cdac.ims.inventory.repository.InventoryMovementRepository;
import com.cdac.ims.inventory.repository.InventoryRepository;
import com.cdac.ims.product.entity.Product;
import com.cdac.ims.product.repository.ProductRepository;
import com.cdac.ims.warehouse.entity.Warehouse;
import com.cdac.ims.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryMovementService {

    private final InventoryMovementRepository movementRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Transactional
    public InventoryMovementResponse create(InventoryMovementRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new java.util.NoSuchElementException("Product not found"));
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new java.util.NoSuchElementException("Warehouse not found"));

        if (request.getType() == MovementType.TRANSFER) {
            throw new IllegalArgumentException("Use a transfer workflow for stock transfers");
        }

        Inventory inventory = inventoryRepository
                .findByProductProductIdAndWarehouseWarehouseId(product.getProductId(), warehouse.getWarehouseId())
                .orElseGet(() -> Inventory.builder()
                        .product(product)
                        .warehouse(warehouse)
                        .quantity(0)
                        .lastUpdated(LocalDateTime.now())
                        .build());

        int delta = request.getType() == MovementType.OUT ? -request.getQuantity() : request.getQuantity();
        int updatedQuantity = inventory.getQuantity() + delta;
        if (updatedQuantity < 0) {
            throw new IllegalArgumentException("Insufficient stock for this outgoing movement");
        }

        inventory.setQuantity(updatedQuantity);
        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inventory);

        InventoryMovement movement = movementRepository.save(InventoryMovement.builder()
                .product(product)
                .warehouse(warehouse)
                .type(request.getType())
                .quantity(request.getQuantity())
                .reference(request.getReference())
                .build());

        return map(movement);
    }

    @Transactional(readOnly = true)
    public List<InventoryMovementResponse> getAll() {
        return movementRepository.findAllByOrderByCreatedAtDesc().stream().map(this::map).toList();
    }

    private InventoryMovementResponse map(InventoryMovement movement) {
        return InventoryMovementResponse.builder()
                .movementId(movement.getMovementId())
                .productId(movement.getProduct().getProductId())
                .productName(movement.getProduct().getProductName())
                .sku(movement.getProduct().getSku())
                .warehouseId(movement.getWarehouse().getWarehouseId())
                .warehouseName(movement.getWarehouse().getWarehouseName())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .reference(movement.getReference())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
