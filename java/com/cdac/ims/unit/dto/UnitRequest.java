package com.cdac.ims.unit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UnitRequest {

    @NotBlank(message = "Unit name is required")
    private String unitName;

    private String description;

}