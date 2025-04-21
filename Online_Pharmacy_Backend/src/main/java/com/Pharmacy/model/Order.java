package com.Pharmacy.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@ToString(exclude = {"customer"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "pharmacy_id")
    @JsonIgnore
    private Pharmacy pharmacy;

    private Long totalAmount;
    private String orderStatus;
    private Date createdAt;

    @ManyToOne
    private Address deliveryAddress;

    @OneToMany
    private List<OrderItem> items;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "prescription_id")
    @JsonIncludeProperties({"id", "status", "fileName", "filePath", "uploadedAt"})
    private Prescription prescription;

    // New fields for prescription rejection
    private String prescriptionStatus; // PENDING, APPROVED, REJECTED
    private String rejectionReason;
    private String paymentId; // Stripe payment intent ID
    private Boolean refundProcessed = false;
    private Date refundProcessedAt;

    // Helper method to maintain relationship integrity
    public void setPrescription(Prescription prescription) {
        if (this.prescription != null) {
            this.prescription.setOrder(null);
        }
        this.prescription = prescription;
        if (prescription != null) {
            prescription.setOrder(this);
            this.prescriptionStatus = prescription.getStatus(); // Sync status
        }
    }
    
    private int totalItem;
    private Long totalPrice;

    // Enum for order status
    public enum OrderStatus {
        PENDING,
        CONFIRMED,
        PROCESSING,
        READY_FOR_PICKUP,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }

    // Enum for prescription status
    public enum PrescriptionStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}