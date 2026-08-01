package com.cdac.ims.product.service;

import com.cdac.ims.category.entity.Category;
import com.cdac.ims.category.repository.CategoryRepository;
import com.cdac.ims.product.dto.ProductRequest;
import com.cdac.ims.product.dto.ProductResponse;
import com.cdac.ims.product.entity.Product;
import com.cdac.ims.product.repository.ProductRepository;
import com.cdac.ims.unit.entity.Unit;
import com.cdac.ims.unit.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UnitRepository unitRepository;

    @Override
    public ProductResponse create(ProductRequest request) {

        if(productRepository.existsBySku(request.getSku()))
            throw new RuntimeException("SKU already exists");

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        Product product = Product.builder()
                .sku(request.getSku())
                .productName(request.getProductName())
                .description(request.getDescription())
                .purchasePrice(request.getPurchasePrice())
                .sellingPrice(request.getSellingPrice())
                .reorderLevel(request.getReorderLevel())
                .category(category)
                .unit(unit)
                .build();

        productRepository.save(product);

        return map(product);
    }

    @Override
    public List<ProductResponse> getAll() {

        return productRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ProductResponse getById(Long id) {

        return map(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found")));
    }

    @Override
    public ProductResponse update(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        product.setSku(request.getSku());
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setPurchasePrice(request.getPurchasePrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setReorderLevel(request.getReorderLevel());
        product.setCategory(category);
        product.setUnit(unit);

        productRepository.save(product);

        return map(product);
    }

    @Override
    public void delete(Long id) {

        productRepository.deleteById(id);

    }

    private ProductResponse map(Product p) {

        return ProductResponse.builder()

                .productId(p.getProductId())

                .sku(p.getSku())

                .productName(p.getProductName())

                .description(p.getDescription())

                .purchasePrice(p.getPurchasePrice())

                .sellingPrice(p.getSellingPrice())

                .reorderLevel(p.getReorderLevel())

                // IDs
                .categoryId(p.getCategory().getCategoryId())

                .unitId(p.getUnit().getUnitId())

                // Display Names
                .category(p.getCategory().getCategoryName())

                .unit(p.getUnit().getUnitName())

                .build();
    }

}