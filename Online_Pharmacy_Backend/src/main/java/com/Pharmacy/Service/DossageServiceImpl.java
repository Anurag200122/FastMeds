package com.Pharmacy.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Repository.DossageCategoryRepository;
import com.Pharmacy.Repository.DossageLevelRepository;
import com.Pharmacy.model.DossageCategory;
import com.Pharmacy.model.DossageLevel;
import com.Pharmacy.model.Pharmacy;

@Service
public class DossageServiceImpl implements DossageService{
	
	@Autowired
	private DossageLevelRepository dossageLevelRepository;
	
	@Autowired
	private DossageCategoryRepository dossageCategoryRepository;
	
	@Autowired
	private PharmacyService pharmacyService;

	
	@Override
	public DossageCategory createDossageCategory(String name, Long pharmacyId) throws Exception {
		
		Pharmacy pharmacy=pharmacyService.findPharmacyById(pharmacyId);
		
		DossageCategory category= new DossageCategory();
		category.setPharmacy(pharmacy);
		category.setName(name);
		
		return dossageCategoryRepository.save(category);
	}

	@Override
	public DossageCategory findDossageCategoryById(Long id) throws Exception {
		Optional<DossageCategory> opt=dossageCategoryRepository.findById(id);
		
		if(opt.isEmpty()) {
			throw new Exception("Dossage Category not found...");
			
		}
		return opt.get();
		
	}

	@Override
	public List<DossageCategory> findDossageCategoryByPharmacyId(Long id) throws Exception {
		pharmacyService.findPharmacyById(id);
		return dossageCategoryRepository.findByPharmacyId(id);
	}

	@Override
	public DossageLevel createDossageLevel(Long pharmacyId, String dossageName, Long categoryId) throws Exception {
		
		Pharmacy pharmacy=pharmacyService.findPharmacyById(pharmacyId);
		DossageCategory category= findDossageCategoryById(categoryId);
		
		DossageLevel level=new DossageLevel();
		level.setName(dossageName);
		level.setPharmacy(pharmacy);
		level.setCategory(category);
		
		DossageLevel dossage=dossageLevelRepository.save(level);
		category.getDossage().add(dossage);
		
		return dossage;
		
	}

	@Override
	public List<DossageLevel> findPharmacyDossage(Long pharmacyId) {
		
		return dossageLevelRepository.findByPharmacyId(pharmacyId);
	}

	@Override
	public DossageLevel updateStock(Long id) throws Exception {
		Optional<DossageLevel> optionalDossageLevel= dossageLevelRepository.findById(id);
		if(optionalDossageLevel.isEmpty()) {
			throw new Exception("Dossage not found");
		}
		DossageLevel dossageLevel=optionalDossageLevel.get();
		dossageLevel.setInStoke(!dossageLevel.isInStoke());
		
		return dossageLevelRepository.save(dossageLevel);
		
	}

}
