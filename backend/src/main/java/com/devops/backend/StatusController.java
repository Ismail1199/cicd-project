package com.devops.backend;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class StatusController {

    private int visits = 0;

    @GetMapping("/status")
    public Map<String, Object> status() {

        visits++;

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Backend Running Successfully");

        response.put("visits", visits);

        return response;
    }
}
