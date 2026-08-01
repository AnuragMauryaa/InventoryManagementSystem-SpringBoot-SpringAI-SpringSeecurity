package com.cdac.ims.unit.service;

import com.cdac.ims.unit.dto.UnitRequest;
import com.cdac.ims.unit.dto.UnitResponse;

import java.util.List;

public interface UnitService {

    UnitResponse create(UnitRequest request);

    List<UnitResponse> getAll();

    UnitResponse getById(Long id);

    UnitResponse update(Long id, UnitRequest request);

    void delete(Long id);

}