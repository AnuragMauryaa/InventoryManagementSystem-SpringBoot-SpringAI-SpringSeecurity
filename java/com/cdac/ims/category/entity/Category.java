package com.cdac.ims.category.entity;

import com.cdac.ims.common.entity.BaseEntity;
import com.cdac.ims.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false, unique = true)
    private String categoryName;

    private String description;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}