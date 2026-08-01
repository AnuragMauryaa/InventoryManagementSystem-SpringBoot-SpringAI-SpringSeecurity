package com.cdac.ims.unit.repository;

import com.cdac.ims.unit.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    Optional<Unit> findByUnitName(String unitName);

    boolean existsByUnitName(String unitName);

}