package com.cdac.ims.unit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitResponse {

    private Long unitId;

    private String unitName;

    private String description;

}