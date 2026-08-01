package com.cdac.ims.inventory.repository;

import com.cdac.ims.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductProductIdAndWarehouseWarehouseId(Long productId, Long warehouseId);
}
