package com.Pharmacy.Controller;

import com.Pharmacy.model.Delivery;
import com.Pharmacy.Service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping("/assign")
    public Delivery assignDelivery(@RequestParam Long orderId, @RequestParam Long personId) {
        return deliveryService.assignDelivery(orderId, personId);
    }

    @PutMapping("/{id}/status")
    public Delivery updateStatus(@PathVariable Long id, @RequestParam String status) {
        return deliveryService.updateStatus(id, status);
    }

    @GetMapping("/order/{orderId}")
    public Delivery getByOrderId(@PathVariable Long orderId) {
        return deliveryService.getByOrderId(orderId);
    }
}
