package com.Pharmacy.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Repository.MedicineRepository;
import com.Pharmacy.Request.CreateMedicineRequest;
import com.Pharmacy.Response.MessageResponse;
import com.Pharmacy.Service.MedicineService;
import com.Pharmacy.Service.PharmacyService;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.Pharmacy;
import com.Pharmacy.model.User;

@RestController
@RequestMapping("/api/admin/medicine")
public class AdminMedicineController {
	
	@Autowired
	private MedicineService medicineService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PharmacyService pharmacyService;
	
	
	@PostMapping
	public ResponseEntity<Medicine> createMedicine(@RequestBody CreateMedicineRequest req,
			@RequestHeader("Authorization") String jwt )throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Pharmacy pharmacy=pharmacyService.getPharmacyByUserId(user.getId());
		
		Medicine medicine= medicineService.createMedicine(req, req.getCategory(), pharmacy);
		
		return new ResponseEntity<>(medicine, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<MessageResponse> deleteMedicine(@PathVariable Long id,
			@RequestHeader("Authorization") String jwt )throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		medicineService.deleteMedicine(id);
		
		MessageResponse res= new MessageResponse();
		res.setMessage("Medicine deleted successfully");
		
		return new ResponseEntity<>(res, HttpStatus.OK);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Medicine> updateMedicineAvailabilityStatus(@PathVariable Long id,
			@RequestHeader("Authorization") String jwt )throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Medicine medicine=medicineService.updateAvailabilityStatus(id);
		
		
		return new ResponseEntity<>(medicine, HttpStatus.OK);
	}
}
