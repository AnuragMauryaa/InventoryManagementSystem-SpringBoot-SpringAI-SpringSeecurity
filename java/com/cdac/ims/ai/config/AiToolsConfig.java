package com.cdac.ims.ai.config;

import com.cdac.ims.inventory.entity.Inventory;
import com.cdac.ims.inventory.repository.InventoryRepository;
import com.cdac.ims.product.entity.Product;
import com.cdac.ims.product.repository.ProductRepository;
import com.cdac.ims.salesorder.entity.SalesOrder;
import com.cdac.ims.salesorder.repository.SalesOrderRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Configuration
public class AiToolsConfig {

    public record StockRequest(String sku) {}
    public record StockResponse(String sku, String productName, int totalQuantity, String status) {}

    @Bean
    @Description("Get the current inventory stock level for a product using its exact SKU")
    public Function<StockRequest, StockResponse> getProductStock(
            ProductRepository productRepository, 
            InventoryRepository inventoryRepository) {
            
        return request -> {
            Optional<Product> productOpt = productRepository.findBySku(request.sku());
            if (productOpt.isEmpty()) {
                return new StockResponse(request.sku(), "Unknown", 0, "Product not found in database");
            }
            
            Product product = productOpt.get();
            List<Inventory> inventories = inventoryRepository.findAll().stream()
                    .filter(inv -> inv.getProduct().getProductId().equals(product.getProductId()))
                    .toList();
                    
            int totalStock = inventories.stream().mapToInt(Inventory::getQuantity).sum();
            
            return new StockResponse(
                    product.getSku(), 
                    product.getProductName(), 
                    totalStock, 
                    totalStock <= product.getReorderLevel() ? "Low Stock Alert" : "In Stock"
            );
        };
    }

    public record OrderStatusRequest(String orderNumber) {}
    public record OrderStatusResponse(String orderNumber, String status, String customerName) {}

    @Bean
    @Description("Get the current status of a Sales Order using its Order Number (e.g., SO-1234)")
    public Function<OrderStatusRequest, OrderStatusResponse> getSalesOrderStatus(
            SalesOrderRepository salesOrderRepository) {
            
        return request -> {
            Optional<SalesOrder> orderOpt = salesOrderRepository.findAll().stream()
                    .filter(o -> o.getOrderNumber().equalsIgnoreCase(request.orderNumber()))
                    .findFirst();
                    
            if (orderOpt.isEmpty()) {
                return new OrderStatusResponse(request.orderNumber(), "Not Found", "Unknown");
            }
            
            SalesOrder order = orderOpt.get();
            return new OrderStatusResponse(
                    order.getOrderNumber(), 
                    order.getStatus(), 
                    order.getCustomer().getCustomerName()
            );
        };
    }
}