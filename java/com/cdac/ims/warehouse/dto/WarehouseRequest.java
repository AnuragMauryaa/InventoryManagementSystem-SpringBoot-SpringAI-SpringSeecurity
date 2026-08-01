package com.cdac.ims.warehouse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WarehouseRequest {

    @NotBlank
    private String warehouseCode;

    @NotBlank
    private String warehouseName;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private String contactPerson;

    private String contactNumber;

}