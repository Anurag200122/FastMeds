package com.Pharmacy.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Pharmacy.model.CartItems;


public interface CartItemRepository extends JpaRepository<CartItems , Long>{

	 List<CartItems> findByCartId(Long cartId); // Fetch cart items by cart ID
}
