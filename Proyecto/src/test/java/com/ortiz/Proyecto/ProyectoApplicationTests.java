package com.ortiz.Proyecto;

import com.ortiz.Proyecto.domain.Usuario;
import com.ortiz.Proyecto.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class ProyectoApplicationTests {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void contextLoads() {
		Usuario admin = usuarioRepository.findByUsuario("admin")
				.orElseThrow(() -> new RuntimeException("Usuario admin no encontrado"));
		admin.setContraseña(passwordEncoder.encode("admin123"));
		usuarioRepository.save(admin);
		System.out.println("====== PASSWORD FOR admin UPDATED TO admin123 ======");
	}

}
