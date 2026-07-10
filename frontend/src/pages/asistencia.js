import { asistenciaApi }        from '../api/asistencia.js';
import { asistenciaAlumnosApi } from '../api/asistencia-alumnos.js';
import { usuariosApi }          from '../api/usuarios.js';
import { openModal }            from '../components/modal.js';
import { toast }                from '../components/toast.js';
import { store }                from '../auth/store.js';
import { Html5Qrcode }          from 'html5-qrcode';
import { api }                  from '../api/client.js';

const todayISO = () => new Date().toISOString().split('T')[0];
const fmt = dt => dt ? new Date(dt).toLocaleString('es-PE') : '—';
const tipoBadge = t => t === 'ENTRADA'
  ? '<span class="badge badge-green">▶ ENTRADA</span>'
  : '<span class="badge badge-red">◀ SALIDA</span>';

let allPersonal = [], allAlumnos = [], usuarios = [];
let activeTab = 'personal'; // 'personal' | 'alumnos'

export async function renderAsistencia(container) {
  const canRegister = store.hasRole('ADMINISTRADOR','PORTERO','SECRETARIA');

  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1>Asistencia</h1>
        <div class="sub">Microservicio → localhost:8081</div>
      </div>
    </div>
    <div class="page-body">

      <!-- Tabs -->
      <div class="asist-tabs" style="display:flex;gap:8px;margin-bottom:20px">
        <button class="btn btn-primary tab-btn active" id="tab-personal" data-tab="personal">
           Personal
        </button>
        <button class="btn btn-outline tab-btn" id="tab-alumnos" data-tab="alumnos">
           Alumnos (QR)
        </button>
      </div>

      <!-- ══════════ SECCIÓN PERSONAL ══════════ -->
      <div id="section-personal">
        ${canRegister ? `
        <div class="table-card" style="margin-bottom:20px">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"></span> Registro Rápido — Mi Asistencia</div>
          </div>
          <div style="padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" id="btn-new">+ Registro de personal</button>
          </div>
        </div>` : ''}

        <div class="table-card">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"></span> Registros — Personal</div>
            <div class="table-controls">
              <div class="search-box">
                <span style="color:var(--text3);font-size:12px"></span>
                <input type="date" id="filter-fecha" value="${todayISO()}"
                  style="border:none;background:transparent;outline:none;font-size:13px;color:var(--text);font-family:inherit" />
              </div>
              <button class="btn btn-outline btn-sm" id="btn-filter">Filtrar</button>
              <button class="btn btn-outline btn-sm" id="btn-all">Todos</button>
              <span id="total-personal" class="badge badge-blue">—</span>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr>
                <th>Personal</th><th>Rol</th><th>Tipo</th><th>Hora</th><th>Observaciones</th>
              </tr></thead>
              <tbody id="tbody-personal"></tbody>
            </table>
          </div>
          <div class="table-card-footer"><span id="footer-personal">—</span></div>
        </div>
      </div>

      <!-- ══════════ SECCIÓN ALUMNOS (QR) ══════════ -->
      <div id="section-alumnos" style="display:none">
        ${canRegister ? `
        <div class="table-card" style="margin-bottom:20px">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"><i class="fa-solid fa-camera"></i></span> Registrar Asistencia por QR</div>
          </div>
          <div style="padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="btn btn-primary" id="btn-scan-qr">QR del Alumno</button>
            <span style="color:var(--text3);font-size:13px">Enfoca la cámara al código QR del alumno</span>
          </div>
        </div>` : ''}

        <div class="table-card">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"></span> Registros — Alumnos</div>
            <div class="table-controls">
              <div class="search-box">
                <input type="date" id="filter-fecha-alumnos" value="${todayISO()}"
                  style="border:none;background:transparent;outline:none;font-size:13px;color:var(--text);font-family:inherit" />
              </div>
              <button class="btn btn-outline btn-sm" id="btn-filter-alumnos">Filtrar</button>
              <button class="btn btn-outline btn-sm" id="btn-all-alumnos">Todos</button>
              <span id="total-alumnos" class="badge badge-blue">—</span>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr>
                <th>Alumno</th><th>Grado</th><th>Sección</th><th>Tipo</th><th>Hora</th><th>Observaciones</th>
              </tr></thead>
              <tbody id="tbody-alumnos"></tbody>
            </table>
          </div>
          <div class="table-card-footer"><span id="footer-alumnos">—</span></div>
        </div>
      </div>

    </div>`;

  // ── Tabs ──────────────────────────────────────────
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      container.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === activeTab);
        b.classList.toggle('btn-primary', b.dataset.tab === activeTab);
        b.classList.toggle('btn-outline', b.dataset.tab !== activeTab);
      });
      container.querySelector('#section-personal').style.display = activeTab === 'personal' ? '' : 'none';
      container.querySelector('#section-alumnos').style.display  = activeTab === 'alumnos'  ? '' : 'none';
    });
  });

  // ── Personal ──────────────────────────────────────
  try {
    const res = await usuariosApi.listar();
    usuarios = Array.isArray(res) ? res : [];
  } catch (err) {
    usuarios = [];
    console.error('Error al listar usuarios para asistencia:', err);
  }
  await loadPersonal(container, todayISO());

  container.querySelector('#btn-filter')?.addEventListener('click', () => {
    const fecha = container.querySelector('#filter-fecha').value;
    if (fecha) loadPersonal(container, fecha);
  });
  container.querySelector('#btn-all')?.addEventListener('click', () => loadAllPersonal(container));
  container.querySelector('#btn-new')?.addEventListener('click', () => openFormPersonal(container));

  // ── Alumnos ───────────────────────────────────────
  await loadAlumnos(container, todayISO());

  container.querySelector('#btn-filter-alumnos')?.addEventListener('click', () => {
    const fecha = container.querySelector('#filter-fecha-alumnos').value;
    if (fecha) loadAlumnos(container, fecha);
  });
  container.querySelector('#btn-all-alumnos')?.addEventListener('click', () => loadAllAlumnos(container));
  container.querySelector('#btn-scan-qr')?.addEventListener('click', () => openQrScanner(container));
}

// ══════════════════════════════════════════════════════
//  PERSONAL
// ══════════════════════════════════════════════════════

async function loadPersonal(container, fecha) {
  try {
    allPersonal = await asistenciaApi.porFecha(fecha);
    container.querySelector('#total-personal').textContent = `${allPersonal.length}`;
    container.querySelector('#footer-personal').textContent = `${allPersonal.length} registros`;
    drawPersonal(container, allPersonal);
  } catch { toast('No se pudo conectar al servicio de asistencia (puerto 8081)', 'error'); }
}

async function loadAllPersonal(container) {
  try {
    allPersonal = await asistenciaApi.listar();
    container.querySelector('#total-personal').textContent = `${allPersonal.length}`;
    container.querySelector('#footer-personal').textContent = `${allPersonal.length} registros totales`;
    drawPersonal(container, allPersonal);
  } catch (err) { toast(err.message, 'error'); }
}

function drawPersonal(container, data) {
  const tbody = container.querySelector('#tbody-personal');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Sin registros para este filtro</td></tr>'; return;
  }
  tbody.innerHTML = data.map(r => `
    <tr>
      <td><strong>${r.nombrePersonal}</strong></td>
      <td><span class="badge badge-purple">${r.rolPersonal}</span></td>
      <td>${tipoBadge(r.tipoEvento)}</td>
      <td class="td-small">${fmt(r.horaEvento)}</td>
      <td class="td-muted">${r.observaciones ?? '—'}</td>
    </tr>`).join('');
}

function openFormPersonal(container) {
  const userOptions = usuarios.map(u =>
    `<option value="${u.id}" data-nombre="${u.nombre}" data-rol="${u.rol}">${u.nombre} — ${u.rol}</option>`
  ).join('');
  const now = new Date().toISOString().slice(0,16);

  openModal({
    title: '+ Registrar Asistencia — Personal',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Personal *</label>
          <select class="form-control" id="m-usuario">
            <option value="">— Selecciona el personal —</option>
            ${userOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Tipo de Evento *</label>
          <select class="form-control" id="m-tipo">
            <option value="ENTRADA">▶ ENTRADA</option>
            <option value="SALIDA">◀ SALIDA</option>
          </select>
        </div>
        <div class="form-group">
          <label>Hora del Evento</label>
          <input class="form-control" type="datetime-local" id="m-hora" value="${now}" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Observaciones</label>
          <input class="form-control" id="m-obs" placeholder="Ej: Llegó tarde, justificación médica…" />
        </div>
      </div>`,
    confirmText: 'Registrar',
    onConfirm: async (overlay, close) => {
      const selEl  = overlay.querySelector('#m-usuario');
      const selOpt = selEl.options[selEl.selectedIndex];
      const usuId  = selEl.value;
      if (!usuId) { toast('Selecciona un miembro del personal', 'warning'); return; }
      const body = {
        usuarioId:      Number(usuId),
        nombrePersonal: selOpt.dataset.nombre,
        rolPersonal:    selOpt.dataset.rol,
        tipoEvento:     overlay.querySelector('#m-tipo').value,
        horaEvento:     overlay.querySelector('#m-hora').value
                          ? new Date(overlay.querySelector('#m-hora').value).toISOString() : null,
        observaciones:  overlay.querySelector('#m-obs').value.trim() || null,
      };
      try {
        await asistenciaApi.registrar(body);
        toast('Asistencia registrada', 'success');
        close();
        const fecha = container.querySelector('#filter-fecha').value || todayISO();
        await loadPersonal(container, fecha);
      } catch (err) { toast(err.message, 'error'); }
    },
  });
}

// ══════════════════════════════════════════════════════
//  ALUMNOS (QR)
// ══════════════════════════════════════════════════════

async function loadAlumnos(container, fecha) {
  try {
    allAlumnos = await asistenciaAlumnosApi.porFecha(fecha);
    container.querySelector('#total-alumnos').textContent = `${allAlumnos.length}`;
    container.querySelector('#footer-alumnos').textContent = `${allAlumnos.length} registros`;
    drawAlumnos(container, allAlumnos);
  } catch { toast('No se pudo cargar asistencia de alumnos', 'error'); }
}

async function loadAllAlumnos(container) {
  try {
    allAlumnos = await asistenciaAlumnosApi.listar();
    container.querySelector('#total-alumnos').textContent = `${allAlumnos.length}`;
    container.querySelector('#footer-alumnos').textContent = `${allAlumnos.length} registros totales`;
    drawAlumnos(container, allAlumnos);
  } catch (err) { toast(err.message, 'error'); }
}

function drawAlumnos(container, data) {
  const tbody = container.querySelector('#tbody-alumnos');
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Sin registros para este filtro</td></tr>'; return;
  }
  tbody.innerHTML = data.map(r => `
    <tr>
      <td><strong>${r.nombreAlumno}</strong></td>
      <td><span class="badge badge-blue">${r.grado ?? '—'}</span></td>
      <td><span class="badge badge-gray">${r.seccion ?? '—'}</span></td>
      <td>${tipoBadge(r.tipoEvento)}</td>
      <td class="td-small">${fmt(r.horaEvento)}</td>
      <td class="td-muted">${r.observaciones ?? '—'}</td>
    </tr>`).join('');
}

/**
 * Abre el modal con el scanner de QR usando html5-qrcode.
 * Al detectar un QR válido, muestra la info del alumno y confirma ENTRADA o SALIDA.
 */
function openQrScanner(container) {
  const scannerId = 'qr-reader-' + Date.now();
  let html5QrCode = null;
  let scannerStarted = false;

  openModal({
    title: '📷 Escanear QR del Alumno',
    bodyHTML: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px">

        <!-- Vista previa del scanner -->
        <div id="${scannerId}"
          style="width:100%;max-width:320px;border-radius:12px;overflow:hidden;
                 border:2px solid var(--border);background:#000;min-height:240px">
        </div>
        <p style="font-size:12px;color:var(--text3);text-align:center">
          Enfoca la cámara al código QR del alumno para escanearlo automáticamente
        </p>

        <!-- Resultado del escaneo -->
        <div id="scan-result" style="display:none;width:100%;
          background:var(--card2,#f0f9ff);border:1.5px solid var(--border);
          border-radius:10px;padding:14px 16px">
          <div style="font-weight:600;font-size:15px;margin-bottom:6px" id="scan-nombre">—</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap" id="scan-badges"></div>
        </div>

        <!-- Selector ENTRADA / SALIDA (aparece tras escaneo) -->
        <div id="scan-actions" style="display:none;width:100%">
          <label style="font-size:13px;color:var(--text2);margin-bottom:6px;display:block">Tipo de evento</label>
          <div style="display:flex;gap:10px">
            <button class="btn btn-primary" id="btn-entrada-qr" style="flex:1">▶ ENTRADA</button>
            <button class="btn btn-outline" id="btn-salida-qr" style="flex:1;border-color:#ef4444;color:#ef4444">◀ SALIDA</button>
          </div>
          <input class="form-control" id="scan-obs" placeholder="Observaciones (opcional)"
            style="margin-top:10px" />
        </div>

        <div id="scan-status" style="font-size:12px;color:var(--text3)">Iniciando cámara…</div>
      </div>`,
    confirmText: 'Cerrar',
    hideCancelBtn: true,
    onOpen: async (overlay) => {
      try {
        html5QrCode = new Html5Qrcode(scannerId);
        const config = { fps: 10, qrbox: { width: 220, height: 220 } };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => onQrDetected(overlay, decodedText),
          () => {} // ignore frame errors
        );
        scannerStarted = true;
        overlay.querySelector('#scan-status').textContent = 'Esperando QR…';
      } catch (err) {
        overlay.querySelector('#scan-status').textContent =
          'No se pudo acceder a la cámara. ' + (err.message || '');
        toast('Error al iniciar la cámara', 'error');
      }
    },
    onClose: async () => {
      if (html5QrCode && scannerStarted) {
        try { await html5QrCode.stop(); } catch {}
      }
    },
  });

  let lastQr = null;

  async function onQrDetected(overlay, codigoQr) {
    if (codigoQr === lastQr) return; // evitar registros duplicados por el mismo frame
    lastQr = codigoQr;

    // Pausar scanner
    if (html5QrCode && scannerStarted) {
      try { await html5QrCode.pause(); } catch {}
    }

    overlay.querySelector('#scan-status').textContent = 'QR detectado — verificando alumno…';

    // Registrar directamente (el backend valida el QR y retorna los datos del alumno)
    // Primero mostramos un preview vacío y pedimos al usuario que elija ENTRADA o SALIDA
    try {
      // Hacer una llamada "de prueba" vía el backend MVC para obtener datos del alumno
      // (El microservicio valida internamente; hacemos una llamada al API de alumnos del MVC)
      const alumno = await api.get(`/alumnos/qr/${codigoQr}`);

      // Mostrar resultado
      overlay.querySelector('#scan-result').style.display = 'block';
      overlay.querySelector('#scan-nombre').textContent = '🎒 ' + alumno.nombre;
      overlay.querySelector('#scan-badges').innerHTML = `
        <span class="badge badge-blue">${alumno.grado}</span>
        <span class="badge badge-gray">${alumno.seccion}</span>`;
      overlay.querySelector('#scan-actions').style.display = 'block';
      overlay.querySelector('#scan-status').textContent = 'Selecciona el tipo de evento:';

      // Botones ENTRADA / SALIDA
      overlay.querySelector('#btn-entrada-qr').onclick = () =>
        registrarAsistenciaAlumno(overlay, codigoQr, 'ENTRADA', container);
      overlay.querySelector('#btn-salida-qr').onclick = () =>
        registrarAsistenciaAlumno(overlay, codigoQr, 'SALIDA', container);

    } catch (err) {
      overlay.querySelector('#scan-status').textContent = '❌ QR inválido — alumno no encontrado';
      toast('QR no corresponde a ningún alumno', 'error');
      // Reanudar scanner para intentar de nuevo
      lastQr = null;
      if (html5QrCode && scannerStarted) {
        try { await html5QrCode.resume(); } catch {}
      }
    }
  }
}

async function registrarAsistenciaAlumno(overlay, codigoQr, tipoEvento, container) {
  const obs = overlay.querySelector('#scan-obs')?.value?.trim() || null;
  const body = {
    codigoQr,
    tipoEvento,
    horaEvento: null, // el servidor usa LocalDateTime.now()
    registradoPorId: store.id() ? Number(store.id()) : null,
    observaciones: obs,
  };
  try {
    await asistenciaAlumnosApi.registrar(body);
    toast(`${tipoEvento} del alumno registrada correctamente`, 'success');
    // Cerrar modal
    overlay.remove();
    // Recargar tabla de alumnos
    const fecha = container.querySelector('#filter-fecha-alumnos')?.value || todayISO();
    await loadAlumnos(container, fecha);
  } catch (err) {
    toast(err.message || 'Error al registrar asistencia', 'error');
  }
}
