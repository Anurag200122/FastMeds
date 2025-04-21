package com.Pharmacy.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Pharmacy.model.Pharmacy;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    @Query("SELECT r FROM Pharmacy r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%',:query,'%')) OR LOWER(r.madeIn) LIKE LOWER(CONCAT('%',:query,'%'))")
    List<Pharmacy> findBySearchQuery(@Param("query") String query);

    Pharmacy findByOwnerId(Long userId);

	List<Pharmacy> findByNameContainingIgnoreCase(String query);  
	
	@Query("SELECT DISTINCT p FROM Pharmacy p JOIN p.medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :medicineName, '%'))")
	List<Pharmacy> findPharmaciesByMedicineName(@Param("medicineName") String medicineName);

	@Query("SELECT DISTINCT p FROM Pharmacy p JOIN p.medicine m WHERE LOWER(m.medicineCategory.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))")
	List<Pharmacy> findPharmaciesByCategoryName(@Param("categoryName") String categoryName);

}