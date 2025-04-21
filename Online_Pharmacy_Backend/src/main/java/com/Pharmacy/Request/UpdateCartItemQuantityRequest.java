package com.Pharmacy.Request;

import lombok.Data;

@Data
public class UpdateCartItemQuantityRequest {

	private Long cartItemId;
	
	private int quantity;
}
