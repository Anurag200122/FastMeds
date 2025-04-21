package com.Pharmacy.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Pharmacy {
    
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    
    @OneToOne
    private User owner;
    
    private String name;
    
    private String description;
    
    private String type;
    
    private String madeIn;
    
    @OneToOne
    private Address address;
    
    @Embedded
    private ContactInfo contactInfo;
    
    private String openingHours;
    
    @Column(length=1000)
    private String googleMaps;
    
    @JsonIgnore
    @OneToMany(mappedBy="pharmacy", cascade= CascadeType.ALL, orphanRemoval= true)
    private List<Order> orders = new ArrayList<>();
    
    @ElementCollection
    @Column(length=1000)
    private List<String> images;
    
    private LocalDateTime registrationDate;
    
    private boolean open;
    
    
    @JsonIgnore
    @OneToMany(mappedBy="pharmacy", cascade= CascadeType.ALL)
    private List<Medicine> medicine = new ArrayList<>();
    
    @OneToMany(mappedBy = "pharmacy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Event> events = new ArrayList<>();

	
}