package com.cdac.ims.reports.controller;

import com.cdac.ims.inventory.repository.InventoryRepository;
import com.cdac.ims.product.repository.ProductRepository;
import com.cdac.ims.purchaseorder.repository.PurchaseOrderRepository;
import com.cdac.ims.salesorder.repository.SalesOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;

    @GetMapping("/products/count")
    public long totalProducts() {
        return productRepository.count();
    }

    @GetMapping("/inventory/count")
    public long totalInventory() {
        return inventoryRepository.count();
    }

    @GetMapping("/purchase-orders/count")
    public long purchaseOrders() {
        return purchaseOrderRepository.count();
    }

    @GetMapping("/sales-orders/count")
    public long salesOrders() {
        return salesOrderRepository.count();
    }

}