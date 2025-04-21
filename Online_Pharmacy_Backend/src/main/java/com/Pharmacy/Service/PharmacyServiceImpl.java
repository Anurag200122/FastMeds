package com.Pharmacy.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Dto.PharmacyDto;
import com.Pharmacy.Repository.AddressRepository;
import com.Pharmacy.Repository.PharmacyRepository;
import com.Pharmacy.Repository.UserRepository;
import com.Pharmacy.Request.createPharmacyRequest;
import com.Pharmacy.model.Address;
import com.Pharmacy.model.Pharmacy;
import com.Pharmacy.model.User;

@Service
public class PharmacyServiceImpl implements PharmacyService {
	
	@Autowired
	private PharmacyRepository pharmacyRepository;
	
	@Autowired
	private AddressRepository addressRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	
	
	
	

	@Override
	public Pharmacy createPharmacy(createPharmacyRequest req, User user) {
		
		
		Address address =addressRepository.save(req.getAddress());
		
		Pharmacy pharmacy= new Pharmacy();
		pharmacy.setAddress(address);
		pharmacy.setContactInfo(req.getContactInfo());
		pharmacy.setMadeIn(req.getMadeIn());
		pharmacy.setDescription(req.getDescription());
		pharmacy.setImages(req.getImages());
		pharmacy.setName(req.getName());
		pharmacy.setOpeningHours(req.getOpeningHours());
		pharmacy.setGoogleMaps(req.getGoogleMaps());
		pharmacy.setRegistrationDate(LocalDateTime.now());
		pharmacy.setOwner(user);
		
		return pharmacyRepository.save(pharmacy);
	}

	@Override
	public Pharmacy updatePharmacy(Long pharmacyId, createPharmacyRequest updatePharmacy) throws Exception {
		
		Pharmacy pharmacy=findPharmacyById(pharmacyId);
		
		if(pharmacy.getMadeIn()!=null) {
			pharmacy.setMadeIn(updatePharmacy.getMadeIn());
		}
		if(pharmacy.getDescription()!=null) {
			pharmacy.setDescription(updatePharmacy.getDescription());
		}
		if(pharmacy.getName()!=null) {
			pharmacy.setName(updatePharmacy.getName());
		}
		return pharmacyRepository.save(pharmacy);
	}

	@Override
	public void deletePharmacy(Long pharmacyId) throws Exception {
		
		Pharmacy pharmacy=findPharmacyById(pharmacyId);
		
		 pharmacyRepository.delete(pharmacy);
	}

	@Override
	public List<Pharmacy> getAllPharmacy() {
		
		return pharmacyRepository.findAll();
	}

	@Override
	public List<Pharmacy> searchPharmacy(String keyword) {
		
		
		return pharmacyRepository.findBySearchQuery(keyword);
	}

	@Override
	public Pharmacy findPharmacyById(Long id) throws Exception {
		
		Optional<Pharmacy> opt=pharmacyRepository.findById(id);
		
		if(opt.isEmpty()) {
			throw new Exception("Pharmacy not found with id "+id);
		}
		return opt.get();
	}

	@Override
	public Pharmacy getPharmacyByUserId(Long userId) throws Exception {
		
		Pharmacy pharmacy=pharmacyRepository.findByOwnerId(userId);
		if(userId==null) {
			throw new Exception("Pharmacy not found with owner id:"+userId);
		}
		return pharmacy;
	}

	@Override
	public PharmacyDto addToFavorites(Long pharmacyId, User user) throws Exception {
		
		Pharmacy pharmacy= findPharmacyById(pharmacyId);
		
		PharmacyDto dto=new PharmacyDto();
		dto.setDescription(pharmacy.getDescription());
		dto.setImages(pharmacy.getImages());
		dto.setTitle(pharmacy.getName());
		dto.setId(pharmacyId);
		
		boolean isFavorited = false;
		List<PharmacyDto> favorites= user.getFavorites();		
		for(PharmacyDto favorite: favorites) {
			if(favorite.getId().equals(pharmacyId)) {
				isFavorited=true;
				break;
			}
			
		}
		
		if(isFavorited) {
			favorites.removeIf(favorite -> favorite.getId().equals(pharmacyId));
			
		}else {
			favorites.add(dto);
		}
		
		
		
		userRepository.save(user);		
		return dto;
	}

	@Override
	public Pharmacy updatePharmacyStatus(Long id) throws Exception {
		
		Pharmacy pharmacy= findPharmacyById(id);
		pharmacy.setOpen(!pharmacy.isOpen());
		
		return pharmacyRepository.save(pharmacy);
	}

	
	
}
