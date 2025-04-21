package com.Pharmacy.Repository;

import com.Pharmacy.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByPharmacyId(Long pharmacyId);
}