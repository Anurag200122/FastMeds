package com.Pharmacy.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Pharmacy.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{
	
	
	public List<Order> findByCustomerId(Long userId);
	
	public List<Order> findByPharmacyId(Long pharmacyId);

}
