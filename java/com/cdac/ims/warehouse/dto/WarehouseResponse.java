package com.cdac.ims.warehouse.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WarehouseResponse {

    private Long warehouseId;

    private String warehouseCode;

    private String warehouseName;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private String contactPerson;

    private String contactNumber;

    private boolean active;

}