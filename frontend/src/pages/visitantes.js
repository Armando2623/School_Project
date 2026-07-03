import { visitantesApi } from '../api/visitantes.js';
import { openModal }     from '../components/modal.js';
import { toast }         from '../components/toast.js';
import { store }         from '../auth/store.js';

const canEdit = () => store.hasRole('ADMINISTRADOR','SECRETARIA');
let all = [];

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
    all = await visitantesApi.listar();
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
      <td><strong>${v.nombreVisitante}</strong></td>
      <td class="td-muted">${v.telefono ?? '—'}</td>
      <td class="td-muted">${v.email ?? '—'}</td>
      <td><span class="badge badge-purple">${v.hijos?.length ?? 0} hijos</span></td>
      ${canEdit() ? `<td><button class="btn btn-outline btn-sm edit-btn" data-id="${v.id}">✏️ Editar</button></td>` : ''}
    </tr>`).join('');

  if (canEdit()) {
    tbody.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openForm(container, all.find(v => v.id == btn.dataset.id)))
    );
  }
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
