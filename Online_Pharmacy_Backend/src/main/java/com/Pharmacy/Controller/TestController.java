package com.Pharmacy.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
	
	@GetMapping("/test")
    public String getTestMessage() {
        return "Hello, this is a test message!";
    }

}
