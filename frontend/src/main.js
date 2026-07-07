import './styles/main.css';
import './styles/agenda.css';
import { store } from './auth/store.js';
import { renderSidebar } from './components/sidebar.js';
import { renderLogin }      from './pages/login.js';
import { renderDashboard }  from './pages/dashboard.js';
import { renderVisitas }    from './pages/visitas.js';
import { renderVisitantes } from './pages/visitantes.js';
import { renderAlumnos }    from './pages/alumnos.js';
import { renderUsuarios }   from './pages/usuarios.js';
import { renderAsistencia } from './pages/asistencia.js';
import { renderAgenda }     from './pages/agenda.js';
import { renderAuditoria }  from './pages/auditoria.js';
import { renderInventario } from './pages/inventario.js';

const app = document.getElementById('app');

const ROUTES = {
  '#/login':      { page: renderLogin,      auth: false },
  '#/dashboard':  { page: renderDashboard,  auth: true  },
  '#/visitas':    { page: renderVisitas,    auth: true  },
  '#/visitantes': { page: renderVisitantes, auth: true  },
  '#/alumnos':    { page: renderAlumnos,    auth: true  },
  '#/usuarios':   { page: renderUsuarios,   auth: true, roles: ['ADMINISTRADOR'] },
  '#/auditoria':  { page: renderAuditoria,  auth: true, roles: ['ADMINISTRADOR'] },
  '#/asistencia': { page: renderAsistencia, auth: true  },
  '#/agenda':     { page: renderAgenda,     auth: true  },
  '#/inventario': { page: renderInventario, auth: true  },
};

async function navigate() {
  let hash = window.location.hash || '#/dashboard';

  // Redireccionar al inventario si el rol es ENCARGADO_INVENTARIO y va al home/dashboard
  if (store.isLogged() && store.rol() === 'ENCARGADO_INVENTARIO' && (hash === '#/dashboard' || hash === '#/')) {
    hash = '#/inventario';
    window.location.hash = '#/inventario';
    return;
  }

  const route = ROUTES[hash];

  if (!route) {
    if (store.isLogged() && store.rol() === 'ENCARGADO_INVENTARIO') {
      window.location.hash = '#/inventario';
    } else {
      window.location.hash = '#/dashboard';
    }
    return;
  }

  if (!route.auth) {
    if (store.isLogged()) {
      if (store.rol() === 'ENCARGADO_INVENTARIO') {
        window.location.hash = '#/inventario';
      } else {
        window.location.hash = '#/dashboard';
      }
      return;
    }
    app.innerHTML = '';
    route.page(app);
    return;
  }

  if (!store.isLogged()) { window.location.hash = '#/login'; return; }

  if (route.roles && !route.roles.includes(store.rol())) {
    window.location.hash = '#/dashboard'; return;
  }

  app.innerHTML = `
    <div class="app-container">
      <div id="sidebar-wrap"></div>
      <div class="main-content" id="page-root"></div>
    </div>`;

  renderSidebar(app.querySelector('#sidebar-wrap'));
  const pageRoot = app.querySelector('#page-root');

  try {
    await route.page(pageRoot);
  } catch (err) {
    pageRoot.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;height:60vh;gap:10px;color:var(--text2)">
        <span style="font-size:2.5rem">⚠️</span>
        <p style="font-weight:600">Error al cargar la página</p>
        <small>${err.message}</small>
      </div>`;
  }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', () => {
  if (!window.location.hash) window.location.hash = '#/dashboard';
  navigate();
});
