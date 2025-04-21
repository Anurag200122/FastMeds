package com.Pharmacy.Service;

import com.Pharmacy.model.Prescription;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface PrescriptionService {
    Prescription uploadPrescription(Long orderId, MultipartFile file, String jwt) throws Exception;
    Prescription updatePrescriptionStatus(Long prescriptionId, String status, String jwt) throws Exception;
    Prescription getPrescriptionByOrderId(Long orderId) throws Exception;
    ResponseEntity<Resource> downloadPrescription(Long prescriptionId) throws Exception;

    ResponseEntity<org.springframework.core.io.Resource> viewPrescription(Long prescriptionId) throws Exception;
    Prescription getPrescriptionById(Long prescriptionId) throws Exception;
}