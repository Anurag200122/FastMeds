package com.Pharmacy.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Pharmacy.model.DossageCategory;

public interface DossageCategoryRepository extends JpaRepository<DossageCategory, Long> {

	
	List<DossageCategory> findByPharmacyId(Long id);
}
