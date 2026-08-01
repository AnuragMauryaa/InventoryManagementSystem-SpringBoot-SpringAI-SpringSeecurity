package com.cdac.ims.inventory.dto;

import com.cdac.ims.common.constants.MovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class InventoryMovementRequest {

    @NotNull
    private Long productId;

    @NotNull
    private Long warehouseId;

    @NotNull
    private MovementType type;

    @NotNull
    @Positive
    private Integer quantity;

    private String reference;
}
