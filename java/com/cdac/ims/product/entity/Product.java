package com.cdac.ims.product.entity;

import com.cdac.ims.category.entity.Category;
import com.cdac.ims.common.entity.BaseEntity;
import com.cdac.ims.unit.entity.Unit;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String productName;

    private String description;

    @Column(nullable = false)
    private BigDecimal purchasePrice;

    @Column(nullable = false)
    private BigDecimal sellingPrice;

    @Column(nullable = false)
    private Integer reorderLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

}