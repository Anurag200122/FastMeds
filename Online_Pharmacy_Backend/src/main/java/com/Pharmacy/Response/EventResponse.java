package com.Pharmacy.Response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Long id;
    private String name;
    private String location;
    private String image;
    private String startedAt;  // Consider using ISO format
    private String endsAt;
    private String createdAt;
}