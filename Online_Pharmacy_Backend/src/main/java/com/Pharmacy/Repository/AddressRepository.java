package com.Pharmacy.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Pharmacy.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long>{

}
