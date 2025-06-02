// src/main/java/com/easymeal/repository/IngredienteRepository.java
package com.easymeal.repository;

import com.easymeal.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    boolean existsByNombre(String nombre);
}
