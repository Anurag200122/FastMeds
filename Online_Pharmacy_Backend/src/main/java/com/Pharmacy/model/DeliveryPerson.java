package com.Pharmacy.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class DeliveryPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String phoneNumber;

    @OneToMany(mappedBy = "deliveryPerson")
    private List<Delivery> deliveries;
}
