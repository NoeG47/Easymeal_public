// src/main/java/com/easymeal/service/IngredienteService.java
package com.easymeal.service;

import com.easymeal.model.Ingrediente;
import com.easymeal.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredienteService {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    public List<Ingrediente> obtenerTodosLosIngredientes() {
        return ingredienteRepository.findAll();
    }

    public Optional<Ingrediente> obtenerIngredientePorId(Long id) {
        return ingredienteRepository.findById(id);
    }

    public Ingrediente crearIngrediente(Ingrediente ingrediente) {
        if (ingrediente.getNombre() == null || ingrediente.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del ingrediente no puede estar vacío");
        }
        if (ingredienteRepository.existsByNombre(ingrediente.getNombre())) {
            throw new IllegalArgumentException("El ingrediente ya existe");
        }
        return ingredienteRepository.save(ingrediente);
    }

    public void eliminarIngrediente(Long id) {
        if (!ingredienteRepository.existsById(id)) {
            throw new IllegalArgumentException("El ingrediente no existe");
        }
        ingredienteRepository.deleteById(id);
    }
}
