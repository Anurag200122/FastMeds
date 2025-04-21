package com.Pharmacy.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Pharmacy.model.DossageLevel;

public interface DossageLevelRepository extends JpaRepository<DossageLevel, Long>{

	List<DossageLevel> findByPharmacyId(Long id);
	
	
}
