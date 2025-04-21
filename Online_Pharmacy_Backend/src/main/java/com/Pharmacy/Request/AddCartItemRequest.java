package com.Pharmacy.Request;

import java.util.List;

import lombok.Data;

@Data
public class AddCartItemRequest {
	
	
	private Long medicinceId;
	
	private int quantity;
	
	private List<String> dossage;

}
