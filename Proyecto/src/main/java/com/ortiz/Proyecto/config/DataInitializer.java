package com.ortiz.Proyecto.config;

import com.ortiz.Proyecto.domain.Rol;
import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/*
  Crea un usuario ADMINISTRADOR por defecto al arrancar la aplicación,
  solo si aún no existe ningún usuario con ese username.

  Credenciales iniciales:
    usuario: admin
    contraseña: admin123

 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByUsuario("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setUsuario("admin");
            admin.setContraseña(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMINISTRADOR);

            usuarioRepository.save(admin);
            System.out.println("[SchoolGuard]  Usuario admin creado → usuario: admin / contraseña: admin123");
        } else {
            System.out.println("[SchoolGuard] ️  Usuario admin ya existe, omitiendo creación.");
        }
    }
}
