package com.Pharmacy.Config;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

    private SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public String generatedToken(Authentication auth) {
        System.out.println("Generating JWT token for user: " + auth.getName()); // Log the user

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);

        System.out.println("User roles: " + roles); // Log the user roles

        String jwt = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000)) // 24 hours
                .claim("email", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();

        System.out.println("Generated JWT token: " + jwt); // Log the generated token

        return jwt;
    }

    public String getEmailFromJwtToken(String jwt) {
        System.out.println("Extracting email from JWT token: " + jwt); // Log the incoming token

        if (jwt == null) {
            System.err.println("Invalid or missing JWT token"); // Log invalid token
            throw new IllegalArgumentException("Invalid or missing JWT token");
        }
        if(jwt.startsWith("Bearer")) {
        jwt = jwt.substring(7); // Remove "Bearer " prefix
        System.out.println("JWT token after removing 'Bearer ' prefix: " + jwt); // Log the cleaned token
        }
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            String email = String.valueOf(claims.get("email"));
            System.out.println("Extracted email: " + email); // Log the extracted email

            return email;
        } catch (Exception ex) {
            System.err.println("Failed to extract email from JWT token: " + ex.getMessage()); // Log the error
            ex.printStackTrace(); // Print the full stack trace for debugging
            throw new IllegalArgumentException("Invalid JWT token", ex);
        }
        
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();

        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }

        return String.join(",", auths);
    }
}