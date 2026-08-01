package com.cdac.ims.inventory.service;

import com.cdac.ims.inventory.dto.InventoryRequest;
import com.cdac.ims.inventory.dto.InventoryResponse;
import com.cdac.ims.inventory.entity.Inventory;
import com.cdac.ims.inventory.repository.InventoryRepository;
import com.cdac.ims.product.entity.Product;
import com.cdac.ims.product.repository.ProductRepository;
import com.cdac.ims.warehouse.entity.Warehouse;
import com.cdac.ims.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryResponse create(InventoryRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        Inventory inventory = Inventory.builder()
                .product(product)
                .warehouse(warehouse)
                .quantity(request.getQuantity())
                .lastUpdated(LocalDateTime.now())
                .build();

        inventoryRepository.save(inventory);

        return map(inventory);
    }

    public List<InventoryResponse> getAll() {
        return inventoryRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public InventoryResponse getById(Long id) {

        return map(inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found")));
    }

    public InventoryResponse update(Long id, InventoryRequest request) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setQuantity(request.getQuantity());
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        return map(inventory);
    }

    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    private InventoryResponse map(Inventory inventory) {

        return InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .productId(inventory.getProduct().getProductId())
                .productName(inventory.getProduct().getProductName())
                .warehouseId(inventory.getWarehouse().getWarehouseId())
                .warehouseName(inventory.getWarehouse().getWarehouseName())
                .quantity(inventory.getQuantity())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}