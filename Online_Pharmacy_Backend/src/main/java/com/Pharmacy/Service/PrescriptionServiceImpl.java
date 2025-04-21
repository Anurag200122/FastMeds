package com.Pharmacy.Service;

import com.Pharmacy.model.Order;
import com.Pharmacy.model.Prescription;
import com.Pharmacy.model.USER_ROLE;
import com.Pharmacy.model.User;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import com.Pharmacy.Repository.PrescriptionRepository;
import com.Pharmacy.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    private final Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @Override
    @Transactional
    public Prescription uploadPrescription(Long orderId, MultipartFile file, String jwt) throws Exception {
        // 1. Authentication and validation
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new SecurityException("Invalid authentication");
        }

        // 2. Fetch and validate order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        
        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized order access");
        }

        if (!"PENDING".equals(order.getOrderStatus())) {
            throw new IllegalStateException("Order must be in PENDING status");
        }

        // 3. Handle file upload
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String storageFilename = "rx_" + orderId + "_" + Instant.now().toEpochMilli() + fileExtension;
        
        Path destination = uploadPath.resolve(storageFilename).normalize();
        if (!destination.getParent().equals(uploadPath.toAbsolutePath())) {
            throw new IOException("Invalid file storage path");
        }

        try (InputStream is = file.getInputStream()) {
            Files.copy(is, destination, StandardCopyOption.REPLACE_EXISTING);
        }

        // 4. Create and link prescription
        Prescription prescription = new Prescription();
        prescription.setFileName(originalFilename);
        prescription.setFilePath(destination.toString());
        prescription.setStatus("PENDING");
        prescription.setUploadedAt(new Date());
        
        // Critical bidirectional linking
        prescription.setOrder(order);  // Sets order_id in prescriptions table
        order.setPrescription(prescription);  // Sets prescription_id in orders table
        
        // 5. Persist changes
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        orderRepository.save(order);

        // 6. Verify persistence
        if (savedPrescription.getId() == null || order.getPrescription() == null) {
            throw new PersistenceException("Failed to establish relationship");
        }

        return savedPrescription;
    }

    @Override
    public Prescription updatePrescriptionStatus(Long prescriptionId, String status, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        
        if (!user.getRole().equals(USER_ROLE.ROLE_PHARMACIST)) {
            throw new Exception("Only pharmacists can update prescription status");
        }

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new Exception("Prescription not found with id: " + prescriptionId));

        if (!List.of("APPROVED", "REJECTED", "PENDING").contains(status)) {
            throw new Exception("Invalid status value");
        }

        prescription.setStatus(status);
        return prescriptionRepository.save(prescription);
    }

    @Override
    public Prescription getPrescriptionByOrderId(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));
        
        if (order.getPrescription() == null) {
            throw new Exception("No prescription found for order id: " + orderId);
        }
        return order.getPrescription();
    }

    // @Override
    // public ResponseEntity<Resource> downloadPrescription(Long prescriptionId) throws Exception {
    //     Prescription prescription = prescriptionRepository.findById(prescriptionId)
    //             .orElseThrow(() -> new EntityNotFoundException("Prescription not found"));
        
    //     Path filePath = Paths.get(prescription.getFilePath()).normalize();
    //     Resource resource = new UrlResource(filePath.toUri());
        
    //     if (!resource.exists()) {
    //         throw new IOException("File not found: " + prescription.getFileName());
    //     }
        
    //     String contentType = "application/octet-stream";
    //     String headerValue = "attachment; filename=\"" + prescription.getFileName() + "\"";
        
    //     return ResponseEntity.ok()
    //             .contentType(MediaType.parseMediaType(contentType))
    //             .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
    //             .body(resource);
    // }

    @Override
    public ResponseEntity<Resource> downloadPrescription(Long prescriptionId) throws Exception {
        Prescription prescription = getPrescriptionById(prescriptionId);
        Path filePath = Paths.get(prescription.getFilePath()).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        
        if (!resource.exists()) {
            throw new FileNotFoundException("File not found: " + prescription.getFileName());
        }

        // Sanitize filename
        String sanitizedFilename = sanitizeFilename(prescription.getFileName());
        
        // Determine content type
        String contentType = determineContentType(sanitizedFilename);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + sanitizedFilename + "\"; filename*=UTF-8''" + 
                    URLEncoder.encode(sanitizedFilename, StandardCharsets.UTF_8.toString()))
                .body(resource);
    }

private String sanitizeFilename(String filename) {
    // Remove path traversal and special characters
    return filename.replaceAll("[^a-zA-Z0-9.-]", "_");
}

private String determineContentType(String filename) {
    String extension = StringUtils.getFilenameExtension(filename).toLowerCase();
    switch (extension) {
        case "pdf": return "application/pdf";
        case "jpg": case "jpeg": return "image/jpeg";
        case "png": return "image/png";
        default: return "application/octet-stream";
    }
}



    @Override
    public ResponseEntity<org.springframework.core.io.Resource> viewPrescription(Long prescriptionId) throws Exception {
        Prescription prescription = getPrescriptionById(prescriptionId);
        Path filePath = Paths.get(prescription.getFilePath()).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        
        if (!resource.exists()) {
            throw new FileNotFoundException("File not found: " + prescription.getFileName());
        }

        // Determine content type dynamically
        String contentType = determineContentType(prescription.getFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "inline; filename=\"" + prescription.getFileName() + "\"")
                .body(resource);
    }

    @Override
    public Prescription getPrescriptionById(Long prescriptionId) throws Exception {
        return prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new EntityNotFoundException("Prescription not found"));
    }

    
}