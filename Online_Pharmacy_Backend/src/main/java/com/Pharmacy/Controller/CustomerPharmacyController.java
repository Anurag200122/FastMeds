package com.Pharmacy.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Dto.PharmacyDto;
import com.Pharmacy.Service.PharmacyService;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.Pharmacy;
import com.Pharmacy.model.User;

@RestController
@RequestMapping("/api/pharmacy")
public class CustomerPharmacyController {
	
	@Autowired
	private PharmacyService pharmacyService;
	
	@Autowired
	private UserService userService;
	
	
	@GetMapping("/search")
	public ResponseEntity<List<Pharmacy>> searchPharmacy(
		@RequestHeader("Authorization") String jwt,
		@RequestParam String keyword) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		List<Pharmacy> pharmacy=pharmacyService.searchPharmacy(keyword);
		return new ResponseEntity<>(pharmacy, HttpStatus.OK);
	}
	
	
	@GetMapping()
	public ResponseEntity<List<Pharmacy>> getAllPharmacy(
		@RequestHeader("Authorization") String jwt
		) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		List<Pharmacy> pharmacy=pharmacyService.getAllPharmacy();
		return new ResponseEntity<>(pharmacy, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Pharmacy> findPharmacyById(
		@RequestHeader("Authorization") String jwt,
		@PathVariable Long id
		) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Pharmacy pharmacy=pharmacyService.findPharmacyById(id);
		return new ResponseEntity<>(pharmacy, HttpStatus.OK);
	}
	
	@PutMapping("/{id}/add-favorites")
	public ResponseEntity<PharmacyDto> addToFavorites(
		@RequestHeader("Authorization") String jwt,
		@PathVariable Long id
		) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		PharmacyDto pharmacy=pharmacyService.addToFavorites(id, user);
		
		return new ResponseEntity<>(pharmacy, HttpStatus.OK);
	}
	

}
