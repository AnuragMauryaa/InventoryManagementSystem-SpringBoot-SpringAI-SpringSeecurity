package com.cdac.ims.warehouse.entity;

import com.cdac.ims.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long warehouseId;

    @Column(nullable = false, unique = true)
    private String warehouseCode;

    @Column(nullable = false)
    private String warehouseName;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private String contactPerson;

    private String contactNumber;

    @Builder.Default
    private boolean active = true;

}
