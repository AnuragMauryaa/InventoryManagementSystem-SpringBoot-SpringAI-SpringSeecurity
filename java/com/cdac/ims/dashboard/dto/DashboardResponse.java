package com.cdac.ims.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalProducts;

    private long totalCategories;

    private long totalSuppliers;

    private long totalCustomers;

    private long totalWarehouses;

    private long totalInventory;

    private long totalPurchaseOrders;

    private long totalSalesOrders;

}