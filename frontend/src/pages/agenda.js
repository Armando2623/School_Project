import { agendaApiClient } from '../api/agenda.js';
import { usuariosApi }     from '../api/usuarios.js';
import { toast }           from '../components/toast.js';
import { openModal }       from '../components/modal.js';
import { store }           from '../auth/store.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_CORTOS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const DIAS_ENUM   = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];

const TIPO_COLORS = {
  HORARIO_ATENCION: { bg: '#6366f1', light: '#eef2ff', text: '#4338ca', label: 'Atención' },
  REUNION:          { bg: '#f59e0b', light: '#fffbeb', text: '#b45309', label: 'Reunión'  },
  ACTIVIDAD:        { bg: '#10b981', light: '#ecfdf5', text: '#047857', label: 'Actividad' },
  OTRO:             { bg: '#64748b', light: '#f1f5f9', text: '#334155', label: 'Otro'      },
};

const ESTADO_COLORS = {
  ACTIVO:     { bg: '#dcfce7', text: '#16a34a', label: 'Activo'     },
  CANCELADO:  { bg: '#fee2e2', text: '#dc2626', label: 'Cancelado'  },
  COMPLETADO: { bg: '#e0e7ff', text: '#4338ca', label: 'Completado' },
};

const fmtHora = dt => dt ? new Date(dt).toLocaleTimeString('es-PE',
  { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtFecha = dt => dt ? new Date(dt).toLocaleDateString('es-PE',
  { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const isoDate = d => d.toISOString().split('T')[0];

// ─── Estado del módulo ─────────────────────────────────────────────────────────
let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-indexed
let allEventos   = [];
let allHorarios  = [];
let selectedDay  = null;
let activeTab    = 'calendario'; // 'calendario' | 'horarios'

// ─── Entry point ───────────────────────────────────────────────────────────────
export async function renderAgenda(container) {
  const canWrite  = store.hasRole('ADMINISTRADOR', 'DIRECTOR', 'PROFESOR');
  const canAdmin  = store.hasRole('ADMINISTRADOR', 'DIRECTOR');

  container.innerHTML = buildShell(canWrite, canAdmin);
  attachTabListeners(container);
  
  const initialProfesorId = store.hasRole('PROFESOR') ? store.id() : null;
  await loadData(initialProfesorId);
  
  renderCalendar(container);
  renderHorarioTable(container);
  attachActionListeners(container, canWrite, canAdmin);
}

// ─── HTML shell ───────────────────────────────────────────────────────────────
function buildShell(canWrite, canAdmin) {
  const isProfesor = store.hasRole('PROFESOR');
  return `
  <div class="page-topbar">
    <div>
      <h1><i class="fas fa-calendar-alt" style="color:var(--primary)"></i> Agenda de Profesores</h1>

    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      ${canWrite  ? `<button class="btn btn-primary" id="btn-new-evento"><i class="fas fa-plus"></i> Nuevo Evento</button>` : ''}
      ${canAdmin  ? `<button class="btn btn-outline"  id="btn-new-horario"><i class="fas fa-clock"></i> Nuevo Horario</button>` : ''}
    </div>
  </div>

  <!-- Tabs -->
  <div class="agenda-tabs">
    <button class="agenda-tab active" data-tab="calendario">
      <i class="fas fa-calendar-days"></i> Calendario
    </button>
    <button class="agenda-tab" data-tab="horarios">
      <i class="fas fa-table-list"></i> Horarios Semanales
    </button>
  </div>

  <!-- ═══ TAB CALENDARIO ═══ -->
  <div id="tab-calendario" class="tab-content">
    <div class="agenda-layout">

      <!-- Panel izquierdo: calendario mini + filtros -->
      <aside class="agenda-sidebar-panel">

        <!-- Calendario mensual -->
        <div class="cal-card">
          <div class="cal-nav">
            <button class="cal-nav-btn" id="cal-prev"><i class="fas fa-chevron-left"></i></button>
            <span class="cal-month-label" id="cal-month-label"></span>
            <button class="cal-nav-btn" id="cal-next"><i class="fas fa-chevron-right"></i></button>
          </div>
          <div class="cal-grid" id="cal-grid"></div>
        </div>

        <!-- Leyenda de tipos -->
        <div class="cal-legend">
          ${Object.entries(TIPO_COLORS).map(([k,v]) => `
            <div class="legend-item">
              <span class="legend-dot" style="background:${v.bg}"></span>
              <span>${v.label}</span>
            </div>`).join('')}
        </div>

        <!-- Filtros rápidos -->
        ${!isProfesor ? `
        <div class="cal-filters">
          <label class="filter-label">Filtrar por profesor (ID)</label>
          <div style="display:flex;gap:6px">
            <input type="number" id="filter-profesor" class="filter-input"
              placeholder="ID del profesor" min="1"/>
            <button class="btn btn-sm btn-outline" id="btn-filter-prof">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <button class="btn btn-sm btn-ghost" id="btn-clear-filter"
            style="width:100%;margin-top:6px">
            <i class="fas fa-times"></i> Limpiar filtro
          </button>
        </div>
        ` : ''}
      </aside>

      <!-- Panel derecho: eventos del día seleccionado + lista completa -->
      <div class="agenda-main-panel">

        <!-- Eventos del día seleccionado -->
        <div class="day-events-card" id="day-events-card">
          <div class="day-events-header" id="day-events-title">
            <i class="fas fa-calendar-day"></i> Selecciona un día en el calendario
          </div>
          <div id="day-events-list" class="day-events-list"></div>
        </div>

        <!-- Lista completa de eventos -->
        <div class="table-card">
          <div class="table-card-header">
            <div class="table-card-title">
              <span class="title-icon"><i class="fas fa-list"></i></span>
              Todos los Eventos
            </div>
            <div class="table-controls">
              <div class="search-box">
                <input type="text" id="search-eventos" placeholder="Buscar por profesor o título…" />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table" id="eventos-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Profesor</th>
                  <th>Fecha inicio</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Lugar</th>
                  ${canWrite ? '<th>Acciones</th>' : ''}
                </tr>
              </thead>
              <tbody id="eventos-tbody">
                <tr><td colspan="8" class="text-center" style="padding:30px;color:var(--text3)">
                  <i class="fas fa-spinner fa-spin"></i> Cargando…
                </td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ═══ TAB HORARIOS SEMANALES ═══ -->
  <div id="tab-horarios" class="tab-content" style="display:none">
    <div class="table-card">
      <div class="table-card-header">
        <div class="table-card-title">
          <span class="title-icon"><i class="fas fa-clock"></i></span>
          Horarios Semanales
        </div>
        <div class="table-controls">
          <select id="filter-dia" class="filter-select">
            <option value="">Todos los días</option>
            <option value="LUNES">Lunes</option>
            <option value="MARTES">Martes</option>
            <option value="MIERCOLES">Miércoles</option>
            <option value="JUEVES">Jueves</option>
            <option value="VIERNES">Viernes</option>
            <option value="SABADO">Sábado</option>
            <option value="DOMINGO">Domingo</option>
          </select>
        </div>
      </div>

      <!-- Vista tipo grilla de horario semanal -->
      <div id="horario-week-grid" class="horario-week-grid"></div>
    </div>
  </div>`;
}

// ─── Cargar datos ─────────────────────────────────────────────────────────────
async function loadData(profesorId = null) {
  try {
    const [eventos, horarios] = await Promise.all([
      profesorId
        ? agendaApiClient.listarPorProfesor(profesorId)
        : agendaApiClient.listarTodos(),
      profesorId
        ? agendaApiClient.listarHorariosPorProfesor(profesorId)
        : agendaApiClient.listarHorarios(),
    ]);
    allEventos  = eventos  || [];
    allHorarios = horarios || [];
  } catch (err) {
    toast(`Error cargando datos: ${err.message}`, 'error');
    allEventos  = [];
    allHorarios = [];
  }
}

// ─── Calendario ───────────────────────────────────────────────────────────────
function renderCalendar(container) {
  const label = container.querySelector('#cal-month-label');
  const grid  = container.querySelector('#cal-grid');
  if (!label || !grid) return;

  label.textContent = `${MESES[currentMonth]} ${currentYear}`;

  const firstDay  = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  // Cabeceras días
  let html = DIAS_CORTOS.map(d => `<div class="cal-day-header">${d}</div>`).join('');

  // Celdas vacías antes del primer día
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-cell cal-empty"></div>`;
  }

  // Días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentYear, currentMonth, d);
    const dateStr = isoDate(dateObj);
    const isToday = (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear());
    const isSelected = selectedDay === dateStr;

    // Eventos de este día
    const dayEvents = allEventos.filter(e => {
      const eDate = new Date(e.fechaInicio);
      return eDate.getFullYear() === currentYear &&
             eDate.getMonth()    === currentMonth &&
             eDate.getDate()     === d;
    });

    const dots = [...new Set(dayEvents.map(e => e.tipoAgenda))]
      .slice(0, 3)
      .map(t => `<span class="cal-dot" style="background:${TIPO_COLORS[t]?.bg ?? '#888'}"></span>`)
      .join('');

    html += `
      <div class="cal-cell ${isToday ? 'cal-today' : ''} ${isSelected ? 'cal-selected' : ''} ${dayEvents.length ? 'cal-has-events' : ''}"
           data-date="${dateStr}" data-count="${dayEvents.length}">
        <span class="cal-day-num">${d}</span>
        <div class="cal-dots">${dots}</div>
      </div>`;
  }

  grid.innerHTML = html;

  // Eventos de clic en celdas
  grid.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
    cell.addEventListener('click', () => {
      selectedDay = cell.dataset.date;
      renderCalendar(container);
      renderDayEvents(container, selectedDay);
    });
  });
}

// ─── Eventos del día ──────────────────────────────────────────────────────────
function renderDayEvents(container, dateStr) {
  const title = container.querySelector('#day-events-title');
  const list  = container.querySelector('#day-events-list');
  if (!title || !list) return;

  const d = new Date(dateStr + 'T00:00:00');
  title.innerHTML = `<i class="fas fa-calendar-day"></i>
    Eventos del ${d.getDate()} de ${MESES[d.getMonth()]} ${d.getFullYear()}`;

  const dayEvents = allEventos.filter(e => {
    const eDate = new Date(e.fechaInicio);
    return isoDate(eDate) === dateStr;
  });

  if (!dayEvents.length) {
    list.innerHTML = `<div class="day-empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>`;
    return;
  }

  list.innerHTML = dayEvents.map(e => {
    const tipo   = TIPO_COLORS[e.tipoAgenda]   ?? TIPO_COLORS.OTRO;
    const estado = ESTADO_COLORS[e.estado]      ?? ESTADO_COLORS.ACTIVO;
    return `
      <div class="day-event-item" style="border-left:4px solid ${tipo.bg}">
        <div class="day-event-header">
          <span class="day-event-tipo" style="background:${tipo.light};color:${tipo.text}">
            ${tipo.label}
          </span>
          <span class="day-event-estado" style="background:${estado.bg};color:${estado.text}">
            ${estado.label}
          </span>
        </div>
        <div class="day-event-title">${e.titulo}</div>
        <div class="day-event-meta">
          <span><i class="fas fa-user-tie"></i> ${e.nombreProfesor}</span>
          <span><i class="fas fa-clock"></i> ${fmtHora(e.fechaInicio)} – ${fmtHora(e.fechaFin)}</span>
          ${e.lugar ? `<span><i class="fas fa-location-dot"></i> ${e.lugar}</span>` : ''}
          ${e.recurrente ? `<span><i class="fas fa-rotate"></i> Recurrente — ${e.diaSemana ?? ''}</span>` : ''}
        </div>
        ${e.descripcion ? `<div class="day-event-desc">${e.descripcion}</div>` : ''}
      </div>`;
  }).join('');
}

// ─── Tabla de eventos ─────────────────────────────────────────────────────────
function renderEventosTable(container, filtro = '') {
  const tbody = container.querySelector('#eventos-tbody');
  if (!tbody) return;

  const canWrite = store.hasRole('ADMINISTRADOR', 'DIRECTOR', 'PROFESOR');
  const canAdmin = store.hasRole('ADMINISTRADOR', 'DIRECTOR');

  let data = allEventos;
  if (filtro) {
    const q = filtro.toLowerCase();
    data = data.filter(e =>
      e.nombreProfesor?.toLowerCase().includes(q) ||
      e.titulo?.toLowerCase().includes(q) ||
      e.especialidad?.toLowerCase().includes(q)
    );
  }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:30px;color:var(--text3)">
      <i class="fas fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:6px"></i>
      Sin eventos registrados
    </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(e => {
    const tipo   = TIPO_COLORS[e.tipoAgenda]   ?? TIPO_COLORS.OTRO;
    const estado = ESTADO_COLORS[e.estado]      ?? ESTADO_COLORS.ACTIVO;
    return `
      <tr>
        <td>
          <span class="badge-tipo" style="background:${tipo.light};color:${tipo.text}">
            ${tipo.label}
          </span>
        </td>
        <td><strong>${e.titulo}</strong>
          ${e.recurrente ? `<span class="recurrente-tag"><i class="fas fa-rotate"></i></span>` : ''}
        </td>
        <td>
          <div style="font-weight:500">${e.nombreProfesor}</div>
          ${e.especialidad ? `<div style="font-size:11px;color:var(--text3)">${e.especialidad}</div>` : ''}
        </td>
        <td>${fmtFecha(e.fechaInicio)}</td>
        <td style="font-variant-numeric:tabular-nums;font-size:13px">
          ${fmtHora(e.fechaInicio)} – ${fmtHora(e.fechaFin)}
        </td>
        <td><span class="badge-estado" style="background:${estado.bg};color:${estado.text}">${estado.label}</span></td>
        <td style="color:var(--text2);font-size:13px">${e.lugar ?? '—'}</td>
        ${canWrite ? `
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline btn-edit-evento" data-id="${e.id}"
              title="Editar"><i class="fas fa-pen"></i></button>
            ${canAdmin ? `
            <button class="btn btn-sm btn-danger btn-del-evento" data-id="${e.id}"
              title="Eliminar"><i class="fas fa-trash"></i></button>` : ''}
          </div>
        </td>` : ''}
      </tr>`;
  }).join('');

  // Listeners de editar/eliminar
  container.querySelectorAll('.btn-edit-evento').forEach(btn => {
    btn.addEventListener('click', () => {
      const ev = allEventos.find(e => e.id == btn.dataset.id);
      if (ev) openEventoModal(container, ev);
    });
  });
  container.querySelectorAll('.btn-del-evento').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(container, btn.dataset.id, 'evento'));
  });
}

// ─── Grilla de horarios semanales ─────────────────────────────────────────────
function renderHorarioTable(container, diaFiltro = '') {
  const grid = container.querySelector('#horario-week-grid');
  if (!grid) return;

  const dias = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'];
  const diasLabel = { LUNES:'Lunes',MARTES:'Martes',MIERCOLES:'Miércoles',
    JUEVES:'Jueves',VIERNES:'Viernes',SABADO:'Sábado',DOMINGO:'Domingo' };

  const canAdmin = store.hasRole('ADMINISTRADOR', 'DIRECTOR');

  const diasToShow = diaFiltro ? [diaFiltro] : dias;
  const data = allHorarios;

  if (!data.length) {
    grid.innerHTML = `<div class="day-empty" style="padding:40px;text-align:center">
      <i class="fas fa-calendar-week" style="font-size:2rem;color:var(--text3);display:block;margin-bottom:10px"></i>
      <span style="color:var(--text3)">Sin horarios registrados</span>
    </div>`;
    return;
  }

  grid.innerHTML = diasToShow.map(dia => {
    const blocks = data.filter(h => h.diaSemana === dia && h.activo);
    if (!blocks.length) return '';
    return `
      <div class="week-day-col">
        <div class="week-day-header">${diasLabel[dia]}</div>
        <div class="week-day-body">
          ${blocks.map(h => `
            <div class="week-block" style="border-left:4px solid var(--primary)">
              <div class="week-block-time">${h.horaInicio?.slice(0,5) ?? ''} – ${h.horaFin?.slice(0,5) ?? ''}</div>
              <div class="week-block-materia">${h.materia}</div>
              <div class="week-block-meta">
                <span><i class="fas fa-user-tie"></i> ${h.nombreProfesor}</span>
                ${h.aula ? `<span><i class="fas fa-door-open"></i> ${h.aula}</span>` : ''}
              </div>
              ${!h.activo ? `<span class="week-inactive">Inactivo</span>` : ''}
              ${canAdmin ? `
              <div class="week-block-actions">
                <button class="btn btn-sm btn-outline btn-edit-horario" data-id="${h.id}"
                  title="Editar"><i class="fas fa-pen"></i></button>
                <button class="btn btn-sm btn-danger btn-del-horario" data-id="${h.id}"
                  title="Eliminar"><i class="fas fa-trash"></i></button>
              </div>` : ''}
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('.btn-edit-horario').forEach(btn => {
    btn.addEventListener('click', () => {
      const h = allHorarios.find(x => x.id == btn.dataset.id);
      if (h) openHorarioModal(container, h);
    });
  });
  container.querySelectorAll('.btn-del-horario').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(container, btn.dataset.id, 'horario'));
  });
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function attachTabListeners(container) {
  container.addEventListener('click', e => {
    const tab = e.target.closest('.agenda-tab');
    if (!tab) return;
    activeTab = tab.dataset.tab;
    container.querySelectorAll('.agenda-tab').forEach(t => t.classList.toggle('active', t === tab));
    container.querySelectorAll('.tab-content').forEach(c => {
      c.style.display = c.id === `tab-${activeTab}` ? '' : 'none';
    });
    if (activeTab === 'horarios') renderHorarioTable(container);
  });
}

// ─── Listeners de acciones ────────────────────────────────────────────────────
function attachActionListeners(container, canWrite, canAdmin) {
  // Navegación del calendario
  container.querySelector('#cal-prev')?.addEventListener('click', () => {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else currentMonth--;
    renderCalendar(container);
    if (selectedDay) renderDayEvents(container, selectedDay);
  });
  container.querySelector('#cal-next')?.addEventListener('click', () => {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else currentMonth++;
    renderCalendar(container);
    if (selectedDay) renderDayEvents(container, selectedDay);
  });

  // Filtro por profesor
  container.querySelector('#btn-filter-prof')?.addEventListener('click', async () => {
    const id = container.querySelector('#filter-profesor')?.value?.trim();
    await loadData(id ? Number(id) : null);
    renderCalendar(container);
    renderEventosTable(container);
    renderHorarioTable(container);
    if (selectedDay) renderDayEvents(container, selectedDay);
  });

  container.querySelector('#btn-clear-filter')?.addEventListener('click', async () => {
    const input = container.querySelector('#filter-profesor');
    if (input) input.value = '';
    await loadData(null);
    renderCalendar(container);
    renderEventosTable(container);
    renderHorarioTable(container);
    if (selectedDay) renderDayEvents(container, selectedDay);
  });

  // Búsqueda en tabla
  container.querySelector('#search-eventos')?.addEventListener('input', e => {
    renderEventosTable(container, e.target.value);
  });

  // Filtro día en horarios
  container.querySelector('#filter-dia')?.addEventListener('change', e => {
    renderHorarioTable(container, e.target.value);
  });

  // Botón nuevo evento
  container.querySelector('#btn-new-evento')?.addEventListener('click', () => {
    openEventoModal(container, null);
  });

  // Botón nuevo horario
  container.querySelector('#btn-new-horario')?.addEventListener('click', () => {
    openHorarioModal(container, null);
  });

  // Render inicial de tabla
  renderEventosTable(container);
}

// ─── Modal Evento ─────────────────────────────────────────────────────────────
function openEventoModal(container, evento) {
  const isEdit = !!evento;
  const title  = isEdit ? 'Editar Evento de Agenda' : 'Nuevo Evento de Agenda';

  const isProfesor = store.hasRole('PROFESOR');
  const profIdVal = evento?.profesorId ?? (isProfesor ? store.id() : '');
  const profNameVal = evento?.nombreProfesor ?? (isProfesor ? store.nombre() : '');

  const toInput = v => v ? v.replace('T', 'T').substring(0, 16) : '';

  const body = `
    <div class="form-grid-2">
      <div class="form-group" style="grid-column:1/-1">
        <label>Título del evento *</label>
        <input id="ev-titulo" class="form-input" value="${evento?.titulo ?? ''}" placeholder="Ej: Horario de atención" />
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Profesor *</label>
        <div class="profesor-search-wrap" id="ev-profesor-wrap">
          <div class="profesor-search-input-row">
            <i class="fas fa-search profesor-search-icon"></i>
            <input id="ev-profesor-search" class="form-input profesor-search-input"
              placeholder="Escribe el nombre del profesor…"
              value="${profNameVal}" autocomplete="off" ${isProfesor ? 'disabled' : ''}/>
          </div>
          <div class="profesor-search-dropdown" id="ev-profesor-dropdown"></div>
          <input type="hidden" id="ev-profesorId" value="${profIdVal}"/>
          <input type="hidden" id="ev-nombreProfesor" value="${profNameVal}"/>
        </div>
      </div>
      <div class="form-group">
        <label>Especialidad</label>
        <input id="ev-especialidad" class="form-input" value="${evento?.especialidad ?? ''}" placeholder="Ej: Matemáticas"/>
      </div>
      <div class="form-group">
        <label>Tipo *</label>
        <select id="ev-tipo" class="form-select">
          ${Object.entries(TIPO_COLORS).map(([k,v]) =>
            `<option value="${k}" ${evento?.tipoAgenda===k?'selected':''}>${v.label}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Fecha del Evento *</label>
        <input id="ev-fecha" type="date" class="form-input" value="${evento ? isoDate(new Date(evento.fechaInicio)) : (selectedDay ?? isoDate(new Date()))}"/>
      </div>
      <div class="form-group">
        <label>Horario de Atención *</label>
        <select id="ev-horario-select" class="form-select">
          <option value="">Seleccione un profesor primero...</option>
        </select>
      </div>
      <input type="hidden" id="ev-inicio" value="${evento?.fechaInicio ? toInput(evento.fechaInicio) : ''}"/>
      <input type="hidden" id="ev-fin" value="${evento?.fechaFin ? toInput(evento.fechaFin) : ''}"/>
      <div id="ev-fecha-warning" class="form-warning-message" style="display:none;grid-column:1/-1;margin-top:5px;color:#d97706;background:#fffbeb;padding:8px;border-radius:4px;border:1px solid #fef3c7;font-size:12px;"></div>
      <div class="form-group">
        <label>Estado</label>
        <select id="ev-estado" class="form-select">
          ${Object.entries(ESTADO_COLORS).map(([k,v]) =>
            `<option value="${k}" ${evento?.estado===k?'selected':''}>${v.label}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Lugar</label>
        <input id="ev-lugar" class="form-input" value="${evento?.lugar ?? ''}" placeholder="Ej: Aula 201"/>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="ev-recurrente" ${evento?.recurrente ? 'checked' : ''}/>
          Evento recurrente (semanal)
        </label>
      </div>
      <div class="form-group" id="dia-semana-group" style="${evento?.recurrente?'':'display:none'}">
        <label>Día de la semana</label>
        <select id="ev-diaSemana" class="form-select">
          ${DIAS_ENUM.map(d => `<option value="${d}" ${evento?.diaSemana===d?'selected':''}>${d.charAt(0)+d.slice(1).toLowerCase()}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Descripción</label>
        <textarea id="ev-descripcion" class="form-input" rows="3" placeholder="Descripción opcional…">${evento?.descripcion ?? ''}</textarea>
      </div>
    </div>`;

  openModal({
    title,
    bodyHTML: body,
    onConfirm: async (overlay, close) => {
      const payload = {
        profesorId:     Number(document.getElementById('ev-profesorId').value),
        nombreProfesor: document.getElementById('ev-nombreProfesor').value.trim(),
        especialidad:   document.getElementById('ev-especialidad').value.trim() || null,
        titulo:         document.getElementById('ev-titulo').value.trim(),
        descripcion:    document.getElementById('ev-descripcion').value.trim() || null,
        fechaInicio:    document.getElementById('ev-inicio').value,
        fechaFin:       document.getElementById('ev-fin').value,
        tipoAgenda:     document.getElementById('ev-tipo').value,
        estado:         document.getElementById('ev-estado').value,
        lugar:          document.getElementById('ev-lugar').value.trim() || null,
        recurrente:     document.getElementById('ev-recurrente').checked,
        diaSemana:      document.getElementById('ev-recurrente').checked
                          ? document.getElementById('ev-diaSemana').value : null,
      };

      if (!payload.profesorId || !payload.nombreProfesor || !payload.titulo || !payload.fechaInicio || !payload.fechaFin) {
        toast('Completa los campos obligatorios (*)', 'error'); return;
      }

      try {
        if (isEdit) {
          await agendaApiClient.actualizar(evento.id, payload);
          toast('Evento actualizado correctamente', 'success');
        } else {
          await agendaApiClient.crear(payload);
          toast('Evento creado correctamente', 'success');
        }
        const initialProfesorId = store.hasRole('PROFESOR') ? store.id() : null;
        await loadData(initialProfesorId);
        renderCalendar(container);
        renderEventosTable(container);
        if (selectedDay) renderDayEvents(container, selectedDay);
        close();
      } catch (err) {
        toast(`Error: ${err.message}`, 'error');
      }
    }
  });

  // Inicializar buscador de profesores y toggle día de semana
  setTimeout(() => {
    const getDiaSemanaFromDate = (dateStr) => {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayIndex = date.getDay(); // 0: DOMINGO, 1: LUNES, etc.
      const mapping = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
      return mapping[dayIndex];
    };

    const getNextDateForWeekday = (targetWeekdayStr) => {
      const mapping = {
        DOMINGO: 0, LUNES: 1, MARTES: 2, MIERCOLES: 3, JUEVES: 4, VIERNES: 5, SABADO: 6
      };
      const targetDayIndex = mapping[targetWeekdayStr];
      if (targetDayIndex === undefined) return null;

      const today = new Date();
      const currentDayIndex = today.getDay(); // 0: DOMINGO, 1: LUNES, etc.

      let diff = targetDayIndex - currentDayIndex;
      if (diff < 0) {
        diff += 7;
      }
      
      const resultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diff);
      const yyyy = resultDate.getFullYear();
      const mm = String(resultDate.getMonth() + 1).padStart(2, '0');
      const dd = String(resultDate.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const updateEventTimes = (isInitialLoadOrUserChangeDate = false) => {
      const select = document.getElementById('ev-horario-select');
      if (!select) return;
      const selectedOption = select.options[select.selectedIndex];
      
      const fechaInput = document.getElementById('ev-fecha');
      const inicioInput = document.getElementById('ev-inicio');
      const finInput = document.getElementById('ev-fin');
      
      if (selectedOption && selectedOption.dataset.dia) {
        const diaSemana = selectedOption.dataset.dia;
        
        // Si no es la carga inicial ni un cambio manual del usuario en el campo fecha,
        // calculamos la fecha próxima correspondiente al día de la semana.
        if (!isInitialLoadOrUserChangeDate && fechaInput) {
          const nextDate = getNextDateForWeekday(diaSemana);
          if (nextDate) {
            fechaInput.value = nextDate;
          }
        }
      }
      
      const fechaVal = fechaInput?.value;
      if (fechaVal && selectedOption && selectedOption.dataset.inicio && selectedOption.dataset.fin) {
        const horaInicio = selectedOption.dataset.inicio;
        const horaFin = selectedOption.dataset.fin;
        
        if (inicioInput) inicioInput.value = `${fechaVal}T${horaInicio}`;
        if (finInput) finInput.value = `${fechaVal}T${horaFin}`;
        
        const diaSemana = selectedOption.dataset.dia;
        const diaSemanaSelect = document.getElementById('ev-diaSemana');
        if (diaSemana && diaSemanaSelect) {
          diaSemanaSelect.value = diaSemana;
        }

        // Auto-llenar especialidad con la materia del horario seleccionado
        const materia = selectedOption.dataset.materia;
        const espInput = document.getElementById('ev-especialidad');
        if (materia && espInput) {
          espInput.value = materia;
        }

        // Validación de coincidencia de día de la semana
        const warningEl = document.getElementById('ev-fecha-warning');
        if (diaSemana) {
          const dateDia = getDiaSemanaFromDate(fechaVal);
          if (dateDia !== diaSemana) {
            const diasEsp = {
              LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
              JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo'
            };
            const selectedDiaLabel = diasEsp[diaSemana] || diaSemana;
            const dateDiaLabel = diasEsp[dateDia] || dateDia;
            if (warningEl) {
              warningEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> La fecha seleccionada es <strong>${dateDiaLabel}</strong>, pero el horario seleccionado es para los <strong>${selectedDiaLabel}</strong>.`;
              warningEl.style.display = 'block';
            }
          } else {
            if (warningEl) {
              warningEl.style.display = 'none';
              warningEl.innerHTML = '';
            }
          }
        } else {
          if (warningEl) {
            warningEl.style.display = 'none';
            warningEl.innerHTML = '';
          }
        }
      } else {
        if (inicioInput) inicioInput.value = '';
        if (finInput) finInput.value = '';
        const warningEl = document.getElementById('ev-fecha-warning');
        if (warningEl) {
          warningEl.style.display = 'none';
          warningEl.innerHTML = '';
        }
      }
    };

    const loadProfesorHorarios = async (profId) => {
      const select = document.getElementById('ev-horario-select');
      if (!select) return;
      select.innerHTML = '<option value="">Cargando horarios...</option>';
      try {
        const horarios = await agendaApiClient.listarHorariosPorProfesor(profId);
        const activos = (horarios || []).filter(h => h.activo);

        // Auto-llenar especialidad del profesor
        const existingEspecialidad = allEventos.find(e => e.profesorId == profId && e.especialidad)?.especialidad
          || activos.find(h => h.materia)?.materia
          || allHorarios.find(h => h.profesorId == profId && h.materia)?.materia
          || '';
        const espInput = document.getElementById('ev-especialidad');
        if (espInput && existingEspecialidad) {
          espInput.value = existingEspecialidad;
        }

        if (activos.length === 0) {
          select.innerHTML = '<option value="">El profesor no tiene horarios registrados</option>';
          updateEventTimes(true);
          return;
        }

        const diasEsp = {
          LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
          JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo'
        };

        let optionsHtml = '<option value="">Seleccione un horario...</option>';
        activos.forEach(h => {
          const inicio = h.horaInicio.slice(0, 5);
          const fin = h.horaFin.slice(0, 5);
          const diaLabel = diasEsp[h.diaSemana] || h.diaSemana;
          let isSelected = false;
          if (evento) {
            const evInicioStr = toInput(evento.fechaInicio).split('T')[1];
            const evFinStr = toInput(evento.fechaFin).split('T')[1];
            if (evInicioStr === inicio && evFinStr === fin && h.diaSemana === evento.diaSemana) {
              isSelected = true;
            }
          }
          optionsHtml += `<option value="${h.id}" data-inicio="${inicio}" data-fin="${fin}" data-dia="${h.diaSemana}" data-materia="${h.materia}" ${isSelected ? 'selected' : ''}>
            ${diaLabel}: ${inicio} - ${fin} (${h.materia}${h.aula ? ' · ' + h.aula : ''})
          </option>`;
        });

        if (evento) {
          const evInicioTime = toInput(evento.fechaInicio).split('T')[1];
          const evFinTime = toInput(evento.fechaFin).split('T')[1];
          const hasMatch = activos.some(h => h.horaInicio.slice(0, 5) === evInicioTime && h.horaFin.slice(0, 5) === evFinTime && h.diaSemana === evento.diaSemana);
          if (!hasMatch) {
            const diaLabel = diasEsp[evento.diaSemana] || evento.diaSemana || '';
            optionsHtml = `<option value="original" data-inicio="${evInicioTime}" data-fin="${evFinTime}" data-dia="${evento.diaSemana}" selected>
              [Horario Original] ${diaLabel ? diaLabel + ': ' : ''}${evInicioTime} - ${evFinTime}
            </option>` + optionsHtml;
          }
        }

        select.innerHTML = optionsHtml;
        updateEventTimes(true);
      } catch (err) {
        select.innerHTML = '<option value="">Error al cargar horarios</option>';
        console.error(err);
      }
    };

    initProfesorSearch('ev-profesor-search', 'ev-profesor-dropdown', 'ev-profesorId', 'ev-nombreProfesor', async (profId) => {
      if (profId) {
        await loadProfesorHorarios(profId);
      } else {
        const select = document.getElementById('ev-horario-select');
        if (select) select.innerHTML = '<option value="">Seleccione un profesor primero...</option>';
        updateEventTimes(true);
      }
    });

    document.getElementById('ev-recurrente')?.addEventListener('change', e => {
      document.getElementById('dia-semana-group').style.display = e.target.checked ? '' : 'none';
    });

    document.getElementById('ev-fecha')?.addEventListener('change', () => updateEventTimes(true));
    document.getElementById('ev-horario-select')?.addEventListener('change', () => updateEventTimes(false));

    // Si está editando, cargar horarios del profesor inicialmente
    const initialProfId = document.getElementById('ev-profesorId')?.value;
    if (initialProfId) {
      loadProfesorHorarios(initialProfId);
    }
  }, 50);
}

// ─── Modal Horario ─────────────────────────────────────────────────────────────
function openHorarioModal(container, horario) {
  const isEdit = !!horario;
  const title  = isEdit ? 'Editar Horario Semanal' : 'Nuevo Horario Semanal';

  const isProfesor = store.hasRole('PROFESOR');
  const profIdVal = horario?.profesorId ?? (isProfesor ? store.id() : '');
  const profNameVal = horario?.nombreProfesor ?? (isProfesor ? store.nombre() : '');

  const body = `
    <div class="form-grid-2">
      <div class="form-group" style="grid-column:1/-1">
        <label>Profesor *</label>
        <div class="profesor-search-wrap" id="h-profesor-wrap">
          <div class="profesor-search-input-row">
            <i class="fas fa-search profesor-search-icon"></i>
            <input id="h-profesor-search" class="form-input profesor-search-input"
              placeholder="Escribe el nombre del profesor…"
              value="${profNameVal}" autocomplete="off" ${isProfesor ? 'disabled' : ''}/>
          </div>
          <div class="profesor-search-dropdown" id="h-profesor-dropdown"></div>
          <input type="hidden" id="h-profesorId" value="${profIdVal}"/>
          <input type="hidden" id="h-nombreProfesor" value="${profNameVal}"/>
        </div>
      </div>
      <div class="form-group">
        <label>Día de la semana *</label>
        <select id="h-dia" class="form-select">
          ${DIAS_ENUM.map(d => `<option value="${d}" ${horario?.diaSemana===d?'selected':''}>${d.charAt(0)+d.slice(1).toLowerCase()}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Materia *</label>
        <input id="h-materia" class="form-input" value="${horario?.materia ?? ''}" placeholder="Ej: Matemáticas"/>
      </div>
      <div class="form-group">
        <label>Hora inicio *</label>
        <input id="h-inicio" type="time" class="form-input" value="${horario?.horaInicio?.slice(0,5) ?? ''}"/>
      </div>
      <div class="form-group">
        <label>Hora fin *</label>
        <input id="h-fin" type="time" class="form-input" value="${horario?.horaFin?.slice(0,5) ?? ''}"/>
      </div>
      <div class="form-group">
        <label>Aula</label>
        <input id="h-aula" class="form-input" value="${horario?.aula ?? ''}" placeholder="Ej: Aula 201"/>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="h-activo" ${horario === null || horario?.activo ? 'checked' : ''}/>
          Horario activo
        </label>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Observaciones</label>
        <textarea id="h-obs" class="form-input" rows="2" placeholder="Observaciones opcionales…">${horario?.observaciones ?? ''}</textarea>
      </div>
    </div>`;

  openModal({
    title,
    bodyHTML: body,
    onConfirm: async (overlay, close) => {
      const payload = {
        profesorId:     Number(document.getElementById('h-profesorId').value),
        nombreProfesor: document.getElementById('h-nombreProfesor').value.trim(),
        diaSemana:      document.getElementById('h-dia').value,
        horaInicio:     document.getElementById('h-inicio').value,
        horaFin:        document.getElementById('h-fin').value,
        materia:        document.getElementById('h-materia').value.trim(),
        aula:           document.getElementById('h-aula').value.trim() || null,
        activo:         document.getElementById('h-activo').checked,
        observaciones:  document.getElementById('h-obs').value.trim() || null,
      };

      if (!payload.profesorId || !payload.nombreProfesor || !payload.horaInicio || !payload.horaFin || !payload.materia) {
        toast('Completa los campos obligatorios (*)', 'error'); return;
      }

      try {
        if (isEdit) {
          await agendaApiClient.actualizarHorario(horario.id, payload);
          toast('Horario actualizado correctamente', 'success');
        } else {
          await agendaApiClient.crearHorario(payload);
          toast('Horario creado correctamente', 'success');
        }
        const initialProfesorId = store.hasRole('PROFESOR') ? store.id() : null;
        await loadData(initialProfesorId);
        renderHorarioTable(container);
        close();
      } catch (err) {
        toast(`Error: ${err.message}`, 'error');
      }
    }
  });

  // Inicializar buscador de profesores
  setTimeout(() => {
    initProfesorSearch('h-profesor-search', 'h-profesor-dropdown', 'h-profesorId', 'h-nombreProfesor', (profId) => {
      if (profId) {
        const existingMateria = allHorarios.find(h => h.profesorId == profId && h.materia)?.materia
          || allEventos.find(e => e.profesorId == profId && e.especialidad)?.especialidad
          || '';
        const materiaInput = document.getElementById('h-materia');
        if (materiaInput && existingMateria) {
          materiaInput.value = existingMateria;
        }
      }
    });

    // Si es profesor y es nuevo, rellenar materia inicialmente
    if (isProfesor && !horario) {
      const existingMateria = allHorarios.find(h => h.profesorId == store.id() && h.materia)?.materia
        || allEventos.find(e => e.profesorId == store.id() && e.especialidad)?.especialidad
        || '';
      const materiaInput = document.getElementById('h-materia');
      if (materiaInput && existingMateria) {
        materiaInput.value = existingMateria;
      }
    }
  }, 50);
}

// ─── Autocomplete de profesores ───────────────────────────────────────────────
async function initProfesorSearch(searchId, dropdownId, hiddenIdField, hiddenNameField, onSelect) {
  const searchInput = document.getElementById(searchId);
  const dropdown    = document.getElementById(dropdownId);
  const hiddenId    = document.getElementById(hiddenIdField);
  const hiddenName  = document.getElementById(hiddenNameField);
  if (!searchInput || !dropdown) return;
  if (store.hasRole('PROFESOR')) return;

  let profesores = [];
  try {
    const todos = await usuariosApi.listar();
    profesores = (todos || []).filter(u => u.rol === 'PROFESOR');
  } catch (_) { /* sin conexión: lista vacía */ }

  function renderDropdown(filtro) {
    const q = filtro.trim().toLowerCase();
    const resultados = q
      ? profesores.filter(p => p.nombre?.toLowerCase().includes(q))
      : profesores;

    if (!resultados.length) {
      dropdown.innerHTML = `<div class="profesor-no-result"><i class="fas fa-user-slash"></i> Sin resultados</div>`;
      dropdown.classList.add('open');
      return;
    }
    dropdown.innerHTML = resultados.map(p => `
      <div class="profesor-option" data-id="${p.id}" data-nombre="${p.nombre}">
        <span class="profesor-option-avatar">${p.nombre.charAt(0).toUpperCase()}</span>
        <div class="profesor-option-info">
          <span class="profesor-option-name">${p.nombre}</span>
          <span class="profesor-option-role">ID: ${p.id} · Profesor</span>
        </div>
      </div>`).join('');
    dropdown.classList.add('open');

    dropdown.querySelectorAll('.profesor-option').forEach(opt => {
      opt.addEventListener('mousedown', e => {
        e.preventDefault();
        hiddenId.value   = opt.dataset.id;
        hiddenName.value = opt.dataset.nombre;
        searchInput.value = opt.dataset.nombre;
        searchInput.classList.add('profesor-selected');
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        if (typeof onSelect === 'function') onSelect(opt.dataset.id);
      });
    });
  }

  searchInput.addEventListener('input', () => {
    // Si el usuario escribe de nuevo, limpiar la selección
    hiddenId.value   = '';
    hiddenName.value = '';
    searchInput.classList.remove('profesor-selected');
    renderDropdown(searchInput.value);
    if (typeof onSelect === 'function') onSelect(null);
  });

  searchInput.addEventListener('focus', () => {
    renderDropdown(searchInput.value);
  });

  searchInput.addEventListener('blur', () => {
    // Pequeño delay para permitir que el click en la opción se registre
    setTimeout(() => {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      // Si no se seleccionó nada y hay texto, limpiar
      if (!hiddenId.value && searchInput.value.trim()) {
        const match = profesores.find(p =>
          p.nombre.toLowerCase() === searchInput.value.trim().toLowerCase()
        );
        if (match) {
          hiddenId.value   = match.id;
          hiddenName.value = match.nombre;
          searchInput.classList.add('profesor-selected');
          if (typeof onSelect === 'function') onSelect(match.id);
        }
      }
    }, 200);
  });
}

// ─── Confirmación de eliminación ──────────────────────────────────────────────
function confirmDelete(container, id, tipo) {
  const title = tipo === 'evento' ? 'Eliminar Evento' : 'Eliminar Horario';
  const body  = `<p style="color:var(--text2);line-height:1.6">
    ¿Estás seguro que deseas eliminar este ${tipo === 'evento' ? 'evento de agenda' : 'bloque de horario'}?
    <strong>Esta acción no se puede deshacer.</strong>
  </p>`;

  openModal({
    title,
    bodyHTML: body,
    onConfirm: async (overlay, close) => {
      try {
        if (tipo === 'evento') {
          await agendaApiClient.eliminar(id);
          toast('Evento eliminado', 'success');
        } else {
          await agendaApiClient.eliminarHorario(id);
          toast('Horario eliminado', 'success');
        }
        const initialProfesorId = store.hasRole('PROFESOR') ? store.id() : null;
        await loadData(initialProfesorId);
        renderCalendar(container);
        renderEventosTable(container);
        renderHorarioTable(container);
        if (selectedDay) renderDayEvents(container, selectedDay);
        close();
      } catch (err) {
        toast(`Error: ${err.message}`, 'error');
      }
    }
  });
}
