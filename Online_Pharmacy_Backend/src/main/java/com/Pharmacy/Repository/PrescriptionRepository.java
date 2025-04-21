package com.Pharmacy.Repository;

import com.Pharmacy.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    // Custom query method
    Prescription findByOrderId(Long orderId);
    Optional<Prescription> findById(Long prescriptionId);

}