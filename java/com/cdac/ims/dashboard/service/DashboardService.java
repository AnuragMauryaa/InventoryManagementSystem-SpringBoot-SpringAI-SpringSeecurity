package com.cdac.ims.dashboard.service;

import com.cdac.ims.category.repository.CategoryRepository;
import com.cdac.ims.customer.repository.CustomerRepository;
import com.cdac.ims.dashboard.dto.DashboardResponse;
import com.cdac.ims.inventory.repository.InventoryRepository;
import com.cdac.ims.product.repository.ProductRepository;
import com.cdac.ims.purchaseorder.repository.PurchaseOrderRepository;
import com.cdac.ims.salesorder.repository.SalesOrderRepository;
import com.cdac.ims.supplier.repository.SupplierRepository;
import com.cdac.ims.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;

    public DashboardResponse getDashboard() {

        return DashboardResponse.builder()
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalSuppliers(supplierRepository.count())
                .totalCustomers(customerRepository.count())
                .totalWarehouses(warehouseRepository.count())
                .totalInventory(inventoryRepository.count())
                .totalPurchaseOrders(purchaseOrderRepository.count())
                .totalSalesOrders(salesOrderRepository.count())
                .build();

    }

}