package com.Pharmacy.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Request.CreateEventRequest;
import com.Pharmacy.Request.createPharmacyRequest;
import com.Pharmacy.Response.EventResponse;
import com.Pharmacy.Response.MessageResponse;
import com.Pharmacy.Service.EventService;
import com.Pharmacy.Service.PharmacyService;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.Pharmacy;
import com.Pharmacy.model.User;
import com.Pharmacy.model.Event;


@RestController
@RequestMapping("/api/admin/pharmacy")
public class AdminController {
	
	@Autowired
	private PharmacyService pharmacyService;
	
	@Autowired
	private UserService userService;
	
	 @Autowired
	 private EventService eventService;
	
	
	@PostMapping()
	public ResponseEntity<Pharmacy> createPharmacy(
		@RequestBody createPharmacyRequest req,
		@RequestHeader("Authorization") String jwt) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Pharmacy pharmacy=pharmacyService.createPharmacy(req, user);
		return new ResponseEntity<>(pharmacy, HttpStatus.CREATED);
	}
	
	
	@PutMapping("/{id}")
	public ResponseEntity<Pharmacy> updatePharmacy(
		@RequestBody createPharmacyRequest req,
		@RequestHeader("Authorization") String jwt,
		@PathVariable Long id) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Pharmacy pharmacy=pharmacyService.updatePharmacy(id, req);
		return new ResponseEntity<>(pharmacy, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<MessageResponse> deletePharmacy(
		
		@RequestHeader("Authorization") String jwt
		,@PathVariable Long id) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		pharmacyService.deletePharmacy(id);
		
		MessageResponse res=new MessageResponse();
		res.setMessage("Pharmacy deleted Successfully");
		return new ResponseEntity<>(res, HttpStatus.OK);
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<Pharmacy> updatePharmacyStatus(
		
		@RequestHeader("Authorization") String jwt
		,@PathVariable Long id) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Pharmacy pharmacy=pharmacyService.updatePharmacyStatus(id);
		return new ResponseEntity<>(pharmacy, HttpStatus.OK);
		
	}
	
	@GetMapping("/user")
	public ResponseEntity<Pharmacy> findPharmacyByUserId(
		
		@RequestHeader("Authorization") String jwt
		) throws Exception{
		
		User user=userService.findUserByJwtToken(jwt);
		
		Pharmacy pharmacy=pharmacyService.getPharmacyByUserId(user.getId());
		return new ResponseEntity<>(pharmacy, HttpStatus.OK);
		
	}
	
	@PostMapping("/event")
	public ResponseEntity<EventResponse> createEvent(
	    @RequestBody CreateEventRequest req,
	    @RequestHeader("Authorization") String jwt,
	    @PathVariable Long pharmacyId) throws Exception {
	    
	    User user = userService.findUserByJwtToken(jwt);
	    Pharmacy pharmacy = pharmacyService.findPharmacyById(pharmacyId);
	    
	    Event event = eventService.createEvent(req, pharmacy);
	    
	    EventResponse res = new EventResponse();
	    res.setId(event.getId());
	    res.setName(event.getName());
	    res.setLocation(event.getLocation());
	    res.setImage(event.getImage());
	    
	    // Handle null dates
	    res.setStartedAt(event.getStartedAt() != null ? event.getStartedAt().toString() : null);
	    res.setEndsAt(event.getEndsAt() != null ? event.getEndsAt().toString() : null);
	    res.setCreatedAt(event.getCreatedAt() != null ? event.getCreatedAt().toString() : null);
	    
	    return new ResponseEntity<>(res, HttpStatus.CREATED);
	}

	 @GetMapping("/event/{pharmacyId}")
	    public ResponseEntity<List<Event>> getPharmacyEvents(
	        @RequestHeader("Authorization") String jwt,
	        @PathVariable Long pharmacyId) throws Exception {
	        

		    System.out.println("Received request for pharmacy ID: " + pharmacyId);
		    System.out.println("JWT: " + jwt);
	        // Verify user and pharmacy
	        User user = userService.findUserByJwtToken(jwt);
	        Pharmacy pharmacy = pharmacyService.findPharmacyById(pharmacyId);
	        
	        // Get events
	        List<Event> events = eventService.getEventsByPharmacyId(pharmacyId);
	        
	        return new ResponseEntity<>(events, HttpStatus.OK);
	    }

    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<MessageResponse> deleteEvent(
        @RequestHeader("Authorization") String jwt,
        @PathVariable Long eventId) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        EventResponse event = eventService.deleteEvent(eventId);
        
        MessageResponse res = new MessageResponse();
        res.setMessage("Event '"+event.getName()+"' deleted successfully");
        
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
	
	

}
