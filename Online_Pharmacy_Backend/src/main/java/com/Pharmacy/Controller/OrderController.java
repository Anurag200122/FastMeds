package com.Pharmacy.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Request.AddCartItemRequest;
import com.Pharmacy.Request.OrderRequest;
import com.Pharmacy.Response.PaymentResponse;
import com.Pharmacy.Service.OrderService;
import com.Pharmacy.Service.PaymentService;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.CartItems;
import com.Pharmacy.model.Order;
import com.Pharmacy.model.User;

@RestController
@RequestMapping("/api")
public class OrderController {
	
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PaymentService paymentService;
	

	@PostMapping("/order")
	public ResponseEntity<PaymentResponse> createOrder(@RequestBody OrderRequest req,
			@RequestHeader("authorization")String jwt)
					throws Exception{
		User user=userService.findUserByJwtToken(jwt);
		Order  order=orderService.createOrder(req, user);
		PaymentResponse res= paymentService.createPaymentLink(order);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}
	
	@GetMapping("/order/user")
	public ResponseEntity<List<Order>> getOrderHistory(
			@RequestHeader("authorization")String jwt)
					throws Exception{
		User user=userService.findUserByJwtToken(jwt);
		List<Order>  order=orderService.getUserOrder(user.getId());
		return new ResponseEntity<>(order, HttpStatus.OK);
	}
	
	
}
