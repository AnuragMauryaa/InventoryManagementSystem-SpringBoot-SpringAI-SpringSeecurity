package com.cdac.ims.inventory.dto;

import com.cdac.ims.common.constants.MovementType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryMovementResponse {

    private Long movementId;
    private Long productId;
    private String productName;
    private String sku;
    private Long warehouseId;
    private String warehouseName;
    private MovementType type;
    private Integer quantity;
    private String reference;
    private LocalDateTime createdAt;
}
