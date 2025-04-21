package com.Pharmacy.Service;

import com.Pharmacy.model.Delivery;

public interface DeliveryService {
    Delivery assignDelivery(Long orderId, Long personId);
    Delivery updateStatus(Long deliveryId, String status);
    Delivery getByOrderId(Long orderId);
}
