package com.cdac.ims.salesorder.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class SalesOrderResponse {

    private Long salesOrderId;

    private String orderNumber;

    private Long customerId;

    private String customerName;

    private Long warehouseId;

    private String warehouseName;

    private LocalDate orderDate;

    private String status;

    private BigDecimal totalAmount;

}
