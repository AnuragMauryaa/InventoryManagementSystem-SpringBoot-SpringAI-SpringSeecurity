package com.cdac.ims.customer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerResponse {

    private Long customerId;

    private String customerName;

    private String customerCode;

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