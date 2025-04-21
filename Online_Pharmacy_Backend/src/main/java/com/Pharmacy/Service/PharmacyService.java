package com.Pharmacy.Service;

import java.util.List;


import com.Pharmacy.Dto.PharmacyDto;
import com.Pharmacy.Request.createPharmacyRequest;
import com.Pharmacy.model.Pharmacy;
import com.Pharmacy.model.User;


public interface PharmacyService {
	
	public Pharmacy createPharmacy(createPharmacyRequest req, User user);
	
	public Pharmacy updatePharmacy(Long pharmacyId, createPharmacyRequest updatePharmacy)throws Exception;

	public void deletePharmacy(Long pharmacyId) throws Exception;
	
	public List<Pharmacy> getAllPharmacy();
	
	public List<Pharmacy> searchPharmacy(String keyword);
	
	public Pharmacy findPharmacyById(Long id)throws Exception;
	
	public Pharmacy getPharmacyByUserId(Long userId) throws Exception;
	
	public PharmacyDto addToFavorites(Long pharmacyId, User user) throws Exception;
	
	public Pharmacy updatePharmacyStatus(Long id)throws Exception;
	
}
