package com.easymeal.repository;

import com.easymeal.model.Receta;
import com.easymeal.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecetaRepository extends JpaRepository<Receta, Long> {
    List<Receta> findByUsuario(Usuario usuario);
}
