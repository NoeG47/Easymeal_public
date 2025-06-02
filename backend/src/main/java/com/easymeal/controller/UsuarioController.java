// src/main/java/com/easymeal/controller/UsuarioController.java
package com.easymeal.controller;

import com.easymeal.model.Usuario;
import com.easymeal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear usuario
    @PostMapping("/crear")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Map<String, String> body) {
        String firebaseUid = body.get("firebaseUid");
        String nombre = body.get("nombre");
        String correo = body.get("correo");

        if (firebaseUid == null || nombre == null || correo == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Usuario nuevoUsuario = new Usuario(firebaseUid, nombre, correo);
        Usuario usuarioCreado = usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok(usuarioCreado);
    }

    // Verificar conexión
    @GetMapping("/prueba")
    public ResponseEntity<String> pruebaConexion() {
        return ResponseEntity.ok("Conexión exitosa a /api/usuarios");
    }

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{firebaseUid}")
    public ResponseEntity<Usuario> obtenerUsuarioPorFirebaseUid(@PathVariable("firebaseUid") String firebaseUid) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    // Actualizar nombre
    @PutMapping("/{firebaseUid}/nombre")
    public ResponseEntity<Usuario> actualizarNombre(
            @PathVariable("firebaseUid") String firebaseUid,
            @RequestBody Map<String, String> body) {

        String nuevoNombre = body.get("nombre");
        if (nuevoNombre == null || nuevoNombre.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuario = usuarioRepository.findByFirebaseUid(firebaseUid);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        usuario.setNombre(nuevoNombre);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        return ResponseEntity.ok(usuarioActualizado);
    }
}
