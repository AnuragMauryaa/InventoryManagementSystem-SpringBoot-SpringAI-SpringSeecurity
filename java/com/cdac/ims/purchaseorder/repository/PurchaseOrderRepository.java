package com.cdac.ims.purchaseorder.repository;

import com.cdac.ims.purchaseorder.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository
        extends JpaRepository<PurchaseOrder, Long> {
}