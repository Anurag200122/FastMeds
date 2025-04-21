package com.Pharmacy.Service;

import java.util.List;

import com.Pharmacy.Request.OrderRequest;
import com.Pharmacy.model.Order;
import com.Pharmacy.model.User;
import com.stripe.exception.StripeException;

public interface OrderService {
	
	public Order createOrder(OrderRequest order , User user)throws Exception;
	
	public Order updateOrder(Long orderId, String orderStatus)throws Exception;
	
	public void cancelOrder(Long orderId)throws Exception;
	
	public List<Order> getUserOrder(Long userId)throws Exception;
	
	public List<Order> getPharmacyOrder(Long pharmacyId, String orderStatus)throws Exception;
	
	public Order findOrderById(Long orderId)throws Exception;

	Order rejectPrescription(Long orderId, String reason) throws StripeException;
	
	

}
