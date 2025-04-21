package com.Pharmacy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String image;
    private LocalDateTime startedAt;
    private LocalDateTime endsAt;

    @ManyToOne
    @JoinColumn(name = "pharmacy_id")
    @JsonBackReference
    private Pharmacy pharmacy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}