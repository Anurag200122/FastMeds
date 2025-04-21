package com.Pharmacy.Request;

import lombok.Data;

@Data
public class DossageLevelRequest {

	private String name;
	private Long categoryId;
	private Long pharmacyId;
}
