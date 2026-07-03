import { auditoriaApi } from '../api/auditoria.js';
import { toast } from '../components/toast.js';

let allLogs = [];

const ROL_BADGE = {
  ADMINISTRADOR: 'badge-red',
  PORTERO:       'badge-blue',
  SECRETARIA:    'badge-green',
  DIRECTOR:      'badge-yellow',
  PROFESOR:      'badge-purple',
  SISTEMA:       'badge-gray'
};

const rolBadge = r => `<span class="badge ${ROL_BADGE[r] ?? 'badge-gray'}">${r}</span>`;

function formatFecha(fechaStr) {
  if (!fechaStr) return '';
  const d = new Date(fechaStr);
  return d.toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export async function renderAuditoria(container) {
  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>Auditoría del Sistema</h1>
        <div class="sub">Log de transacciones críticas del colegio</div>
      </div>
    </div>
    <div class="page-body">
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title"><span class="title-icon"></span> Historial de Transacciones</div>
          <div class="table-controls" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            
            <div class="search-box">
              <span class="search-icon"></span>
              <input id="aud-search" placeholder="Buscar por usuario, acción o detalles…" style="width:260px" />
            </div>

            <select id="aud-filter-rol" class="form-control" style="width:160px;margin-bottom:0;padding:6px 12px;height:38px">
              <option value="">Todos los Roles</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="PORTERO">PORTERO</option>
              <option value="SECRETARIA">SECRETARIA</option>
              <option value="DIRECTOR">DIRECTOR</option>
              <option value="PROFESOR">PROFESOR</option>
              <option value="SISTEMA">SISTEMA</option>
            </select>

            <span id="aud-total" class="badge badge-blue">—</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="width:180px">Fecha / Hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción</th>
                <th>Detalles de la Transacción</th>
              </tr>
            </thead>
            <tbody id="aud-tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="aud-footer-lbl">—</span></div>
      </div>
    </div>`;

  await load(container);

  const searchInput = container.querySelector('#aud-search');
  const rolFilter   = container.querySelector('#aud-filter-rol');

  const applyFilters = () => {
    const q = searchInput.value.toLowerCase().trim();
    const rol = rolFilter.value;

    let filtered = allLogs;
    if (rol) {
      filtered = filtered.filter(l => l.rol === rol);
    }
    if (q) {
      filtered = filtered.filter(l =>
        l.usuario?.toLowerCase().includes(q) ||
        l.accion?.toLowerCase().includes(q) ||
        l.detalles?.toLowerCase().includes(q)
      );
    }
    draw(container, filtered);
  };

  searchInput.addEventListener('input', applyFilters);
  rolFilter.addEventListener('change', applyFilters);
}

async function load(container) {
  try {
    allLogs = await auditoriaApi.listar();
    container.querySelector('#aud-total').textContent = `${allLogs.length}`;
    container.querySelector('#aud-footer-lbl').textContent = `${allLogs.length} transacciones registradas`;
    draw(container, allLogs);
  } catch (err) {
    toast(err.message, 'error');
  }
}

function draw(container, data) {
  const tbody = container.querySelector('#aud-tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Sin transacciones registradas que coincidan</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(l => `
    <tr>
      <td class="td-muted">${formatFecha(l.fecha)}</td>
      <td><strong>${l.usuario}</strong></td>
      <td>${rolBadge(l.rol)}</td>
      <td><span class="badge badge-yellow" style="font-family:monospace">${l.accion}</span></td>
      <td style="color:var(--text2);font-size:0.92rem;max-width:400px;word-break:break-word">${l.detalles ?? ''}</td>
    </tr>`).join('');
}
