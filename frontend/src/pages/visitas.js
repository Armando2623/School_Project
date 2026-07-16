import { visitasApi }    from '../api/visitas.js';
import { visitantesApi } from '../api/visitantes.js';
import { openModal }     from '../components/modal.js';
import { toast }         from '../components/toast.js';
import { store }         from '../auth/store.js';

const ESTADOS = ['REGISTRADO', 'EN_CURSO', 'COMPLETADO'];
const BADGE = { REGISTRADO:'badge-blue', EN_CURSO:'badge-yellow', COMPLETADO:'badge-green' };
const badge = (e) => `<span class="badge ${BADGE[e]??'badge-gray'}">${e??'—'}</span>`;
const fmt   = (dt) => dt ? new Date(dt).toLocaleString('es-PE') : '—';
const localISO = (dt) => {
  const d = dt ? new Date(dt) : new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const canEdit = () => store.hasRole('ADMINISTRADOR','PORTERO','SECRETARIA');

let allVisitas = [];

export async function renderVisitas(container) {
  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>Registro de Visitas</h1>
        <div class="sub">Control de ingreso de visitantes</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${canEdit() ? '<button class="btn btn-primary" id="btn-new">+ Nueva Visita</button>' : ''}
      </div>
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title"><span class="title-icon">📋</span> Actividad Reciente</div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input id="search" placeholder="Buscar visitante…" />
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Visitante</th><th>DNI</th><th>Motivo</th>
              <th>Persona Visitada</th><th>Hora Ingreso</th><th>Estado</th>
              ${canEdit() ? '<th></th>' : ''}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-count">—</span></div>
      </div>
    </div>`;

  await loadTable(container);

  container.querySelector('#search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    drawRows(container, allVisitas.filter(v =>
      v.nombreVisitante?.toLowerCase().includes(q) ||
      v.dniVisitante?.toLowerCase().includes(q) ||
      v.motivo?.toLowerCase().includes(q)
    ));
  });

  container.querySelector('#btn-new')?.addEventListener('click', () => openFormModal(container));
}

async function loadTable(container) {
  try {
    allVisitas = await visitasApi.listar();
    container.querySelector('#footer-count').textContent = `${allVisitas.length} registros`;
    drawRows(container, allVisitas);
  } catch (err) { toast(err.message, 'error'); }
}

function drawRows(container, data) {
  const tbody = container.querySelector('#tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No hay registros</td></tr>'; return;
  }
  tbody.innerHTML = data.map(v => `
    <tr>
      <td><strong>${v.nombreVisitante}</strong></td>
      <td class="td-muted">${v.dniVisitante}</td>
      <td>${v.motivo}</td>
      <td>${v.usuario?.nombre ?? '—'}</td>
      <td class="td-small">${fmt(v.horaIngreso)}</td>
      <td>${badge(v.estadoRegistro)}</td>
      ${canEdit() ? `<td><button class="btn btn-outline btn-sm edit-btn" data-id="${v.id}">✏️ Editar</button></td>` : ''}
    </tr>`).join('');

  if (canEdit()) {
    tbody.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        openFormModal(container, allVisitas.find(v => v.id == btn.dataset.id));
      })
    );
  }
}

async function openFormModal(container, visita = null) {
  const editar = !!visita;
  let usuarios = [];
  try { usuarios = await visitasApi.buscarUsuarios(''); } catch {}
  const now = localISO();

  openModal({
    title: editar ? '✏️ Editar Visita' : '+ Nueva Visita',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group">
          <label>DNI Visitante *</label>
          <div style="display:flex;gap:6px">
            <input class="form-control" id="m-dni" value="${visita?.dniVisitante??''}" placeholder="Ej: 12345678" maxlength="15" />
            <button type="button" class="btn btn-outline btn-sm" id="btn-dni">🔍</button>
          </div>
        </div>
        <div class="form-group">
          <label>Nombre Visitante *</label>
          <input class="form-control" id="m-nombre" value="${visita?.nombreVisitante??''}" placeholder="Nombre completo" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Motivo *</label>
          <input class="form-control" id="m-motivo" value="${visita?.motivo??''}" placeholder="Motivo de la visita" />
        </div>
        <div class="form-group">
          <label>Persona a Visitar *</label>
          <select class="form-control" id="m-usuario">
            <option value="">— Selecciona —</option>
            ${usuarios.map(u => `<option value="${u.id}" ${visita?.usuario?.id===u.id?'selected':''}>${u.nombre} (${u.usuario})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" id="m-estado">
            ${ESTADOS.map(e => `<option value="${e}" ${(visita?.estadoRegistro??'REGISTRADO')===e?'selected':''}>${e}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Hora Ingreso</label>
          <input class="form-control" type="datetime-local" id="m-hora"
            value="${visita?.horaIngreso ? localISO(visita.horaIngreso) : now}" />
        </div>
      </div>`,
    confirmText: editar ? 'Actualizar' : 'Registrar',
    onConfirm: async (overlay, close) => {
      const dni    = overlay.querySelector('#m-dni').value.trim();
      const nombre = overlay.querySelector('#m-nombre').value.trim();
      const motivo = overlay.querySelector('#m-motivo').value.trim();
      const usuId  = overlay.querySelector('#m-usuario').value;
      const estado = overlay.querySelector('#m-estado').value;
      const hora   = overlay.querySelector('#m-hora').value;
      if (!dni || !nombre || !motivo || !usuId) { toast('Completa los campos obligatorios', 'warning'); return; }
      const payload = {
        dniVisitante: dni, nombreVisitante: nombre, motivo,
        usuario_id: Number(usuId), estadoRegistro: estado,
        horaIngreso: hora ? hora + ':00' : localISO() + ':00',
      };
      try {
        if (editar) await visitasApi.actualizar(visita.id, payload);
        else        await visitasApi.registrar(payload);
        toast(editar ? 'Visita actualizada' : 'Visita registrada', 'success');
        close(); await loadTable(container);
      } catch (err) { toast(err.message, 'error'); }
    },
  });

  // 1. Definimos la lógica de búsqueda de forma independiente y limpia
  async function buscarYAutocompletarDni() {
    const dniInput = document.querySelector('#m-dni');
    const nombreInput = document.querySelector('#m-nombre');

    if (!dniInput || !nombreInput) return;

    const dni = dniInput.value.trim();
    if (!dni) {
      toast('Por favor, ingresa un DNI', 'warning');
      return;
    }

    // Deshabilitamos temporalmente el botón o el input para evitar doble click
    const btn = document.querySelector('#btn-dni');
    if (btn) btn.disabled = true;

    try {
      // Intento 1: Tabla general de visitantes
      const v = await visitantesApi.buscarPorDni(dni);
      if (v && v.nombreVisitante) {
        nombreInput.value = v.nombreVisitante;
        toast('Datos autocompletados (desde Visitantes)', 'info');
        return; // Salimos si lo encontramos aquí
      }
    } catch (err) {
      // Opcional: Solo ignoramos si es un 404 (No encontrado)
      if (err.status !== 404) {
        console.warn('Error en visitantesApi, intentando historial...', err);
      }
    }

    try {
      // Intento 2: Historial de visitas pasadas
      const r = await visitasApi.buscarPorDni(dni);
      if (r && r.nombreVisitante) {
        nombreInput.value = r.nombreVisitante;
        toast('Datos autocompletados (desde Historial)', 'info');
      } else {
        toast('DNI no encontrado', 'warning');
      }
    } catch (err) {
      console.error('Error en visitasApi:', err);
      toast('No se pudo encontrar el DNI en el sistema', 'warning');
    } finally {
      // Volvemos a habilitar el botón al terminar todo el flujo
      if (btn) btn.disabled = false;
    }
  }

  // 2. Registro del evento evitando duplicados
  setTimeout(() => {
    const btnDni = document.querySelector('#btn-dni');
    if (btnDni) {
      // Removemos cualquier listener previo para evitar acumular clicks
      btnDni.removeEventListener('click', buscarYAutocompletarDni);
      btnDni.addEventListener('click', buscarYAutocompletarDni);
    }
  }, 100);
}
