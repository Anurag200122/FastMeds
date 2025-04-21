package com.Pharmacy.Request;

import com.Pharmacy.model.Address;

import lombok.Data;

@Data
public class OrderRequest {
	
	private Long pharmacyId;
	
	private Address deliveryAddress;

}
