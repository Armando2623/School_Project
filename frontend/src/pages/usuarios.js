import { usuariosApi } from '../api/usuarios.js';
import { openModal }   from '../components/modal.js';
import { toast }       from '../components/toast.js';

const ROLES = ['ADMINISTRADOR','PORTERO','SECRETARIA','DIRECTOR','PROFESOR'];
const ROL_BADGE = {
  ADMINISTRADOR:'badge-red', PORTERO:'badge-blue',
  SECRETARIA:'badge-green',  DIRECTOR:'badge-yellow', PROFESOR:'badge-purple'
};
const rolBadge = r => `<span class="badge ${ROL_BADGE[r]??'badge-gray'}">${r}</span>`;
let all = [];

export async function renderUsuarios(container) {
  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>Usuarios del Sistema</h1>
        <div class="sub">Solo visible para Administradores</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        <button class="btn btn-primary" id="btn-new">+ Nuevo Usuario</button>
      </div>
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title"><span class="title-icon"></span> Listado de Usuarios</div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon"></span>
              <input id="search" placeholder="Buscar por nombre o usuario…" />
            </div>
            <span id="total" class="badge badge-blue">—</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th>
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
    draw(container, all.filter(u =>
      u.nombre?.toLowerCase().includes(q) || u.usuario?.toLowerCase().includes(q)
    ));
  });
  container.querySelector('#btn-new').addEventListener('click', () => openForm(container));
}

async function load(container) {
  try {
    all = await usuariosApi.listar();
    container.querySelector('#total').textContent = `${all.length}`;
    container.querySelector('#footer-lbl').textContent = `${all.length} usuarios`;
    draw(container, all);
  } catch (err) { toast(err.message, 'error'); }
}

function draw(container, data) {
  const tbody = container.querySelector('#tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Sin usuarios registrados</td></tr>'; return;
  }
  tbody.innerHTML = data.map(u => `
    <tr>
      <td><strong>${u.nombre}</strong></td>
      <td class="td-muted" style="font-family:monospace">@${u.usuario}</td>
      <td>${rolBadge(u.rol)}</td>
      <td style="display:flex;gap:6px;padding:10px 16px">
        <button class="btn btn-outline btn-sm edit-btn" data-id="${u.id}">✏️ Editar</button>
        <button class="btn btn-danger  btn-sm del-btn"  data-id="${u.id}">🗑 Eliminar</button>
      </td>
    </tr>`).join('');

  tbody.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => openForm(container, all.find(u => u.id == btn.dataset.id)))
  );
  tbody.querySelectorAll('.del-btn').forEach(btn =>
    btn.addEventListener('click', () => confirmDelete(container, all.find(u => u.id == btn.dataset.id)))
  );
}

function openForm(container, u = null) {
  const rolOptions = ROLES.map(r =>
    `<option value="${r}" ${u?.rol === r ? 'selected' : ''}>${r}</option>`
  ).join('');

  openModal({
    title: u ? '✏️ Editar Usuario' : '+ Nuevo Usuario',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre completo *</label>
          <input class="form-control" id="m-nombre" value="${u?.nombre??''}" placeholder="Nombre completo" />
        </div>
        <div class="form-group">
          <label>Nombre de usuario *</label>
          <input class="form-control" id="m-usuario" value="${u?.usuario??''}" placeholder="Ej: jperez" />
        </div>
        <div class="form-group">
          <label>${u ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
          <input class="form-control" type="password" id="m-pass" placeholder="${u ? 'Nueva contraseña…' : 'Contraseña segura'}" />
        </div>
        <div class="form-group">
          <label>Rol *</label>
          <select class="form-control" id="m-rol">
            <option value="">— Selecciona —</option>
            ${rolOptions}
          </select>
        </div>
      </div>`,
    confirmText: u ? 'Actualizar' : 'Crear Usuario',
    onConfirm: async (overlay, close) => {
      const body = {
        nombre:     overlay.querySelector('#m-nombre').value.trim(),
        usuario:    overlay.querySelector('#m-usuario').value.trim(),
        contraseña: overlay.querySelector('#m-pass').value,
        rol:        overlay.querySelector('#m-rol').value,
      };
      if (!body.nombre || !body.usuario || !body.rol) { toast('Nombre, usuario y rol son obligatorios', 'warning'); return; }
      if (!u && !body.contraseña) { toast('La contraseña es obligatoria', 'warning'); return; }
      try {
        if (u) await usuariosApi.actualizar(u.id, body);
        else await usuariosApi.registrar(body);
        toast(u ? 'Usuario actualizado' : 'Usuario creado', 'success');
        close(); await load(container);
      } catch (err) { toast(err.message, 'error'); }
    },
  });
}

function confirmDelete(container, u) {
  openModal({
    title: '🗑 Eliminar Usuario',
    bodyHTML: `<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${u.nombre}</strong> (@${u.usuario})?<br/>Esta acción no se puede deshacer.</p>`,
    confirmText: 'Eliminar',
    danger: true,
    onConfirm: async (_, close) => {
      try {
        await usuariosApi.eliminar(u.id);
        toast('Usuario eliminado', 'success');
        close(); await load(container);
      } catch (err) { toast(err.message, 'error'); }
    },
  });
}
