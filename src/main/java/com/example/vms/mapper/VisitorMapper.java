package com.example.vms.mapper;

import com.example.vms.dto.VisitorRequestDTO;
import com.example.vms.dto.VisitorResponseDTO;
import com.example.vms.model.Visitor;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VisitorMapper
{

    @Mapping(source = "staff.id", target = "staffId")
    @Mapping(target = "canExit", ignore = true)
    @Mapping(source = "staff.user.username", target = "staffUsername")
    VisitorResponseDTO toResponse(Visitor visitor);

    List<VisitorResponseDTO> toResponseList(List<Visitor> visitors);

    Visitor toEntity(VisitorRequestDTO dto);
}




