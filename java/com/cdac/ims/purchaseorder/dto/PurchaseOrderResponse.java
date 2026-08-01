package com.cdac.ims.purchaseorder.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PurchaseOrderResponse {

    private Long purchaseOrderId;

    private String orderNumber;

    private Long supplierId;

    private String supplierName;

    private Long warehouseId;

    private String warehouseName;

    private LocalDate orderDate;

    private String status;

    private BigDecimal totalAmount;

}
