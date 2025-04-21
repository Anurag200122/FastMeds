package com.Pharmacy.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Request.DossageCategoryRequest;
import com.Pharmacy.Request.DossageLevelRequest;
import com.Pharmacy.Service.DossageService;
import com.Pharmacy.model.DossageCategory;
import com.Pharmacy.model.DossageLevel;

@RestController
@RequestMapping("/api/admin/dossage")
public class DossageController {
	
	@Autowired
	private DossageService dossageService;
	
	
	@PostMapping("/category")
	public ResponseEntity<DossageCategory> createDossageCategory(
			@RequestBody DossageCategoryRequest req)throws Exception{
		
		DossageCategory level=dossageService.createDossageCategory(req.getName(), req.getPharmacyId());
		
		return new ResponseEntity<>(level, HttpStatus.CREATED);
		
		
	}


	@PostMapping()
	public ResponseEntity<DossageLevel> createDossageLevel(
			@RequestBody DossageLevelRequest req)throws Exception{
		
		DossageLevel level=dossageService.createDossageLevel(req.getPharmacyId(), req.getName(), req.getCategoryId());
		
		return new ResponseEntity<>(level, HttpStatus.CREATED);
		
		
	}


	@PutMapping("/{id}/stock")
	public ResponseEntity<DossageLevel> updateDossageStock(
			@PathVariable Long id)throws Exception{
		
		DossageLevel level=dossageService.updateStock(id);
		return new ResponseEntity<>(level, HttpStatus.OK);
		
		
	}

	@GetMapping("/pharmacy/{id}")
	public ResponseEntity<List<DossageLevel>> getPharmacyDossage(
			@PathVariable Long id)throws Exception{
		
		List<DossageLevel> levels=dossageService.findPharmacyDossage(id);
		return new ResponseEntity<>(levels, HttpStatus.OK);
		
		
	}
	
	@GetMapping("/pharmacy/{id}/category")
	public ResponseEntity<List<DossageCategory>> getPharmacyDossageCategory(
			@PathVariable Long id)throws Exception{
		
		List<DossageCategory> levels=dossageService.findDossageCategoryByPharmacyId(id);
		return new ResponseEntity<>(levels, HttpStatus.OK);
		
		
	}
}

	
	
	


