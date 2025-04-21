package com.Pharmacy.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;





@Data
@Entity
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String streetAddress;
    private String city;
    private String stateProvince;
    private String postalCode;
    private String country;
    
    // Constructors
    public Address() {}
    
    public Address(String streetAddress, String city, String stateProvince, 
                  String postalCode, String country) {
        this.streetAddress = streetAddress;
        this.city = city;
        this.stateProvince = stateProvince;
        this.postalCode = postalCode;
        this.country = country;
    }
}