package com.Pharmacy.Controller;

import java.util.Enumeration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Config.JwtProvider;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.User;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtProvider jwtProvider;

    @GetMapping("/profile")
    public ResponseEntity<?> findUserByJwtToken(HttpServletRequest request, @RequestHeader(value = "Authorization", required = false) String jwt) {
        System.out.println("Incoming Headers:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println(headerName + ": " + request.getHeader(headerName));
        }

        if (jwt == null) {
            System.err.println("Authorization header is missing or null");
            return new ResponseEntity<>("Authorization header is missing", HttpStatus.BAD_REQUEST);
        }

        try {
            // Validate the token format
           

            // Extract and trim the token
            jwt = jwt.substring(7).trim(); // Remove "Bearer " prefix and trim any extra spaces

            // Extract email from the token
         

            // Find the user by email
            User user = userService.findUserByJwtToken(jwt);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            // Return the user profile
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            // Handle invalid or expired tokens
            System.err.println("Invalid or expired token: " + ex.getMessage());
            return new ResponseEntity<>("Invalid or expired token: " + ex.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            // Handle other exceptions (e.g., database errors)
            System.err.println("An error occurred: " + ex.getMessage());
            return new ResponseEntity<>("An error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}