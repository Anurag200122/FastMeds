package com.Pharmacy.Controller;

import com.Pharmacy.Service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    // General search endpoint
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> searchAll(
            @RequestParam String query) {
        return ResponseEntity.ok(searchService.searchAll(query));
    }

    // Pharmacy-specific searches
    @GetMapping("/pharmacies")
    public ResponseEntity<List<Map<String, Object>>> searchPharmaciesByName(
            @RequestParam String name) {
        return ResponseEntity.ok(searchService.searchPharmaciesByName(name));
    }

    @GetMapping("/pharmacies/by-medicine")
    public ResponseEntity<List<Map<String, Object>>> searchPharmaciesByMedicine(
            @RequestParam String medicineName) {
        return ResponseEntity.ok(searchService.searchPharmaciesByMedicine(medicineName));
    }

    @GetMapping("/pharmacies/by-category")
    public ResponseEntity<List<Map<String, Object>>> searchPharmaciesByCategory(
            @RequestParam String categoryName) {
        return ResponseEntity.ok(searchService.searchPharmaciesByCategory(categoryName));
    }

    // Medicine-specific search
    @GetMapping("/medicines")
    public ResponseEntity<List<Map<String, Object>>> searchMedicinesByName(
            @RequestParam String name) {
        return ResponseEntity.ok(searchService.searchMedicinesByName(name));
    }

    // Combined search with filters
    @GetMapping("/filtered")
    public ResponseEntity<List<Map<String, Object>>> filteredSearch(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String medicine,
            @RequestParam(required = false) String category) {
        
        if (query != null && type == null) {
            // General search
            return ResponseEntity.ok(searchService.searchAll(query));
        } else if ("pharmacy".equalsIgnoreCase(type)) {
            if (medicine != null) {
                return ResponseEntity.ok(searchService.searchPharmaciesByMedicine(medicine));
            } else if (category != null) {
                return ResponseEntity.ok(searchService.searchPharmaciesByCategory(category));
            } else if (query != null) {
                return ResponseEntity.ok(searchService.searchPharmaciesByName(query));
            }
        } else if ("medicine".equalsIgnoreCase(type) && query != null) {
            return ResponseEntity.ok(searchService.searchMedicinesByName(query));
        }
        
        return ResponseEntity.badRequest().build();
    }
}