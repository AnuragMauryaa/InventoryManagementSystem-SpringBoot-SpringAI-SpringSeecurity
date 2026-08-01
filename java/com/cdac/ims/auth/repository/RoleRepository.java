package com.cdac.ims.auth.repository;

import com.cdac.ims.auth.entity.Role;
import com.cdac.ims.common.constants.RoleType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleType(RoleType roleType);

}