package com.cdac.ims.supplier.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SupplierResponse {

    private Long supplierId;

    private String supplierName;

    private String supplierCode;

    private String contactPerson;

    private String phone;

    private String email;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private boolean active;

}