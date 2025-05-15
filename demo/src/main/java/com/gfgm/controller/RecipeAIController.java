package com.gfgm.controller;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class RecipeAIController {

    private final RestTemplate restTemplate = new RestTemplate();

//    @PostMapping("/predict")
//    public ResponseEntity<?> getAIPrediction(@RequestBody Map<String, Object> body) {
//        String flaskUrl = "http://localhost:5000/predict"; // Flask server
//        try {
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//            ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, request, String.class);
//            return ResponseEntity.ok().body(response.getBody());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error contacting AI model");
//        }
//    }
    @PostMapping("/predict")
    public ResponseEntity<?> getAIPrediction(@RequestBody Map<String, Object> body) {
        String flaskUrl = "http://localhost:5000/predict";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error contacting AI model");
        }
    }

}
