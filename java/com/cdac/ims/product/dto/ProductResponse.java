package com.cdac.ims.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {

    private Long productId;

    private String sku;

    private String productName;

    private String description;

    private BigDecimal purchasePrice;

    private BigDecimal sellingPrice;

    private Integer reorderLevel;

    // Needed by React dropdowns
    private Long categoryId;

    private Long unitId;

    // Display names
    private String category;

    private String unit;

}