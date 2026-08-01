package com.cdac.ims.salesorder.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalesOrderRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private Long warehouseId;

    private String orderNumber;

    private LocalDate orderDate;

    private String status;

    private BigDecimal totalAmount;

}
