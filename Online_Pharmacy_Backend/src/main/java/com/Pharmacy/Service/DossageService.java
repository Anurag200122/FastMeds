package com.Pharmacy.Service;

import java.util.List;

import com.Pharmacy.model.DossageCategory;
import com.Pharmacy.model.DossageLevel;

public interface DossageService {
	
	public DossageCategory createDossageCategory(String name, Long pharmacyId)throws Exception;
	
	public DossageCategory findDossageCategoryById(Long id)throws Exception;
	
	public List<DossageCategory> findDossageCategoryByPharmacyId(Long id)throws Exception;
	
	public DossageLevel createDossageLevel(Long pharmacyId, String dossageName, Long categoryId) throws Exception;
	

	public List<DossageLevel> findPharmacyDossage(Long pharmacyId);
	
	public DossageLevel updateStock(Long id) throws Exception;
}
