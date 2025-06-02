package com.easymeal.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recetas")
@CrossOrigin(origins = "http://localhost:5173")
public class RecetaController {

    @Value("${spring.ai.openai.api-key}")
    private String openaiApiKey;

    @PostMapping
    public ResponseEntity<Map<String, String>> generarReceta(@RequestBody Map<String, String> body) {
        try {
            String ingredientes = body.get("ingredientes");

            // Crear el mensaje para OpenAI
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "gpt-3.5-turbo");
            payload.put("temperature", 0.5);
            payload.put("messages", new Object[] {
                    Map.of("role", "system", "content",
                            "Eres un chef experto que solo responde con recetas completas y detalladas."),
                    Map.of("role", "user", "content", "Dame una receta con " + ingredientes)
            });

            // Configurar los headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            // Enviar la solicitud a OpenAI
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();
            String apiUrl = "https://api.openai.com/v1/chat/completions";

            ResponseEntity<Map> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, Map.class);

            // Extraer solo el contenido del asistente
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");

                // Extraer el contenido del primer choice
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                String receta = (String) message.get("content");

                // Devolver solo el contenido limpio
                Map<String, String> resultado = new HashMap<>();
                resultado.put("receta", receta.trim());
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Respuesta inesperada del servidor OpenAI."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo generar la receta."));
        }
    }
}
