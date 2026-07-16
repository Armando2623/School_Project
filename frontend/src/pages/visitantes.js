import { visitantesApi } from '../api/visitantes.js';
import { alumnosApi }    from '../api/alumnos.js';
import { openModal }     from '../components/modal.js';
import { toast }         from '../components/toast.js';
import { store }         from '../auth/store.js';

const canEdit = () => store.hasRole('ADMINISTRADOR','SECRETARIA');
let all = [];
let alumnosByVisitante = {}; // { visitanteId: [alumno, …] }

export async function renderVisitantes(container) {
  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>Visitantes</h1>
        <div class="sub">Personas externas registradas en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${canEdit() ? '<button class="btn btn-primary" id="btn-new">+ Nuevo Visitante</button>' : ''}
      </div>
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title"><span class="title-icon">👥</span> Visitantes registrados</div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input id="search" placeholder="Buscar por nombre o DNI…" />
            </div>
            <span id="total" class="badge badge-blue">—</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>DNI</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>N° Hijos</th>
              ${canEdit() ? '<th></th>' : ''}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`;

  await load(container);

  container.querySelector('#search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    draw(container, all.filter(v =>
      v.dniVisitante?.toLowerCase().includes(q) ||
      v.nombreVisitante?.toLowerCase().includes(q)
    ));
  });
  container.querySelector('#btn-new')?.addEventListener('click', () => openForm(container));
}

async function load(container) {
  try {
    // Cargar visitantes y alumnos en paralelo
    const [visitantes, alumnos] = await Promise.all([
      visitantesApi.listar(),
      alumnosApi.listar(),
    ]);

    // Agrupar alumnos por visitante (apoderado)
    alumnosByVisitante = {};
    (Array.isArray(alumnos) ? alumnos : []).forEach(a => {
      const vid = a.apoderado?.id;
      if (vid) {
        if (!alumnosByVisitante[vid]) alumnosByVisitante[vid] = [];
        alumnosByVisitante[vid].push(a);
      }
    });

    // Enriquecer cada visitante con sus hijos
    all = (Array.isArray(visitantes) ? visitantes : []).map(v => ({
      ...v,
      hijosData: alumnosByVisitante[v.id] || [],
    }));

    container.querySelector('#total').textContent = `${all.length}`;
    container.querySelector('#footer-lbl').textContent = `${all.length} visitantes registrados`;
    draw(container, all);
  } catch (err) { toast(err.message, 'error'); }
}

function draw(container, data) {
  const tbody = container.querySelector('#tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Sin visitantes registrados</td></tr>'; return;
  }
  tbody.innerHTML = data.map(v => `
    <tr>
      <td class="td-muted" style="font-family:monospace">${v.dniVisitante}</td>
      <td><strong class="visitante-nombre" data-id="${v.id}" style="cursor:pointer;text-decoration:underline dotted;text-underline-offset:3px">${v.nombreVisitante}</strong></td>
      <td class="td-muted">${v.telefono ?? '—'}</td>
      <td class="td-muted">${v.email ?? '—'}</td>
      <td>
        <span class="badge badge-purple detail-btn" data-id="${v.id}"
              style="cursor:pointer;transition:transform .15s;display:inline-block"
              onmouseover="this.style.transform='scale(1.12)'"
              onmouseout="this.style.transform='scale(1)'"
        >${v.hijosData.length} hijos</span>
      </td>
      ${canEdit() ? `<td><button class="btn btn-outline btn-sm edit-btn" data-id="${v.id}">✏️ Editar</button></td>` : ''}
    </tr>`).join('');

  // Evento: clic en badge "N° Hijos" → modal detalle
  tbody.querySelectorAll('.detail-btn').forEach(btn =>
    btn.addEventListener('click', () => openDetailModal(all.find(v => v.id == btn.dataset.id)))
  );

  // Evento: clic en nombre del visitante → modal detalle
  tbody.querySelectorAll('.visitante-nombre').forEach(el =>
    el.addEventListener('click', () => openDetailModal(all.find(v => v.id == el.dataset.id)))
  );

  if (canEdit()) {
    tbody.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openForm(container, all.find(v => v.id == btn.dataset.id)))
    );
  }
}

/* ── Modal de detalle: datos del padre + lista de hijos ── */
function openDetailModal(v) {
  if (!v) return;

  const hijosRows = v.hijosData.length
    ? v.hijosData.map(a => `
        <tr>
          <td><strong>${a.nombre}</strong></td>
          <td><span class="badge badge-blue">${a.grado ?? '—'}</span></td>
          <td><span class="badge badge-gray">${a.seccion ?? '—'}</span></td>
        </tr>`).join('')
    : '<tr class="empty-row"><td colspan="3">No tiene hijos registrados</td></tr>';

  openModal({
    title: '👤 Detalle del Visitante',
    bodyHTML: `
      <div style="display:flex;flex-direction:column;gap:18px">

        <!-- Datos del padre -->
        <div style="background:var(--card2,#f8f9fb);border:1.5px solid var(--border);border-radius:10px;padding:16px 18px">
          <div style="font-weight:700;font-size:15px;margin-bottom:10px;color:var(--primary,#6366f1)">
            📋 Datos del Apoderado
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:13.5px">
            <div><span style="color:var(--text3)">DNI:</span> <strong style="font-family:monospace">${v.dniVisitante}</strong></div>
            <div><span style="color:var(--text3)">Nombre:</span> <strong>${v.nombreVisitante}</strong></div>
            <div><span style="color:var(--text3)">Teléfono:</span> ${v.telefono || '<span style="color:var(--text3)">No registrado</span>'}</div>
            <div><span style="color:var(--text3)">Email:</span> ${v.email || '<span style="color:var(--text3)">No registrado</span>'}</div>
          </div>
        </div>

        <!-- Lista de hijos -->
        <div>
          <div style="font-weight:700;font-size:15px;margin-bottom:10px;display:flex;align-items:center;gap:8px">
            🎒 Hijos Registrados
            <span class="badge badge-purple">${v.hijosData.length}</span>
          </div>
          <div class="table-wrap" style="border-radius:8px;border:1.5px solid var(--border)">
            <table>
              <thead><tr>
                <th>Nombre</th><th>Grado</th><th>Sección</th>
              </tr></thead>
              <tbody>${hijosRows}</tbody>
            </table>
          </div>
        </div>

      </div>`,
    confirmText: 'Cerrar',
    hideCancelBtn: true,
  });
}

function openForm(container, v = null) {
  openModal({
    title: v ? '✏️ Editar Visitante' : '+ Nuevo Visitante',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group">
          <label>DNI *</label>
          <input class="form-control" id="m-dni" value="${v?.dniVisitante??''}" maxlength="20" placeholder="Número de documento" />
        </div>
        <div class="form-group">
          <label>Nombre completo *</label>
          <input class="form-control" id="m-nombre" value="${v?.nombreVisitante??''}" placeholder="Nombre y apellidos" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="form-control" id="m-tel" value="${v?.telefono??''}" placeholder="Ej: 987654321" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" type="email" id="m-email" value="${v?.email??''}" placeholder="correo@ejemplo.com" />
        </div>
      </div>`,
    confirmText: v ? 'Actualizar' : 'Registrar',
    onConfirm: async (overlay, close) => {
      const body = {
        dniVisitante:    overlay.querySelector('#m-dni').value.trim(),
        nombreVisitante: overlay.querySelector('#m-nombre').value.trim(),
        telefono:        overlay.querySelector('#m-tel').value.trim() || null,
        email:           overlay.querySelector('#m-email').value.trim() || null,
      };
      if (!body.dniVisitante || !body.nombreVisitante) { toast('DNI y nombre son obligatorios', 'warning'); return; }
      try {
        if (v) await visitantesApi.actualizar(v.id, body);
        else await visitantesApi.registrar(body);
        toast(v ? 'Visitante actualizado' : 'Visitante registrado', 'success');
        close(); await load(container);
      } catch (err) { toast(err.message, 'error'); }
    },
  });
}
