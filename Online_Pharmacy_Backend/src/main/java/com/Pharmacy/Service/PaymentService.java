package com.Pharmacy.Service;

import com.Pharmacy.Response.PaymentResponse;
import com.Pharmacy.model.Order;
import com.stripe.exception.StripeException;

public interface PaymentService {
	
	public PaymentResponse createPaymentLink(Order order) throws StripeException;

}
