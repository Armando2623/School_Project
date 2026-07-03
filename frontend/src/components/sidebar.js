import { store } from '../auth/store.js';

const MENU = [
  {
    section: 'PRINCIPAL',
    items: [
      { icon: 'fas fa-chart-line',    label: 'Dashboard',   hash: '#/dashboard',  roles: null },
      { icon: 'fas fa-clipboard-list', label: 'Visitas',     hash: '#/visitas',    roles: ['ADMINISTRADOR','PORTERO','SECRETARIA','DIRECTOR','PROFESOR'] },
    ]
  },
  {
    section: 'GESTIÓN',
    items: [
      { icon: 'fas fa-users',         label: 'Visitantes',  hash: '#/visitantes', roles: ['ADMINISTRADOR','SECRETARIA'] },
      { icon: 'fas fa-user-graduate', label: 'Alumnos',     hash: '#/alumnos',    roles: ['ADMINISTRADOR','SECRETARIA','PROFESOR'] },
      { icon: 'fas fa-check-square',  label: 'Asistencia',  hash: '#/asistencia', roles: ['ADMINISTRADOR','DIRECTOR','SECRETARIA','PORTERO','PROFESOR'] },
      { icon: 'fas fa-calendar-alt',  label: 'Agenda',      hash: '#/agenda',     roles: ['ADMINISTRADOR','DIRECTOR','SECRETARIA','PORTERO','PROFESOR'] },
      { icon: 'fas fa-user-cog',      label: 'Usuarios',    hash: '#/usuarios',   roles: ['ADMINISTRADOR'] },
      { icon: 'fas fa-history',       label: 'Auditoría',   hash: '#/auditoria',  roles: ['ADMINISTRADOR'] },
    ]
  }
];

const ROL_LABELS = {
  ADMINISTRADOR: 'Administrador', PORTERO: 'Portero',
  SECRETARIA: 'Secretaria', DIRECTOR: 'Director', PROFESOR: 'Profesor',
};

export function renderSidebar(container) {
  const rol     = store.rol();
  const current = window.location.hash || '#/dashboard';

  const sections = MENU.map(sec => {
    const visible = sec.items.filter(i => !i.roles || i.roles.includes(rol));
    if (!visible.length) return '';
    return `
      <div class="nav-section-title">${sec.section}</div>
      <ul class="nav-list">
        ${visible.map(item => `
          <li>
            <a class="nav-link ${current === item.hash ? 'active' : ''}"
               href="${item.hash}" data-hash="${item.hash}">
              <!-- CAMBIO AQUÍ: Ahora usamos <i> con la clase dinámica de Font Awesome -->
              <span class="nav-icon"><i class="${item.icon}"></i></span>
              <span>${item.label}</span>
            </a>
          </li>`).join('')}
      </ul>`;
  }).join('');

  container.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <!-- Puedes dejar este emoji o cambiarlo por <i class="fas fa-school"></i> si prefieres -->
        <div class="brand-icon"><i class="fas fa-school"></i></div>
        <div>
          <div class="brand-name">SchoolGuard</div>
          <div class="brand-sub">Sistema de Visitas</div>
        </div>
      </div>
      <nav class="sidebar-nav">${sections}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="u-avatar"><i class="fas fa-user-circle"></i></div>
          <div>
            <div class="u-name">${store.nombre() ?? store.usuario()}</div>
            <div class="u-role">${ROL_LABELS[rol] ?? rol}</div>
          </div>
        </div>
        <button class="btn-logout" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </aside>`;

  container.querySelector('#logout-btn').addEventListener('click', () => {
    store.clear();
    window.location.hash = '#/login';
  });
}