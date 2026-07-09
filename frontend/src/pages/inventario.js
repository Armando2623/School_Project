import { inventarioApi } from '../api/inventario.js';
import { MVC_URL }      from '../api/client.js';
import { openModal }     from '../components/modal.js';
import { toast }         from '../components/toast.js';
import { store }         from '../auth/store.js';

let areas = [];
let articulos = [];
let selectedAreaId = null;
let currentSearch = '';

// ── Paginación ──
let currentPage = 1;
const PAGE_SIZE = 10;

const canEdit = () => store.hasRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'ENCARGADO_INVENTARIO');

const ESTADO_BADGES = {
  EXCELENTE:        'badge-green',
  BUENO:            'badge-blue',
  REGULAR:          'badge-yellow',
  DETERIORADO:      'badge-red',
  EN_MANTENIMIENTO: 'badge-purple'
};

export async function renderInventario(container) {
  selectedAreaId = null;
  currentSearch = '';
  currentPage = 1;

  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1><i class="fas fa-boxes" style="color:var(--primary)"></i> Inventario & Logística</h1>
        <div class="sub">Control de activos por aula e infraestructura</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-outline" id="btn-download-csv" style="display:none"><i class="fas fa-file-csv"></i> Descargar CSV</button>
        ${canEdit() ? `
          <button class="btn btn-outline" id="btn-new-area"><i class="fas fa-folder-plus"></i> Nueva Área / Aula</button>
          <button class="btn btn-primary" id="btn-new-articulo"><i class="fas fa-plus"></i> Nuevo Artículo</button>
        ` : ''}
      </div>
    </div>

    <div class="page-body inv-layout">
      
      <!-- Panel de Áreas/Aulas (desktop: sidebar, mobile: dropdown) -->
      <div class="inv-areas-panel table-card">
        <div style="font-weight:700;font-size:0.9rem;color:var(--text3);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">
          🏫 Áreas y Aulas
        </div>
        <!-- Dropdown para móvil -->
        <select id="areas-select-mobile" class="form-control inv-areas-select-mobile">
          <option value="">— Selecciona un área —</option>
        </select>
        <!-- Lista para desktop -->
        <div id="areas-list-container" class="inv-areas-list">
          <div style="text-align:center;color:var(--text3);padding:10px">Cargando...</div>
        </div>
      </div>

      <!-- Tabla de Artículos -->
      <div class="table-card inv-table-panel">
        <div class="table-card-header">
          <div class="table-card-title" id="table-title">🎒 Artículos en el Área</div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input id="search-articulos" placeholder="Buscar por nombre o código..." />
            </div>
            <span id="total-articulos" class="badge badge-blue">—</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código de Barras</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th style="width:120px">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbody-articulos">
              <tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Selecciona un área para ver sus ítems</td></tr>
            </tbody>
          </table>
        </div>
        <!-- Paginación -->
        <div class="pagination-bar" id="pagination-bar"></div>
        <div class="table-card-footer"><span id="footer-inventario">—</span></div>
      </div>

    </div>`;

  await loadAreas(container);

  // Listeners de los botones principales
  container.querySelector('#btn-new-area')?.addEventListener('click', () => openAreaModal(container));
  container.querySelector('#btn-new-articulo')?.addEventListener('click', () => openArticuloModal(container));
  container.querySelector('#btn-download-csv')?.addEventListener('click', () => downloadCSV());

  // Buscador de artículos
  container.querySelector('#search-articulos').addEventListener('input', e => {
    currentSearch = e.target.value.toLowerCase().trim();
    currentPage = 1;
    filterAndDraw(container);
  });

  // Dropdown de áreas para móvil
  container.querySelector('#areas-select-mobile').addEventListener('change', e => {
    const areaId = Number(e.target.value);
    if (!areaId) return;
    selectedAreaId = areaId;
    currentPage = 1;
    const areaObj = areas.find(a => a.id === selectedAreaId);
    container.querySelector('#table-title').innerHTML = `📦 ${areaObj.nombre} <span style="font-weight:400;font-size:0.8rem;color:var(--text3)">(${areaObj.tipo})</span>`;
    // Sync desktop sidebar highlight
    const list = container.querySelector('#areas-list-container');
    list.querySelectorAll('.area-selector-btn').forEach(b => b.style.background = 'transparent');
    const activeBtn = list.querySelector(`.area-selector-btn[data-id="${areaId}"]`);
    if (activeBtn) activeBtn.style.background = 'rgba(99, 102, 241, 0.1)';
    showDownloadBtn(container);
    loadArticulos(container);
  });
}

function showDownloadBtn(container) {
  const btn = container.querySelector('#btn-download-csv');
  if (btn) btn.style.display = selectedAreaId ? '' : 'none';
}

// Carga las áreas en el menú lateral izquierdo y en el dropdown móvil
async function loadAreas(container) {
  try {
    areas = await inventarioApi.listarAreas();
    const list = container.querySelector('#areas-list-container');
    const select = container.querySelector('#areas-select-mobile');

    // Rellenar dropdown móvil
    select.innerHTML = '<option value="">— Selecciona un área —</option>' +
      areas.map(a => `<option value="${a.id}">${a.nombre} (${a.tipo})</option>`).join('');

    if (!areas.length) {
      list.innerHTML = `<div style="text-align:center;color:var(--text3);padding:12px;font-size:0.85rem">Sin áreas registradas</div>`;
      return;
    }

    list.innerHTML = areas.map(a => `
      <button class="btn btn-outline area-selector-btn" data-id="${a.id}" 
        style="justify-content:flex-start;text-align:left;width:100%;border:none;background:transparent;padding:10px 12px;border-radius:8px;display:flex;align-items:center;gap:10px">
        <i class="${a.tipo === 'AULA' ? 'fas fa-door-open' : 'fas fa-layer-group'}" style="color:var(--primary);opacity:0.8"></i>
        <div style="flex-grow:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          <div style="font-weight:600;font-size:0.88rem;color:var(--text)">${a.nombre}</div>
          <div style="font-size:0.75rem;color:var(--text3)">${a.tipo}</div>
        </div>
      </button>`).join('');

    // Agregar click a los botones de área
    list.querySelectorAll('.area-selector-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        list.querySelectorAll('.area-selector-btn').forEach(b => b.style.background = 'transparent');
        btn.style.background = 'rgba(99, 102, 241, 0.1)';
        selectedAreaId = Number(btn.dataset.id);
        currentPage = 1;
        const areaObj = areas.find(a => a.id === selectedAreaId);
        container.querySelector('#table-title').innerHTML = `📦 ${areaObj.nombre} <span style="font-weight:400;font-size:0.8rem;color:var(--text3)">(${areaObj.tipo})</span>`;
        // Sync dropdown
        container.querySelector('#areas-select-mobile').value = selectedAreaId;
        showDownloadBtn(container);
        loadArticulos(container);
      });
    });

    // Seleccionar la primera área por defecto si hay una
    if (areas.length > 0 && !selectedAreaId) {
      list.querySelector('.area-selector-btn').click();
    }
  } catch (err) {
    toast(err.message, 'error');
  }
}

// Carga los artículos de la base de datos para la área seleccionada
async function loadArticulos(container) {
  if (!selectedAreaId) return;
  try {
    articulos = await inventarioApi.listarArticulos(selectedAreaId);
    currentPage = 1;
    filterAndDraw(container);
  } catch (err) {
    toast(err.message, 'error');
  }
}

// Filtra y dibuja las filas de la tabla según la búsqueda actual + paginación
function filterAndDraw(container) {
  const tbody = container.querySelector('#tbody-articulos');
  const countBadge = container.querySelector('#total-articulos');
  const footerLbl = container.querySelector('#footer-inventario');
  const paginationBar = container.querySelector('#pagination-bar');

  const filtered = articulos.filter(a => 
    a.nombre?.toLowerCase().includes(currentSearch) ||
    a.codigoBarras?.toLowerCase().includes(currentSearch) ||
    a.descripcion?.toLowerCase().includes(currentSearch)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  countBadge.textContent = `${filtered.length}`;
  footerLbl.textContent = `Mostrando ${pageItems.length} de ${filtered.length} artículos en esta área`;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Sin artículos registrados en esta área que coincidan</td></tr>`;
    paginationBar.innerHTML = '';
    return;
  }

  tbody.innerHTML = pageItems.map(a => `
    <tr>
      <td>
        <span class="view-details-btn" data-id="${a.id}" style="cursor:pointer;font-family:monospace;font-weight:700;color:var(--text2);background:var(--border);padding:4px 8px;border-radius:4px;font-size:0.85rem;display:inline-flex;align-items:center;gap:4px">
          <i class="fas fa-barcode"></i>${a.codigoBarras}
        </span>
      </td>
      <td>
        <a href="#" class="view-details-btn" data-id="${a.id}" style="color:var(--text);font-weight:700;text-decoration:none;border-bottom:1px dashed var(--text3)">
          ${a.nombre}
        </a>
      </td>
      <td><span class="badge badge-blue" style="font-size:0.9rem">${a.cantidad}</span></td>
      <td><span class="badge ${ESTADO_BADGES[a.estado] ?? 'badge-gray'}">${a.estado.replace('_', ' ')}</span></td>
      <td class="td-muted" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a.descripcion ?? ''}">${a.descripcion ?? '—'}</td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-outline btn-sm view-details-btn" data-id="${a.id}" title="Ver detalles y fotos"><i class="fas fa-eye"></i></button>
        ${canEdit() ? `
          <button class="btn btn-outline btn-sm edit-art-btn" data-id="${a.id}" title="Editar artículo">✏️</button>
          <button class="btn btn-danger btn-sm del-art-btn" data-id="${a.id}" title="Eliminar artículo">🗑</button>
        ` : ''}
      </td>
    </tr>`).join('');

  // Click listeners para botones y enlaces de fila
  tbody.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDetallesArticuloModal(articulos.find(x => x.id == btn.dataset.id));
    });
  });

  if (canEdit()) {
    tbody.querySelectorAll('.edit-art-btn').forEach(btn => {
      btn.addEventListener('click', () => openArticuloModal(container, articulos.find(x => x.id == btn.dataset.id)));
    });
    tbody.querySelectorAll('.del-art-btn').forEach(btn => {
      btn.addEventListener('click', () => confirmDeleteArticulo(container, articulos.find(x => x.id == btn.dataset.id)));
    });
  }

  // Renderizar paginación
  renderPagination(paginationBar, currentPage, totalPages, container);
}

// ── Controles de paginación ──
function renderPagination(bar, page, totalPages, container) {
  if (totalPages <= 1) { bar.innerHTML = ''; return; }

  const maxVisible = 5;
  let startP = Math.max(1, page - Math.floor(maxVisible / 2));
  let endP = Math.min(totalPages, startP + maxVisible - 1);
  if (endP - startP + 1 < maxVisible) startP = Math.max(1, endP - maxVisible + 1);

  let html = '';
  html += `<button class="page-btn" data-p="1" ${page === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
  html += `<button class="page-btn" data-p="${page - 1}" ${page === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

  for (let i = startP; i <= endP; i++) {
    html += `<button class="page-btn ${i === page ? 'active' : ''}" data-p="${i}">${i}</button>`;
  }

  html += `<button class="page-btn" data-p="${page + 1}" ${page === totalPages ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
  html += `<button class="page-btn" data-p="${totalPages}" ${page === totalPages ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

  bar.innerHTML = html;

  bar.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = Number(btn.dataset.p);
      if (p >= 1 && p <= totalPages && p !== currentPage) {
        currentPage = p;
        filterAndDraw(container);
      }
    });
  });
}

// ── Descarga CSV ──
function downloadCSV() {
  if (!selectedAreaId || !articulos.length) {
    toast('No hay artículos para descargar', 'warning');
    return;
  }
  const areaObj = areas.find(a => a.id === selectedAreaId);
  const areaName = areaObj?.nombre ?? 'area';

  // Filtrar según búsqueda actual
  const filtered = articulos.filter(a =>
    a.nombre?.toLowerCase().includes(currentSearch) ||
    a.codigoBarras?.toLowerCase().includes(currentSearch) ||
    a.descripcion?.toLowerCase().includes(currentSearch)
  );

  const headers = ['Código de Barras', 'Nombre', 'Cantidad', 'Estado', 'Descripción'];
  const rows = filtered.map(a => [
    a.codigoBarras ?? '',
    a.nombre ?? '',
    a.cantidad ?? '',
    (a.estado ?? '').replace('_', ' '),
    (a.descripcion ?? '').replace(/"/g, '""')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(v => `"${v}"`).join(','))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventario_${areaName.replace(/\s+/g, '_')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  toast(`Inventario de "${areaName}" descargado`, 'success');
}

// Modal detallado de un artículo (Muestra fotos cargadas y código de barras)
function openDetallesArticuloModal(art) {
  // URLs para consumir código de barra
  const barcodeUrl = `${MVC_URL}/api/inventario/articulos/${art.id}/barcode`;

  // Renderizar la sección de fotos
  let fotosHtml = '';
  if (art.fotos && art.fotos.length > 0) {
    fotosHtml = `
      <div style="margin-top:16px">
        <label style="font-weight:600;font-size:0.9rem;color:var(--text3);margin-bottom:8px;display:block">📷 Fotos del Artículo</label>
        <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory">
          ${art.fotos.map((f, i) => `
            <img src="${f.fotoBase64}" alt="Foto ${i+1}" 
              style="width:160px;height:120px;object-fit:cover;border-radius:8px;border:1px solid var(--border);scroll-snap-align:start;cursor:zoom-in" 
              onclick="window.open(this.src, '_blank')"
              title="Click para ampliar" />
          `).join('')}
        </div>
      </div>`;
  } else {
    fotosHtml = `
      <div style="margin-top:16px;text-align:center;padding:24px;border:2px dashed var(--border);border-radius:12px;color:var(--text3)">
        <i class="fas fa-image" style="font-size:2rem;margin-bottom:8px;display:block;opacity:0.4"></i>
        Sin fotos registradas para este artículo.
      </div>`;
  }

  openModal({
    title: `📦 Detalles de Artículo — ${art.nombre}`,
    bodyHTML: `
      <div style="display:flex;flex-direction:column;gap:16px;padding:8px 0">
        
        <!-- Tarjeta de Código de Barras -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;background:var(--bg2);padding:20px;border-radius:12px;border:1px solid var(--border)">
          <div style="font-weight:700;font-size:0.95rem;font-family:monospace;color:var(--text)">
            ${art.codigoBarras}
          </div>
          <!-- Imagen del código de barras -->
          <img src="${barcodeUrl}" alt="Código de barras ${art.codigoBarras}" 
            style="max-width:100%;height:68px;object-fit:contain;background:white;padding:6px;border-radius:6px;border:1.5px solid var(--border)" />
          
          <button class="btn btn-outline btn-sm" id="btn-print-barcode"><i class="fas fa-print"></i> Imprimir Etiqueta</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div>
            <span style="font-size:0.8rem;color:var(--text3)">Cantidad</span>
            <div style="font-size:1.1rem;font-weight:700;color:var(--text)">${art.cantidad} unidades</div>
          </div>
          <div>
            <span style="font-size:0.8rem;color:var(--text3)">Estado</span>
            <div><span class="badge ${ESTADO_BADGES[art.estado] ?? 'badge-gray'}">${art.estado.replace('_', ' ')}</span></div>
          </div>
          <div style="grid-column:1/-1">
            <span style="font-size:0.8rem;color:var(--text3)">Descripción / Nota</span>
            <div style="font-size:0.95rem;color:var(--text2)">${art.descripcion || '—'}</div>
          </div>
          <div style="grid-column:1/-1">
            <span style="font-size:0.8rem;color:var(--text3)">Ubicación</span>
            <div style="font-size:0.95rem;color:var(--text2)">🏫 ${art.area.nombre} (${art.area.tipo})</div>
          </div>
        </div>

        ${fotosHtml}

      </div>`,
    confirmText: 'Cerrar',
    hideCancelBtn: true,
    onOpen: (overlay) => {
      overlay.querySelector('#btn-print-barcode').addEventListener('click', () => {
        // Ventana de impresión limpia para el código de barras
        const win = window.open('', '_blank');
        win.document.write(`
          <html>
          <head>
            <title>Imprimir Etiqueta - ${art.nombre}</title>
            <style>
              body { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; margin:0; }
              .label { border: 2px solid #000; padding: 20px; border-radius: 8px; text-align: center; width: 320px; }
              h1 { font-size: 16px; margin: 0 0 10px 0; }
              img { width: 100%; height: 80px; object-fit: contain; }
              .code { font-family: monospace; font-size: 14px; font-weight: bold; margin-top: 8px; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="label">
              <h1>SchoolGuard - ${art.nombre}</h1>
              <img src="${barcodeUrl}" />
              <div class="code">${art.codigoBarras}</div>
            </div>
          </body>
          </html>
        `);
        win.document.close();
      });
    }
  });
}

// Modal para crear una nueva área o aula
function openAreaModal(container) {
  openModal({
    title: '+ Nueva Área o Aula',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Nombre del Aula / Área *</label>
          <input class="form-control" id="ma-nombre" placeholder="Ej: Laboratorio de Cómputo B" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Tipo de Área *</label>
          <select class="form-control" id="ma-tipo">
            <option value="AULA">AULA</option>
            <option value="LABORATORIO">LABORATORIO</option>
            <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
            <option value="OTROS">OTROS</option>
          </select>
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Descripción / Ubicación</label>
          <textarea class="form-control" id="ma-desc" placeholder="Opcional. Ej: Pabellón B, Segundo Piso" style="height:60px;font-family:inherit;padding:8px"></textarea>
        </div>
      </div>`,
    confirmText: 'Registrar',
    onConfirm: async (overlay, close) => {
      const body = {
        nombre:      overlay.querySelector('#ma-nombre').value.trim(),
        tipo:        overlay.querySelector('#ma-tipo').value,
        descripcion: overlay.querySelector('#ma-desc').value.trim(),
      };
      if (!body.nombre) { toast('El nombre es obligatorio', 'warning'); return; }
      try {
        const nueva = await inventarioApi.registrarArea(body);
        toast('Área / Aula creada exitosamente', 'success');
        selectedAreaId = nueva.id;
        close();
        await loadAreas(container);
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  });
}

// Modal para crear o editar un artículo (Con soporte de carga de fotos Base64)
function openArticuloModal(container, art = null) {
  const editar = !!art;
  const areaOptions = areas.map(a => 
    `<option value="${a.id}" ${ (art ? art.area.id : selectedAreaId) === a.id ? 'selected' : ''}>${a.nombre}</option>`
  ).join('');

  // Array local para almacenar fotos en Base64
  let tempFotos = [];
  if (editar && art.fotos) {
    tempFotos = art.fotos.map(f => f.fotoBase64);
  }

  // Dibuja las previsualizaciones de fotos
  const updateFotosPreview = (previewEl) => {
    if (!tempFotos.length) {
      previewEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem">No se han seleccionado fotos.</span>';
      return;
    }
    previewEl.innerHTML = tempFotos.map((base64, index) => `
      <div style="position:relative;width:70px;height:70px;border-radius:6px;overflow:hidden;border:1.5px solid var(--border)">
        <img src="${base64}" style="width:100%;height:100%;object-fit:cover" />
        <button type="button" class="remove-photo-btn" data-index="${index}" 
          style="position:absolute;top:2px;right:2px;background:rgba(239,68,68,0.85);color:white;border:none;width:18px;height:18px;border-radius:50%;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center">
          ✕
        </button>
      </div>`).join('');

    previewEl.querySelectorAll('.remove-photo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tempFotos.splice(Number(btn.dataset.index), 1);
        updateFotosPreview(previewEl);
      });
    });
  };

  openModal({
    title: editar ? '✏️ Editar Artículo' : '+ Nuevo Artículo de Inventario',
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Nombre del Artículo *</label>
          <input class="form-control" id="mar-nombre" value="${art?.nombre ?? ''}" placeholder="Ej: Proyector Multimedia Epson" />
        </div>
        
        <div class="form-group">
          <label>Cantidad *</label>
          <input class="form-control" type="number" id="mar-cant" value="${art?.cantidad ?? 1}" min="1" />
        </div>

        <div class="form-group">
          <label>Estado actual *</label>
          <select class="form-control" id="mar-estado">
            <option value="EXCELENTE" ${art?.estado === 'EXCELENTE' ? 'selected' : ''}>EXCELENTE</option>
            <option value="BUENO" ${art?.estado === 'BUENO' ? 'selected' : ''}>BUENO</option>
            <option value="REGULAR" ${art?.estado === 'REGULAR' ? 'selected' : ''}>REGULAR</option>
            <option value="DETERIORADO" ${art?.estado === 'DETERIORADO' ? 'selected' : ''}>DETERIORADO</option>
            <option value="EN_MANTENIMIENTO" ${art?.estado === 'EN_MANTENIMIENTO' ? 'selected' : ''}>EN MANTENIMIENTO</option>
          </select>
        </div>

        <div class="form-group" style="grid-column:1/-1">
          <label>Área / Aula Asignada *</label>
          <select class="form-control" id="mar-area">
            ${areaOptions}
          </select>
        </div>

        <!-- Sección de Código de Barras -->
        <div class="form-group" style="grid-column:1/-1">
          <label>Código de Barras</label>
          <div style="display:flex;gap:12px;margin-bottom:8px">
            <label style="font-weight:400;font-size:0.85rem;display:flex;align-items:center;gap:6px">
              <input type="radio" name="barcode-mode" id="barcode-auto" ${editar ? '' : 'checked'} /> Autogenerar código
            </label>
            <label style="font-weight:400;font-size:0.85rem;display:flex;align-items:center;gap:6px">
              <input type="radio" name="barcode-mode" id="barcode-manual" ${editar ? 'checked' : ''} /> Asignar código manual
            </label>
          </div>
          <input class="form-control" id="mar-barcode" value="${art?.codigoBarras ?? ''}" 
            placeholder="Introduce o escanea el código de barras..." 
            ${editar ? '' : 'disabled style="background:var(--border);color:var(--text3)"'} />
        </div>

        <div class="form-group" style="grid-column:1/-1">
          <label>Descripción o número de serie</label>
          <input class="form-control" id="mar-desc" value="${art?.descripcion ?? ''}" placeholder="Opcional. Ej: Serie S/N 12345" />
        </div>

        <!-- Nueva sección de fotos -->
        <div class="form-group" style="grid-column:1/-1">
          <label>Cargar Fotos del Artículo</label>
          <input class="form-control" type="file" id="mar-photos-input" multiple accept="image/*" style="padding:4px" />
          <div id="mar-photos-preview" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"></div>
        </div>
      </div>`,
    confirmText: editar ? 'Actualizar' : 'Registrar Ítem',
    onOpen: (overlay) => {
      const rAuto = overlay.querySelector('#barcode-auto');
      const rManual = overlay.querySelector('#barcode-manual');
      const input = overlay.querySelector('#mar-barcode');
      const fileInput = overlay.querySelector('#mar-photos-input');
      const previewEl = overlay.querySelector('#mar-photos-preview');

      if (!editar) {
        input.value = 'SG-XXXXXXXX (Se autogenerará)';
      }

      // Dibujar fotos iniciales
      updateFotosPreview(previewEl);

      rAuto?.addEventListener('change', () => {
        if (rAuto.checked) {
          input.disabled = true;
          input.style.background = 'var(--border)';
          input.style.color = 'var(--text3)';
          input.value = 'SG-XXXXXXXX (Se autogenerará)';
        }
      });

      rManual?.addEventListener('change', () => {
        if (rManual.checked) {
          input.disabled = false;
          input.style.background = '';
          input.style.color = '';
          input.value = editar ? art.codigoBarras : '';
          input.focus();
        }
      });

      // Lector de fotos File -> Base64
      fileInput?.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        for (const file of files) {
          try {
            const base64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = (err) => reject(err);
              reader.readAsDataURL(file);
            });
            // Guardar base64
            tempFotos.push(base64);
          } catch {
            toast('Error al leer una de las imágenes', 'error');
          }
        }
        updateFotosPreview(previewEl);
        // Resetear input
        fileInput.value = '';
      });
    },
    onConfirm: async (overlay, close) => {
      const isAuto = overlay.querySelector('#barcode-auto')?.checked ?? false;
      const barVal = overlay.querySelector('#mar-barcode').value.trim();

      const body = {
        nombre:       overlay.querySelector('#mar-nombre').value.trim(),
        cantidad:     Number(overlay.querySelector('#mar-cant').value),
        estado:       overlay.querySelector('#mar-estado').value,
        areaId:       Number(overlay.querySelector('#mar-area').value),
        codigoBarras: isAuto ? '' : barVal,
        descripcion:  overlay.querySelector('#mar-desc').value.trim(),
        fotos:        tempFotos // Pasar fotos Base64
      };

      if (!body.nombre || !body.cantidad) { toast('Completa los campos obligatorios', 'warning'); return; }
      if (!isAuto && !body.codigoBarras) { toast('Debes introducir un código de barras si seleccionas manual', 'warning'); return; }

      try {
        if (editar) {
          if (isAuto) body.codigoBarras = art.codigoBarras; // No modificar código si era automático en edición
          await inventarioApi.actualizarArticulo(art.id, body);
          toast('Artículo actualizado exitosamente', 'success');
        } else {
          await inventarioApi.registrarArticulo(body);
          toast('Artículo registrado exitosamente', 'success');
        }
        close();
        await loadArticulos(container);
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  });
}

// Modal de confirmación para eliminar un artículo
function confirmDeleteArticulo(container, art) {
  openModal({
    title: '🗑 Eliminar Artículo del Inventario',
    bodyHTML: `<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${art.nombre}</strong> (${art.codigoBarras}) del inventario?<br/>Esta acción no se puede deshacer y quedará registrada en auditoría.</p>`,
    confirmText: 'Eliminar',
    danger: true,
    onConfirm: async (_, close) => {
      try {
        await inventarioApi.eliminarArticulo(art.id);
        toast('Artículo eliminado del inventario', 'success');
        close();
        await loadArticulos(container);
      } catch (err) {
        toast(err.message, 'error');
      }
    }
  });
}
