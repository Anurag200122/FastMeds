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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.Pharmacy.Request.CreateMedicineRequest;
import com.Pharmacy.Service.MedicineService;
import com.Pharmacy.Service.PharmacyService;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.Pharmacy;
import com.Pharmacy.model.User;

@RestController
@RequestMapping("/api/medicine")
public class MedicineController {
	@Autowired
	private MedicineService medicineService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PharmacyService pharmacyService;
	
	
	@GetMapping("/search")
	public ResponseEntity<List<Medicine>> searchMedicine(@RequestParam String name,
			@RequestHeader("Authorization") String jwt )throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		List<Medicine> medicines=medicineService.searchMedicine(name);
		return new ResponseEntity<>(medicines, HttpStatus.OK);
	}
	
	@GetMapping("/pharmacy/{pharmacyId}")
	public ResponseEntity<List<Medicine>> getPharmacyMedicine(
	        @RequestParam(required = false, defaultValue = "false") boolean vegetarian,
	        @RequestParam(required = false, defaultValue = "false") boolean seasonal,
	        @RequestParam(required = false) String medicine_category,
	        @PathVariable Long pharmacyId,
	        @RequestHeader("Authorization") String jwt) throws Exception {
	    
	    User user = userService.findUserByJwtToken(jwt);
	    List<Medicine> medicines = medicineService.getPharmacyMedicine(pharmacyId, vegetarian, seasonal, medicine_category);
	    return new ResponseEntity<>(medicines, HttpStatus.OK);
	}
	
	@PutMapping("/{id}/availability")
	public ResponseEntity<Medicine> updateMedicineAvailability(
			@PathVariable Long id,
			@RequestHeader("Authorization") String jwt) throws Exception {
		
		User user = userService.findUserByJwtToken(jwt);
		Medicine medicine = medicineService.updateAvailabilityStatus(id);
		return new ResponseEntity<>(medicine, HttpStatus.OK);
	}
}