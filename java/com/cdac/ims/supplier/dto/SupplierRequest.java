package com.cdac.ims.supplier.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierRequest {

    @NotBlank
    private String supplierName;

    @NotBlank
    private String supplierCode;

    private String contactPerson;

    private String phone;

    private String email;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

}