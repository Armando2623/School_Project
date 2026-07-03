package com.ortiz.Proyecto.security;

import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 Carga el usuario desde la BD para que Spring Security pueda autenticarlo.
  Busca por el campo `usuario` (nombre de usuario / login).
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Mapear el rol del enum a un GrantedAuthority con prefijo ROLE_
        String rol = "ROLE_" + usuario.getRol().name();

        return new org.springframework.security.core.userdetails.User(
                usuario.getUsuario(),
                usuario.getContraseña(),
                List.of(new SimpleGrantedAuthority(rol)));
    }
}
