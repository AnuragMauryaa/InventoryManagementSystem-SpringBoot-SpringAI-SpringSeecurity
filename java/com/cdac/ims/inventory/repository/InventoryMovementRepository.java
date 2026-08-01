package com.cdac.ims.inventory.repository;

import com.cdac.ims.inventory.entity.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {

    List<InventoryMovement> findAllByOrderByCreatedAtDesc();
}
