import { visitasApi }    from '../api/visitas.js';
import { alumnosApi }    from '../api/alumnos.js';
import { asistenciaApi } from '../api/asistencia.js';
import { store }         from '../auth/store.js';

const today = () => new Date().toLocaleDateString('es-PE', {
  weekday:'long', year:'numeric', month:'long', day:'numeric'
});
const todayISO = () => new Date().toISOString().split('T')[0];

const BADGE = {
  REGISTRADO: 'badge-blue', EN_CURSO: 'badge-yellow', COMPLETADO: 'badge-green',
};

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>I.E.P. — SchoolGuard</h1>
        <div class="sub">Sistema de Registro de Visitas</div>
      </div>
      <div class="date-pill"><i class="fa-thin fa-calendar-clock"></i> ${today()}</div>
    </div>

    <div class="page-body">

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon-box si-blue"><i class="fa-solid fa-id-card"></i></div>
          <div><div class="stat-num" id="s-activos">—</div><div class="stat-lbl">Visitas Activas</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box si-blue"><i class="fa-solid fa-calendar"></i></div>

          <div><div class="stat-num" id="s-hoy">—</div><div class="stat-lbl">Hoy</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box si-orange"><i class="fa-solid fa-user-graduate"></i></div>
          <div><div class="stat-num" id="s-alumnos">—</div><div class="stat-lbl">Alumnos</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box si-gray"><i class="fa-solid fa-calendar-check"></i></div>
          <div><div class="stat-num" id="s-asist">—</div><div class="stat-lbl">Asistencias hoy</div></div>
        </div>
      </div>

<div class="svc-row">
    <div class="svc-chip"><span class="svc-dot" id="dot-mvc"></span> Backend MVC :8080</div>
    <div class="svc-chip"><span class="svc-dot" id="dot-ast"></span> Asistencia :8081</div>
    </div>

      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title">
            <span class="title-icon"><i class="fa-solid fa-clock"></i></span> Actividad Reciente
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Visitante</th><th>DNI</th>
                <th>Motivo</th><th>Hora Ingreso</th><th>Estado</th>
              </tr>
            </thead>
            <tbody id="recent-tbody">
              <tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text3)">Cargando…</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-card-footer">
          <span id="footer-count">—</span>
        </div>
      </div>

    </div>`;

  // Indicadores de servicio — usa /api/alumnos con JWT para el MVC
  // y una ruta pública del asistencia para verificar conectividad
  const token = store.token();
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

  const ping = async (url, id, headers = {}) => {
    const dot = container.querySelector(`#${id}`);
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(3000), headers });
      // Cualquier respuesta HTTP (incluso 4xx) significa que el servidor responde
      dot.classList.add(r.status < 500 ? 'online' : 'offline');
    } catch { dot.classList.add('offline'); }
  };
  ping('/api/alumnos', 'dot-mvc', authHeaders);
  ping('/asistencia-api/asistencia', 'dot-ast', authHeaders);

  // Stats + tabla
  try {
    const [visitas, alumnos] = await Promise.all([visitasApi.listar(), alumnosApi.listar()]);
    const hoy = visitas.filter(v => v.horaIngreso?.startsWith(todayISO()));
    const activos = visitas.filter(v => v.estadoRegistro === 'EN_CURSO');

    container.querySelector('#s-activos').textContent  = activos.length;
    container.querySelector('#s-hoy').textContent      = hoy.length;
    container.querySelector('#s-alumnos').textContent  = alumnos.length;
    container.querySelector('#footer-count').textContent = `${hoy.length} hoy`;

    const tbody  = container.querySelector('#recent-tbody');
    const last5  = [...visitas].reverse().slice(0, 5);
    if (!last5.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text3)">No hay registros</td></tr>';
    } else {
      tbody.innerHTML = last5.map(v => `
        <tr>
          <td><strong>${v.nombreVisitante}</strong></td>
          <td class="td-muted">${v.dniVisitante}</td>
          <td>${v.motivo}</td>
          <td class="td-small">${v.horaIngreso ? new Date(v.horaIngreso).toLocaleString('es-PE') : '—'}</td>
          <td><span class="badge ${BADGE[v.estadoRegistro] ?? 'badge-gray'}">${v.estadoRegistro ?? '—'}</span></td>
        </tr>`).join('');
    }
  } catch { /* sin conexión */ }

  try {
    const ast = await asistenciaApi.porFecha(todayISO());
    container.querySelector('#s-asist').textContent = ast.length;
  } catch { container.querySelector('#s-asist').textContent = '—'; }
}
