package com.cdac.ims.purchaseorder.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PurchaseOrderRequest {

    @NotNull
    private Long supplierId;

    @NotNull
    private Long warehouseId;

    private String orderNumber;

    private LocalDate orderDate;

    private String status;

    private BigDecimal totalAmount;

}
