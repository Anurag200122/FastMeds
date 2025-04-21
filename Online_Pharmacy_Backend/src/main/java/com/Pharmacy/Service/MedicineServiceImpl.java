package com.Pharmacy.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Repository.MedicineRepository;
import com.Pharmacy.Request.CreateMedicineRequest;
import com.Pharmacy.model.Category;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.Pharmacy;


@Service
public class MedicineServiceImpl implements MedicineService{
	
	
	@Autowired
	private MedicineRepository medicineRepository;

	@Override
	public Medicine createMedicine(CreateMedicineRequest req, Category category, Pharmacy pharmacy) {
		Medicine medicine= new Medicine();
		
		medicine.setMedicineCategory(category);
		medicine.setPharmacy(pharmacy);
		medicine.setDescription(req.getDescription());
		medicine.setImages(req.getImages());
		medicine.setName(req.getName());
		medicine.setPrice(req.getPrice());
		medicine.setDossage(req.getDossage());
		medicine.setIsseasonal(req.isSeasonal());
		medicine.setVegetarian(req.isVegetarian());
		medicine.setManufacturingDate(new Date());	
		
		Medicine saveMedicine= medicineRepository.save(medicine);
		
		pharmacy.getMedicine().add(saveMedicine);
		
		return saveMedicine;
	}

	@Override
	public void deleteMedicine(long medicineId) throws Exception {
		
		Medicine medicine=findMedicineById(medicineId);
		medicine.setPharmacy(null);
		medicineRepository.save(medicine);
		
	}

	@Override
	public List<Medicine> getPharmacyMedicine(Long pharmacyId, boolean isVegetarian, boolean isSeasonal, String medicineCategory) {
	    if (pharmacyId == null) {
	        throw new IllegalArgumentException("Pharmacy ID cannot be null");
	    }
	    
	    List<Medicine> medicines = medicineRepository.findByPharmacyId(pharmacyId);
	    
	    // Apply filters only if needed
	    if (isVegetarian) {
	        medicines = filterByVegetarian(medicines, true);
	    }
	    if (isSeasonal) {
	        medicines = filterBySeasonal(medicines, true);
	    }
	    if (medicineCategory != null && !medicineCategory.isEmpty()) {
	        medicines = filterByCategory(medicines, medicineCategory);
	    }
	    
	    return medicines;
	}

	private List<Medicine> filterByCategory(List<Medicine> medicines, String medicineCategory) {
		// TODO Auto-generated method stub
		return medicines.stream().filter(medicine->{
			if(medicine.getMedicineCategory()!=null) {
				return medicine.getMedicineCategory().getName().equals(medicineCategory);
			}
			return false;
			}).collect(Collectors.toList());
		}
		
	

	private List<Medicine> filterBySeasonal(List<Medicine> medicines, boolean isSeasonal) {
		
		return medicines.stream().filter(medicine -> medicine.isIsseasonal()==isSeasonal).collect(Collectors.toList());
		
	}

	private List<Medicine> filterByVegetarian(List<Medicine> medicines, boolean isVegetarian) {
		
		return medicines.stream().filter(medicine -> medicine.isVegetarian()==isVegetarian).collect(Collectors.toList());
	}

	@Override
	public List<Medicine> searchMedicine(String keyword) {
		// TODO Auto-generated method stub
		return medicineRepository.searchMedicine(keyword);
	}

	@Override
	public Medicine findMedicineById(Long medicineId) throws Exception {
		
		Optional<Medicine> optionalMedcine= medicineRepository.findById(medicineId);
		
		if(optionalMedcine.isEmpty()) {
			throw new Exception("Medicine not exist....");
		}
		return optionalMedcine.get();
	}

	@Override
	public Medicine updateAvailabilityStatus(Long medicineId) throws Exception {
		
		Medicine medicine=findMedicineById(medicineId);
		medicine.setAvailable(!medicine.isAvailable());
		
		return medicineRepository.save(medicine);
	}
	

	

}
