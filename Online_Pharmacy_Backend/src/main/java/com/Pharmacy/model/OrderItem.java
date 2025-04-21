package com.Pharmacy.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @ElementCollection
    @CollectionTable(name = "order_item_dossage", joinColumns = @JoinColumn(name = "order_item_id"))
    @Column(name = "dossage")
    private List<String> dossage;

    @ElementCollection
    @CollectionTable(name = "order_item_dossage_level", joinColumns = @JoinColumn(name = "order_item_id"))
    @Column(name = "dossage_level")
    private List<String> dossageLevel;

    private int quantity;

    private Long totalPrice;

    
}
