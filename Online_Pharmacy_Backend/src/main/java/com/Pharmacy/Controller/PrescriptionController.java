package com.Pharmacy.Controller;

import com.Pharmacy.Service.PrescriptionService;
import com.Pharmacy.model.Prescription;

import jakarta.annotation.Resource;

import java.io.FileNotFoundException;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.AbstractFileResolvingResource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/prescription")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    
        @PostMapping(
            value = "/upload/{orderId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
        )
        public ResponseEntity<?> uploadPrescription(
                @PathVariable Long orderId,
                @RequestPart("file") MultipartFile file,  // Changed from @RequestParam to @RequestPart
                @RequestHeader("Authorization") String jwt) {
            
            try {
                Prescription prescription = prescriptionService.uploadPrescription(orderId, file, jwt);
                return ResponseEntity.status(HttpStatus.CREATED).body(prescription);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                            "error", "Prescription upload failed",
                            "message", e.getMessage(),
                            "timestamp", LocalDateTime.now()
                        ));
            }
        }
    

        @PutMapping(value = "/{prescriptionId}/status", 
                consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePrescriptionStatus(
            @PathVariable Long prescriptionId,
            @RequestBody Map<String, String> requestBody,
            @RequestHeader("Authorization") String jwt) {
        try {
            String status = requestBody.get("status");
            Prescription prescription = prescriptionService.updatePrescriptionStatus(prescriptionId, status, jwt);
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "error", "Failed to update status",
                        "message", e.getMessage(),
                        "timestamp", LocalDateTime.now()
                    ));
        }
    }

//    @GetMapping("/order/{orderId}")
//    public ResponseEntity<Prescription> getPrescriptionByOrderId(
//            @PathVariable Long orderId) throws Exception {
//        Prescription prescription = prescriptionService.getPrescriptionByOrderId(orderId);
//        return new ResponseEntity<>(prescription, HttpStatus.OK);
//    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPrescriptionByOrderId(
            @PathVariable Long orderId) {
        try {
            Prescription prescription = prescriptionService.getPrescriptionByOrderId(orderId);
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "error", "Prescription not found",
                        "message", e.getMessage(),
                        "timestamp", LocalDateTime.now()
                    ));
        }
    }

    @GetMapping("/download/{prescriptionId}")
    public ResponseEntity<?> downloadPrescription(
            @PathVariable Long prescriptionId,
            @RequestHeader("Authorization") String jwt) {
        try {
            return prescriptionService.downloadPrescription(prescriptionId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "error", "File download failed",
                        "message", e.getMessage(),
                        "timestamp", LocalDateTime.now()
                    ));
        }
    }

//     @GetMapping("/view/{prescriptionId}")
// public ResponseEntity<Resource> viewPrescription(
//         @PathVariable Long prescriptionId,
//         @RequestHeader("Authorization") String jwt) throws Exception {
    
//     Prescription prescription = prescriptionService.getPrescriptionById(prescriptionId);
//     Path filePath = Paths.get(prescription.getFilePath()).normalize();
//     Resource resource = (Resource) new UrlResource(filePath.toUri());

//     if (!((AbstractFileResolvingResource) resource).exists()) {
//         throw new FileNotFoundException("File not found: " + prescription.getFileName());
//     }

//     return ResponseEntity.ok()
//             .contentType(MediaType.IMAGE_JPEG) // or determine dynamically
//             .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + prescription.getFileName() + "\"")
//             .body(resource);
// }

    @GetMapping("/view/{prescriptionId}")
    public ResponseEntity<org.springframework.core.io.Resource> viewPrescription(
            @PathVariable Long prescriptionId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            return prescriptionService.viewPrescription(prescriptionId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    
}