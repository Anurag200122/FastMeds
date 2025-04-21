package com.Pharmacy.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Pharmacy.model.Order;
import com.Pharmacy.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{

}
