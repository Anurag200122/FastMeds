package com.Pharmacy.Request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateEventRequest {
    private String name;
    private String location;
    private String image;
    private LocalDateTime startedAt;
    private LocalDateTime endsAt;
}