package com.ortiz.Proyecto.service;

import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.dto.DatosRegistroUsuario;
import com.ortiz.Proyecto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Lista todos los usuarios (sin contraseña — el @JsonIgnore en el modelo la oculta)
     */
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    /** Crea un nuevo usuario con la contraseña encriptada en BCrypt */
    public Usuario registrar(DatosRegistroUsuario datos) {
        if (usuarioRepository.findByUsuario(datos.usuario()).isPresent()) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso: " + datos.usuario());
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombre(datos.nombre());
        nuevo.setUsuario(datos.usuario());
        nuevo.setContraseña(passwordEncoder.encode(datos.contraseña()));
        nuevo.setRol(datos.rol());

        return usuarioRepository.save(nuevo);
    }

    /**
     * Actualiza nombre, usuario y rol.
     * Si se proporciona contraseña no vacía, también la actualiza (re-encriptada).
     */
    public Usuario actualizar(Long id, DatosRegistroUsuario datos) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));

        // Verificar que el nuevo username no lo use otro usuario
        usuarioRepository.findByUsuario(datos.usuario()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("El nombre de usuario ya está en uso: " + datos.usuario());
            }
        });

        u.setNombre(datos.nombre());
        u.setUsuario(datos.usuario());
        u.setRol(datos.rol());

        // Solo actualizar contraseña si se proporcionó una nueva
        if (datos.contraseña() != null && !datos.contraseña().isBlank()) {
            u.setContraseña(passwordEncoder.encode(datos.contraseña()));
        }

        return usuarioRepository.save(u);
    }

    /** Elimina un usuario por ID */
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    /**
     * Busca un usuario por su nombre de usuario (login).
     * Usado por AuthController para obtener los datos del usuario autenticado.
     */
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsuario(username);
    }
}
