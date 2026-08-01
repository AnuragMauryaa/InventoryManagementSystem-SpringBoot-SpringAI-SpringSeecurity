package com.cdac.ims.category.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {

    private Long categoryId;

    private String categoryName;

    private String description;
}