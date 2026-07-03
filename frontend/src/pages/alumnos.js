import { alumnosApi }    from '../api/alumnos.js';
import { visitantesApi } from '../api/visitantes.js';
import { openModal }     from '../components/modal.js';
import { toast }         from '../components/toast.js';
import { store }         from '../auth/store.js';

const canEdit = () => store.hasRole('ADMINISTRADOR','SECRETARIA');
let all = [], visitantes = [];

export async function renderAlumnos(container) {
  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>Alumnos</h1>
        <div class="sub">Estudiantes registrados en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${canEdit() ? '<button class="btn btn-primary" id="btn-new">+ Nuevo Alumno</button>' : ''}
      </div>
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title"><span class="title-icon">🎒</span> Listado de Alumnos</div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input id="search" placeholder="Buscar por nombre, grado o sección…" />
            </div>
            <span id="total" class="badge badge-blue">—</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Nombre</th><th>Grado</th><th>Sección</th><th>Apoderado</th><th>Notif.</th><th>QR</th>
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
    draw(container, all.filter(a =>
      a.nombre?.toLowerCase().includes(q) ||
      a.grado?.toLowerCase().includes(q) ||
      a.seccion?.toLowerCase().includes(q)
    ));
  });
  container.querySelector('#btn-new')?.addEventListener('click', () => openForm(container));
}

async function load(container) {
  try {
    [all, visitantes] = await Promise.all([alumnosApi.listar(), visitantesApi.listar()]);
    container.querySelector('#total').textContent = `${all.length}`;
    container.querySelector('#footer-lbl').textContent = `${all.length} alumnos registrados`;
    draw(container, all);
  } catch (err) { toast(err.message, 'error'); }
}

function draw(container, data) {
  const tbody = container.querySelector('#tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Sin alumnos registrados</td></tr>'; return;
  }
  tbody.innerHTML = data.map(a => {
    const tieneEmail = !!a.apoderado?.email;
    const notifBadge = tieneEmail
      ? `<span class="badge badge-green" title="El apoderado ${a.apoderado.nombreVisitante} recibirá notificaciones en ${a.apoderado.email}" style="cursor:default">📧 Email</span>`
      : `<span class="td-muted" title="El apoderado no tiene email registrado">—</span>`;
    return `
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td><span class="badge badge-blue">${a.grado}</span></td>
      <td><span class="badge badge-gray">${a.seccion}</span></td>
      <td class="td-muted">${a.apoderado?.nombreVisitante ?? '—'}</td>
      <td>${notifBadge}</td>
      <td>
        ${a.codigoQr
          ? `<button class="btn btn-outline btn-sm qr-btn" data-id="${a.id}" data-nombre="${a.nombre}" title="Ver código QR">
               📱 Ver QR
             </button>`
          : '<span class="td-muted">Sin QR</span>'
        }
      </td>
      ${canEdit() ? `<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>` : ''}
    </tr>`;
  }).join('');

  // Botones editar
  if (canEdit()) {
    tbody.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openForm(container, all.find(a => a.id == btn.dataset.id)))
    );
  }

  // Botones QR
  tbody.querySelectorAll('.qr-btn').forEach(btn =>
    btn.addEventListener('click', () => openQrModal(btn.dataset.id, btn.dataset.nombre))
  );
}

/** Abre un modal mostrando la imagen QR del alumno con opción de descargar */
async function openQrModal(id, nombre) {
  // Crear objeto URL temporal del blob del QR
  let objectUrl = null;

  openModal({
    title: `📱 Código QR — ${nombre}`,
    bodyHTML: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
        <div id="qr-loading" style="color:var(--text2);font-size:13px">Cargando QR…</div>
        <img id="qr-img" style="display:none;border-radius:12px;border:3px solid var(--border);
          box-shadow:0 4px 24px rgba(0,0,0,0.15);width:220px;height:220px;object-fit:contain" />
        <p style="font-size:12px;color:var(--text3);text-align:center;max-width:240px">
          Muestra este código en la entrada para registrar la asistencia del alumno.
        </p>
        <button class="btn btn-outline btn-sm" id="btn-download-qr">⬇ Descargar QR</button>
      </div>`,
    confirmText: 'Cerrar',
    hideCancelBtn: true,
    onOpen: async (overlay) => {
      try {
        const blob = await alumnosApi.obtenerQrBlob(id);
        objectUrl = URL.createObjectURL(blob);
        const img = overlay.querySelector('#qr-img');
        img.src = objectUrl;
        img.style.display = 'block';
        overlay.querySelector('#qr-loading').style.display = 'none';

        overlay.querySelector('#btn-download-qr').addEventListener('click', () => {
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = `qr-alumno-${nombre.replace(/\s+/g, '-')}.png`;
          a.click();
        });
      } catch (err) {
        overlay.querySelector('#qr-loading').textContent = 'Error al cargar el QR';
        toast('No se pudo cargar el código QR', 'error');
      }
    },
    onClose: () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
  });
}

function openForm(container, a = null) {
  const visOptions = visitantes.map(v =>
    `<option value="${v.id}" ${a?.apoderado?.id === v.id ? 'selected' : ''}>${v.nombreVisitante} (${v.dniVisitante})</option>`
  ).join('');

  openModal({
    title: a ? '✏️ Editar Alumno' : '+ Nuevo Alumno',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Nombre completo *</label>
          <input class="form-control" id="m-nombre" value="${a?.nombre??''}" placeholder="Nombre del alumno" />
        </div>
        <div class="form-group">
          <label>Grado *</label>
          <input class="form-control" id="m-grado" value="${a?.grado??''}" placeholder="Ej: 3° Primaria" />
        </div>
        <div class="form-group">
          <label>Sección *</label>
          <input class="form-control" id="m-seccion" value="${a?.seccion??''}" placeholder="Ej: A" maxlength="5" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Apoderado (Visitante)</label>
          <select class="form-control" id="m-apoderado">
            <option value="">— Sin apoderado —</option>
            ${visOptions}
          </select>
        </div>
      </div>`,
    confirmText: a ? 'Actualizar' : 'Registrar',
    onConfirm: async (overlay, close) => {
      const body = {
        nombre:      overlay.querySelector('#m-nombre').value.trim(),
        grado:       overlay.querySelector('#m-grado').value.trim(),
        seccion:     overlay.querySelector('#m-seccion').value.trim(),
        visitanteId: overlay.querySelector('#m-apoderado').value || null,
      };
      if (!body.nombre || !body.grado || !body.seccion) { toast('Nombre, grado y sección son obligatorios', 'warning'); return; }
      if (body.visitanteId) body.visitanteId = Number(body.visitanteId);
      try {
        if (a) await alumnosApi.actualizar(a.id, body);
        else await alumnosApi.registrar(body);
        toast(a ? 'Alumno actualizado' : 'Alumno registrado — QR generado automáticamente', 'success');
        close(); await load(container);
      } catch (err) { toast(err.message, 'error'); }
    },
  });
}
