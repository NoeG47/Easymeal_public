// src/main/java/com/easymeal/repository/UsuarioRepository.java
package com.easymeal.repository;

import com.easymeal.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByFirebaseUid(String firebaseUid);
    Usuario findByCorreo(String correo);
}
