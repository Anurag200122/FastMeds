package com.Pharmacy.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Pharmacy.model.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long>{
	
	List<Medicine> findByPharmacyId(Long pharmacyId);
	
	
	@Query("SELECT m FROM Medicine m WHERE m.name LIKE %:keyword% OR medicineCategory.name LIKE %:keyword% ")
	List<Medicine> searchMedicine(@Param("keyword")String keyword);


	List<Medicine> findByNameContainingIgnoreCase(String query);

}
