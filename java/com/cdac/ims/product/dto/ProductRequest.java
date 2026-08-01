package com.cdac.ims.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank
    private String sku;

    @NotBlank
    private String productName;

    private String description;

    @NotNull
    private BigDecimal purchasePrice;

    @NotNull
    private BigDecimal sellingPrice;

    @NotNull
    private Integer reorderLevel;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long unitId;

}