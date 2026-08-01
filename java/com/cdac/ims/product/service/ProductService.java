package com.cdac.ims.product.service;

import com.cdac.ims.product.dto.ProductRequest;
import com.cdac.ims.product.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    List<ProductResponse> getAll();

    ProductResponse getById(Long id);

    ProductResponse update(Long id, ProductRequest request);

    void delete(Long id);

}