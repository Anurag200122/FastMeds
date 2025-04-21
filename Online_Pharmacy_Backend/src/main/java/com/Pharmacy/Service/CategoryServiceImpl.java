package com.Pharmacy.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Repository.CategoryRepository;
import com.Pharmacy.model.Category;
import com.Pharmacy.model.Pharmacy;


@Service
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private PharmacyService pharmacyService;
	
	
	
	@Override
	public Category createCategory(String name, Long userId) throws Exception {
		
		Pharmacy pharmacy= pharmacyService.getPharmacyByUserId(userId);
		Category category= new Category();
		category.setName(name);
		category.setPharmacy(pharmacy);
		
		return categoryRepository.save(category);
	}

	@Override
	public List<Category> findCategoryByPharmacy(Long id) throws Exception {
		Pharmacy pharmacy=pharmacyService.findPharmacyById(id);
		return categoryRepository.findByPharmacyId(id);
	}

	@Override
	public Category findCategoryById(Long id) throws Exception {
		
		Optional<Category> optionalCategory=categoryRepository.findById(id);
		
		if(optionalCategory.isEmpty()) {
			throw new Exception("category not found...");
		}
		
		return optionalCategory.get();
	}

}
