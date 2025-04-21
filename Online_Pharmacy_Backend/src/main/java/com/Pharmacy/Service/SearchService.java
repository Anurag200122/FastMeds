package com.Pharmacy.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Repository.MedicineRepository;
import com.Pharmacy.Repository.PharmacyRepository;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.Pharmacy;

@Service
public class SearchService {
    
    @Autowired
    private PharmacyRepository pharmacyRepository;
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    // General search across both pharmacies and medicines
    public List<Map<String, Object>> searchAll(String query) {
        List<Map<String, Object>> results = new ArrayList<>();
        
        searchPharmaciesByName(query).forEach(results::add);
        searchMedicinesByName(query).forEach(results::add);
        
        return results;
    }
    
    // Pharmacy-specific searches
    public List<Map<String, Object>> searchPharmaciesByName(String nameQuery) {
        return pharmacyRepository.findByNameContainingIgnoreCase(nameQuery)
            .stream()
            .map(this::createPharmacyResultItem)
            .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> searchPharmaciesByMedicine(String medicineName) {
        return pharmacyRepository.findPharmaciesByMedicineName(medicineName)
            .stream()
            .map(this::createPharmacyResultItem)
            .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> searchPharmaciesByCategory(String categoryName) {
        return pharmacyRepository.findPharmaciesByCategoryName(categoryName)
            .stream()
            .map(this::createPharmacyResultItem)
            .collect(Collectors.toList());
    }
    
    // Medicine-specific search
    public List<Map<String, Object>> searchMedicinesByName(String nameQuery) {
        return medicineRepository.findByNameContainingIgnoreCase(nameQuery)
            .stream()
            .map(this::createMedicineResultItem)
            .collect(Collectors.toList());
    }
    
    // Helper method to create a pharmacy result item
    private Map<String, Object> createPharmacyResultItem(Pharmacy pharmacy) {
        Map<String, Object> item = new HashMap<>();
        item.put("type", "pharmacy");
        item.put("id", pharmacy.getId());
        item.put("name", pharmacy.getName());
        item.put("address", pharmacy.getAddress());
        item.put("open", pharmacy.isOpen());
        item.put("images", pharmacy.getImages());
        item.put("description", pharmacy.getDescription());
        return item;
    }
    
    // Helper method to create a medicine result item with all fields from Medicine entity
    private Map<String, Object> createMedicineResultItem(Medicine medicine) {
        Map<String, Object> item = new HashMap<>();
        item.put("type", "medicine");
        item.put("id", medicine.getId());
        item.put("name", medicine.getName());
        item.put("description", medicine.getDescription());
        item.put("price", medicine.getPrice());
        item.put("category", medicine.getMedicineCategory() != null ?
                medicine.getMedicineCategory().getName() : null);
        item.put("images", medicine.getImages());
        item.put("available", medicine.isAvailable());
        item.put("pharmacy", medicine.getPharmacy()); // optionally keep full pharmacy
        item.put("isVegetarian", medicine.isVegetarian());
        item.put("isSeasonal", medicine.isIsseasonal());
        item.put("manufacturingDate", medicine.getManufacturingDate());

        // Full dosage objects
        if (medicine.getDossage() != null) {
            List<Map<String, Object>> dosageList = medicine.getDossage().stream()
                .map(d -> {
                    Map<String, Object> dosageMap = new HashMap<>();
                    dosageMap.put("id", d.getId());
                    dosageMap.put("name", d.getName());
                    dosageMap.put("inStoke", d.isInStoke()); // Assuming isInStoke() exists

                    if (d.getCategory() != null) {
                        Map<String, Object> categoryMap = new HashMap<>();
                        categoryMap.put("id", d.getCategory().getId());
                        categoryMap.put("name", d.getCategory().getName());
                        dosageMap.put("category", categoryMap);
                    } else {
                        dosageMap.put("category", null);
                    }

                    return dosageMap;
                })
                .collect(Collectors.toList());

            item.put("dossage", dosageList);
        } else {
            item.put("dossage", new ArrayList<>());
        }

        return item;
    }


}