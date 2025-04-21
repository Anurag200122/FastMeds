package com.Pharmacy.Config;

import java.io.IOException;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenValidator extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {
	    String jwt = request.getHeader(JwtConstant.JWT_HEADER);

	    if (jwt != null && jwt.startsWith("Bearer ")) {
	        jwt = jwt.substring(7); // Remove "Bearer " prefix

	        System.out.println("Incoming JWT Token: " + jwt); // Log the incoming token

	        try {
	            SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
	            Claims claims = Jwts.parserBuilder()
	                    .setSigningKey(key)
	                    .build()
	                    .parseClaimsJws(jwt)
	                    .getBody();

	            System.out.println("Claims: " + claims); // Log the claims

	            String email = String.valueOf(claims.get("email"));
	            String authorities = String.valueOf(claims.get("authorities"));

	            System.out.println("Extracted Email: " + email); // Log the extracted email
	            System.out.println("Extracted Authorities: " + authorities); // Log the extracted authorities

	            List<GrantedAuthority> auth = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
	            Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auth);
	            SecurityContextHolder.getContext().setAuthentication(authentication);

	            System.out.println("Valid Token: " + jwt); // Log the valid token
	        } catch (Exception ex) {
	            System.err.println("Invalid Token: " + ex.getMessage()); // Log the error
	            ex.printStackTrace(); // Print the full stack trace for debugging

	            // Return a 401 Unauthorized response
	            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	            response.getWriter().write("Invalid Token: " + ex.getMessage());
	            return; // Stop further processing
	        }
	    } else {
	        System.out.println("No JWT Token found in the request."); // Log if no token is found
	    }

	    // Ensure the request proceeds
	    filterChain.doFilter(request, response);
	}
}