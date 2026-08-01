package com.cdac.ims.warehouse.repository;

import com.cdac.ims.warehouse.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse,Long> {

    boolean existsByWarehouseCode(String warehouseCode);

}