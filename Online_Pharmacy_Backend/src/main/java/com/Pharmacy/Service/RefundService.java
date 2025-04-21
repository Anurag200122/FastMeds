package com.Pharmacy.Service;

import com.Pharmacy.model.Order;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RefundService {
    
    @Value("${stripe.api.key}")
    private String stripeSecretKey;
    
    public void processRefund(Order order) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        
        if (order.getPaymentId() != null && !order.getRefundProcessed()) {
            RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(order.getPaymentId())
                .setAmount(order.getTotalPrice())
                .setReason(RefundCreateParams.Reason.REQUESTED_BY_CUSTOMER)
                .build();
            
            Refund.create(params);
            
            order.setRefundProcessed(true);
            order.setRefundProcessedAt(new Date());
            order.setOrderStatus(Order.OrderStatus.REFUNDED.toString());
        }
    }
}