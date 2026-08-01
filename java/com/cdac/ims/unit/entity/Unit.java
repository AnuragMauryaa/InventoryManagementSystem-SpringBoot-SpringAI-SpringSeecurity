package com.cdac.ims.unit.entity;

import com.cdac.ims.common.entity.BaseEntity;
import com.cdac.ims.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long unitId;

    @Column(nullable = false, unique = true)
    private String unitName;

    private String description;

    @OneToMany(mappedBy = "unit")
    private List<Product> products;

}