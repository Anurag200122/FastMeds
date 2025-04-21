package com.Pharmacy.Config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class AppConfig {

//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        
//        System.out.println("Building Http start");
//
//        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//            .authorizeHttpRequests(Authorize -> Authorize
//                .requestMatchers("/api/admin/**").hasAnyRole("PHARMACIST")
//                .requestMatchers("/api/**").authenticated()
//                .anyRequest().permitAll())
//            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
//            .csrf(csrf -> csrf.disable())
//            .cors(cors -> cors.configurationSource(corsConfiguationSource()));
//        
//        
//        
//        System.out.println("Building http end");
//        return http.build();
//    }
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Building Http start");

        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(Authorize -> Authorize
                .requestMatchers("/api/admin/**").hasAnyRole("PHARMACIST")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll())
            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        System.out.println("Building http end");
        return http.build(); // Add a breakpoint here
    }

//    private CorsConfigurationSource corsConfiguationSource() {
//    	
//        return new CorsConfigurationSource() {
//        	
//            @Override
//            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//            	CorsConfiguration configuration = new CorsConfiguration();
//                configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow only specific origins
//                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Explicitly allow methods
//                configuration.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
//                configuration.setExposedHeaders(Arrays.asList("Authorization")); // Expose specific headers
//                configuration.setAllowCredentials(true); // Allow credentials
//                configuration.setMaxAge(3600L); // Cache preflight requests for 1 hour
//
//                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//                source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
//                return source;
//            }
//        };
//    }
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow only specific origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Explicitly allow methods
        configuration.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Expose specific headers
        configuration.setAllowCredentials(true); // Allow credentials
        configuration.setMaxAge(3600L); // Cache preflight requests for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
        return source;
    }
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
