package com.Pharmacy.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "prescriptions") // Changed from @Entity(name = "...") to @Table
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fileName;
    private String filePath;
    private String status; // PENDING, APPROVED, REJECTED

    @OneToOne
    @JoinColumn(name = "order_id") // Corrected mapping
    @JsonIgnore
    private Order order;
    
    private Date uploadedAt;

    // Enum for prescription status
    public enum PrescriptionStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}