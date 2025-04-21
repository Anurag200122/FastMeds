package com.Pharmacy.Service;

import java.util.List;

import com.Pharmacy.Request.CreateMedicineRequest;
import com.Pharmacy.model.Category;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.Pharmacy;

public interface MedicineService {
	
	
	public Medicine createMedicine(CreateMedicineRequest req, 
			Category category, 
			Pharmacy pharmacy);
	
	
	void deleteMedicine(long medicineId)throws Exception;
	
	public List<Medicine> getPharmacyMedicine(Long pharmacyId, 
			boolean isVegetarian, boolean isSeasonal, 
			String medicineCategory);
	
	public List<Medicine> searchMedicine(String keyword);
	
	public Medicine findMedicineById(Long medicineId) throws Exception;
	
	public Medicine updateAvailabilityStatus(Long medicineId) throws Exception;
}
