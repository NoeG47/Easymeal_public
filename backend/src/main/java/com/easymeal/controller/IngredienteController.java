// src/main/java/com/easymeal/controller/IngredienteController.java
package com.easymeal.controller;

import com.easymeal.model.Ingrediente;
import com.easymeal.service.IngredienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ingredientes")
@CrossOrigin(origins = "http://localhost:5173")
public class IngredienteController {

    @Autowired
    private IngredienteService ingredienteService;

    @GetMapping
    public ResponseEntity<List<Ingrediente>> obtenerTodosLosIngredientes() {
        return ResponseEntity.ok(ingredienteService.obtenerTodosLosIngredientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingrediente> obtenerIngredientePorId(@PathVariable Long id) {
        Optional<Ingrediente> ingrediente = ingredienteService.obtenerIngredientePorId(id);
        return ingrediente.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearIngrediente(@RequestBody Ingrediente ingrediente) {
        try {
            Ingrediente nuevoIngrediente = ingredienteService.crearIngrediente(ingrediente);
            return ResponseEntity.ok(nuevoIngrediente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarIngrediente(@PathVariable Long id) {
        ingredienteService.eliminarIngrediente(id);
        return ResponseEntity.noContent().build();
    }
}
