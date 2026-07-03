import { authApi } from '../api/auth.js';
import { store }   from '../auth/store.js';
import { toast }   from '../components/toast.js';

export function renderLogin(container) {
  container.innerHTML = `
    <div class="login-wrapper">

      <!-- Logo y título sobre la card -->
      <div class="login-brand">
        <div class="l-app-icon"><i class="fas fa-school"></i></div>
        <h1 style="font-family: 'Georgia', serif;">ViraSchool</h1>
        <p>Sistema de Registro de Visitas</p>
      </div>

      <!-- Card blanca con el formulario -->
      <div class="login-card">
        <div class="login-card-title">
          <i class="fas fa-sign-in-alt lct-icon"></i> Iniciar Sesión
        </div>
        <hr class="login-divider" />

        <div class="login-error" id="login-error">
          <span>⚠️</span><span id="error-msg">Credenciales inválidas</span>
        </div>

        <form id="login-form" novalidate>

          <div class="login-field">
            <div class="login-field-label">
              <i class="fas fa-user lfl-icon"></i> Usuario
            </div>
            <div class="login-input-wrap">
              <input id="l-user" type="text"
                     placeholder="Ej: jperez"
                     autocomplete="username" required />
            </div>
          </div>

          <div class="login-field">
            <div class="login-field-label">
              <i class="fas fa-lock lfl-icon"></i> Contraseña
            </div>
            <div class="login-input-wrap">
              <input id="l-pass" type="password"
                     placeholder="........"
                     autocomplete="current-password" required />
              <button type="button" class="l-eye" id="eye-btn"><i class="fas fa-eye"></i></button>
            </div>
          </div>

          <button type="submit" class="btn-login" id="login-btn">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
          </button>

        </form>
      </div>

      <div class="login-footer">© 2026 SchoolGuard - Acceso restringido al personal autorizado</div>
    </div>`;

  const form   = container.querySelector('#login-form');
  const btn    = container.querySelector('#login-btn');
  const eye    = container.querySelector('#eye-btn');
  const pass   = container.querySelector('#l-pass');
  const errBox = container.querySelector('#login-error');
  const errMsg = container.querySelector('#error-msg');

  eye.addEventListener('click', () => {
    const show = pass.type === 'password';
    pass.type = show ? 'text' : 'password';
    eye.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.classList.remove('show');

    const usuario    = container.querySelector('#l-user').value.trim();
    const contraseña = pass.value;

    if (!usuario || !contraseña) {
      errMsg.textContent = 'Completa todos los campos';
      errBox.classList.add('show'); return;
    }

    btn.disabled = true;
    btn.textContent = 'Ingresando…';

    try {
      const data = await authApi.login(usuario, contraseña);
      store.save(data);
      window.location.hash = '#/dashboard';
    } catch (err) {
      errMsg.textContent = err.message || 'Credenciales inválidas';
      errBox.classList.add('show');
      toast(errMsg.textContent, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }
  });
}
