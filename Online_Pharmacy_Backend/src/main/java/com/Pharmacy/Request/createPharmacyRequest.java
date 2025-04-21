package com.Pharmacy.Request;

import java.util.List;

import com.Pharmacy.model.Address;
import com.Pharmacy.model.ContactInfo;

import lombok.Data;

@Data
public class createPharmacyRequest {

	private Long id;
	private String name;
	private String description;
	private String madeIn;
	private Address address;
	private ContactInfo contactInfo;
	private String openingHours;
	private String googleMaps;
	private List<String> images;
	
}
