package com.Pharmacy.Dto;

import java.util.List;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.Data;

@Data
@Embeddable
public class PharmacyDto {

    private String title;

    @Column(length = 1000)
    private List<String> images;

    private String description;
    
    private Long id;
    
     
}