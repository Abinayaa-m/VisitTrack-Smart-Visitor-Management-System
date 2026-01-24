package com.example.vms.mapper;

import com.example.vms.dto.StaffRequestDTO;
import com.example.vms.dto.StaffResponseDTO;
import com.example.vms.model.Staff;
import com.example.vms.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface StaffMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    StaffResponseDTO toResponse(Staff staff);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "user")
    Staff toEntity(StaffRequestDTO dto, User user);
}

