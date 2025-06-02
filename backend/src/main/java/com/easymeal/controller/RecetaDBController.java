package com.easymeal.controller;

import com.easymeal.model.Receta;
import com.easymeal.model.Usuario;
import com.easymeal.repository.RecetaRepository;
import com.easymeal.repository.UsuarioRepository;
import com.easymeal.dto.RecetaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/recetas") // misma base pero diferentes métodos
@CrossOrigin(origins = "http://localhost:5173")
public class RecetaDBController {

    @Autowired
    private RecetaRepository recetaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // POST /api/recetas/guardar
    @PostMapping("/guardar")
    public String guardarReceta(@RequestBody RecetaRequest request) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(request.getFirebase_uid());
        if (usuario == null) {
            return "Usuario no encontrado";
        }

        Receta receta = new Receta();
        receta.setTitulo(request.getTitulo());
        receta.setContenido(request.getContenido());
        receta.setUsuario(usuario);

        recetaRepository.save(receta);
        return "Receta guardada correctamente";
    }

    @GetMapping("/listar")
    public List<Receta> listarRecetasPorUsuario(@RequestParam("firebase_uid") String firebase_uid) {
        Usuario usuario = usuarioRepository.findByFirebaseUid(firebase_uid);
        if (usuario == null) {
            return Collections.emptyList();
        }

        return recetaRepository.findByUsuario(usuario);
    }

    @DeleteMapping("/eliminar/{id}")
    public String eliminarReceta(@PathVariable("id") Long id,
            @RequestParam("firebase_uid") String firebase_uid) {

        Usuario usuario = usuarioRepository.findByFirebaseUid(firebase_uid);
        if (usuario == null) {
            return "Usuario no encontrado";
        }

        Receta receta = recetaRepository.findById(id).orElse(null);
        if (receta == null) {
            return "Receta no encontrada";
        }

        if (!receta.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            return "No tienes permiso para eliminar esta receta";
        }

        recetaRepository.deleteById(id);
        return "Receta eliminada correctamente";
    }

}
