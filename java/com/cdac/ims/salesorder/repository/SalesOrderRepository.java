package com.cdac.ims.salesorder.repository;

import com.cdac.ims.salesorder.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
}