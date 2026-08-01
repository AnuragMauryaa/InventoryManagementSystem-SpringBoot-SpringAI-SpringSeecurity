package com.cdac.ims.customer.entity;

import com.cdac.ims.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    @Column(nullable = false)
    private String customerName;

    @Column(unique = true)
    private String customerCode;

    private String contactPerson;

    private String phone;

    private String email;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    @Builder.Default
    private boolean active = true;

}
