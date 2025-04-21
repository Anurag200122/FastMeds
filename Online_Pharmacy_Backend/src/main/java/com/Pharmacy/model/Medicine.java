package com.Pharmacy.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Medicine {
	

	@Id
	@GeneratedValue(strategy= GenerationType.AUTO)
	private Long id;
	
	private String description;
	
	private Long price;
	
	private String name;
	
	@ManyToOne
	private Category medicineCategory;
	
	@Column(length=1000)
	@ElementCollection
	private List<String> images;
	
	
	private boolean available;
	
	@ManyToOne
	private Pharmacy pharmacy;
	
	
	private boolean isVegetarian;
	private boolean isseasonal;
	
	@ManyToMany
	private List<DossageLevel> dossage= new ArrayList<>();
	
	
	private Date manufacturingDate;
	
	
	
	
	

}
