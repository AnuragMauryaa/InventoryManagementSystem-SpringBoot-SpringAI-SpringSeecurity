package com.cdac.ims.category.service;

import com.cdac.ims.category.dto.CategoryRequest;
import com.cdac.ims.category.dto.CategoryResponse;
import com.cdac.ims.category.entity.Category;
import com.cdac.ims.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;

    @Override
    public CategoryResponse create(CategoryRequest request) {

        if(repository.existsByCategoryName(request.getCategoryName()))
            throw new RuntimeException("Category already exists");

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .build();

        repository.save(category);

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .build();
    }

    @Override
    public List<CategoryResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(c -> CategoryResponse.builder()
                        .categoryId(c.getCategoryId())
                        .categoryName(c.getCategoryName())
                        .description(c.getDescription())
                        .build())
                .toList();
    }

    @Override
    public CategoryResponse getById(Long id) {

        Category c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return CategoryResponse.builder()
                .categoryId(c.getCategoryId())
                .categoryName(c.getCategoryName())
                .description(c.getDescription())
                .build();
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {

        Category c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        c.setCategoryName(request.getCategoryName());
        c.setDescription(request.getDescription());

        repository.save(c);

        return CategoryResponse.builder()
                .categoryId(c.getCategoryId())
                .categoryName(c.getCategoryName())
                .description(c.getDescription())
                .build();
    }

    @Override
    public void delete(Long id) {

        repository.deleteById(id);

    }

}