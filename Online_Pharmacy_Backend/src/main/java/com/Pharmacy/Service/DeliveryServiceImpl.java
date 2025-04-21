package com.Pharmacy.Service;

import com.Pharmacy.model.*;
import com.Pharmacy.Repository.*;
import com.Pharmacy.Service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepo;

    @Autowired
    private DeliveryPersonRepository personRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Override
    public Delivery assignDelivery(Long orderId, Long personId) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        DeliveryPerson person = personRepo.findById(personId).orElseThrow();

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryPerson(person);
        delivery.setStatus("Pending");
        delivery.setAssignedAt(new Date());
        delivery.setTrackingCode(UUID.randomUUID().toString().substring(0, 8));

        return deliveryRepo.save(delivery);
    }

    @Override
    public Delivery updateStatus(Long deliveryId, String status) {
        Delivery delivery = deliveryRepo.findById(deliveryId).orElseThrow();
        delivery.setStatus(status);
        if ("Delivered".equalsIgnoreCase(status)) {
            delivery.setDeliveredAt(new Date());
        }
        return deliveryRepo.save(delivery);
    }

    @Override
    public Delivery getByOrderId(Long orderId) {
        return deliveryRepo.findByOrderId(orderId);
    }
}
