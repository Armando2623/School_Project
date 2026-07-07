import { inventarioApi } from '../api/inventario.js';
import { openModal }     from '../components/modal.js';
import { toast }         from '../components/toast.js';
import { store }         from '../auth/store.js';

let areas = [];
let articulos = [];
let selectedAreaId = null;
let currentSearch = '';

const canEdit = () => store.hasRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA');

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

  container.innerHTML = `
    <div class="page-topbar">
      <div>
        <h1><i class="fas fa-boxes" style="color:var(--primary)"></i> Inventario & Logística</h1>
        <div class="sub">Control de activos por aula e infraestructura</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${canEdit() ? `
          <button class="btn btn-outline" id="btn-new-area"><i class="fas fa-folder-plus"></i> Nueva Área / Aula</button>
          <button class="btn btn-primary" id="btn-new-articulo"><i class="fas fa-plus"></i> Nuevo Artículo</button>
        ` : ''}
      </div>
    </div>

    <div class="page-body" style="display:flex;gap:20px;flex-direction:row;align-items:flex-start">
      
      <!-- Panel de Áreas/Aulas -->
      <div class="table-card" style="width:240px;flex-shrink:0;padding:12px">
        <div style="font-weight:700;font-size:0.9rem;color:var(--text3);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">
          🏫 Áreas y Aulas
        </div>
        <div id="areas-list-container" style="display:flex;flex-direction:column;gap:6px;max-height:60vh;overflow-y:auto">
          <div style="text-align:center;color:var(--text3);padding:10px">Cargando...</div>
        </div>
      </div>

      <!-- Tabla de Artículos -->
      <div class="table-card" style="flex-grow:1">
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
                ${canEdit() ? '<th style="width:100px">Acciones</th>' : ''}
              </tr>
            </thead>
            <tbody id="tbody-articulos">
              <tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Selecciona un área para ver sus ítems</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-inventario">—</span></div>
      </div>

    </div>`;

  await loadAreas(container);

  // Listeners de los botones principales
  container.querySelector('#btn-new-area')?.addEventListener('click', () => openAreaModal(container));
  container.querySelector('#btn-new-articulo')?.addEventListener('click', () => openArticuloModal(container));

  // Buscador de artículos
  container.querySelector('#search-articulos').addEventListener('input', e => {
    currentSearch = e.target.value.toLowerCase().trim();
    filterAndDraw(container);
  });
}

// Carga las áreas en el menú lateral izquierdo
async function loadAreas(container) {
  try {
    areas = await inventarioApi.listarAreas();
    const list = container.querySelector('#areas-list-container');
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
        const areaObj = areas.find(a => a.id === selectedAreaId);
        container.querySelector('#table-title').innerHTML = `📦 ${areaObj.nombre} <span style="font-weight:400;font-size:0.8rem;color:var(--text3)">(${areaObj.tipo})</span>`;
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
    filterAndDraw(container);
  } catch (err) {
    toast(err.message, 'error');
  }
}

// Filtra y dibuja las filas de la tabla según la búsqueda actual
function filterAndDraw(container) {
  const tbody = container.querySelector('#tbody-articulos');
  const countBadge = container.querySelector('#total-articulos');
  const footerLbl = container.querySelector('#footer-inventario');

  const filtered = articulos.filter(a => 
    a.nombre?.toLowerCase().includes(currentSearch) ||
    a.codigoBarras?.toLowerCase().includes(currentSearch) ||
    a.descripcion?.toLowerCase().includes(currentSearch)
  );

  countBadge.textContent = `${filtered.length}`;
  footerLbl.textContent = `${filtered.length} artículos en esta área`;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="${canEdit() ? 6 : 5}" style="text-align:center;padding:28px;color:var(--text3)">Sin artículos registrados en esta área que coincidan</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td>
        <span style="font-family:monospace;font-weight:700;color:var(--text2);background:var(--border);padding:4px 8px;border-radius:4px;font-size:0.85rem">
          <i class="fas fa-barcode" style="margin-right:4px"></i>${a.codigoBarras}
        </span>
      </td>
      <td><strong>${a.nombre}</strong></td>
      <td><span class="badge badge-blue" style="font-size:0.9rem">${a.cantidad}</span></td>
      <td><span class="badge ${ESTADO_BADGES[a.estado] ?? 'badge-gray'}">${a.estado.replace('_', ' ')}</span></td>
      <td class="td-muted" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a.descripcion ?? ''}">${a.descripcion ?? '—'}</td>
      ${canEdit() ? `
        <td style="display:flex;gap:6px">
          <button class="btn btn-outline btn-sm edit-art-btn" data-id="${a.id}" title="Editar artículo">✏️</button>
          <button class="btn btn-danger btn-sm del-art-btn" data-id="${a.id}" title="Eliminar artículo">🗑</button>
        </td>
      ` : ''}
    </tr>`).join('');

  // Click listeners para botones de fila
  if (canEdit()) {
    tbody.querySelectorAll('.edit-art-btn').forEach(btn => {
      btn.addEventListener('click', () => openArticuloModal(container, articulos.find(x => x.id == btn.dataset.id)));
    });
    tbody.querySelectorAll('.del-art-btn').forEach(btn => {
      btn.addEventListener('click', () => confirmDeleteArticulo(container, articulos.find(x => x.id == btn.dataset.id)));
    });
  }
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

// Modal para crear o editar un artículo
function openArticuloModal(container, art = null) {
  const editar = !!art;
  const areaOptions = areas.map(a => 
    `<option value="${a.id}" ${ (art ? art.area.id : selectedAreaId) === a.id ? 'selected' : ''}>${a.nombre}</option>`
  ).join('');

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
      </div>`,
    confirmText: editar ? 'Actualizar' : 'Registrar Ítem',
    onOpen: (overlay) => {
      const rAuto = overlay.querySelector('#barcode-auto');
      const rManual = overlay.querySelector('#barcode-manual');
      const input = overlay.querySelector('#mar-barcode');

      if (!editar) {
        input.value = 'SG-XXXXXXXX (Se autogenerará)';
      }

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
      };

      if (!body.nombre || !body.cantidad) { toast('Completa los campos obligatorios', 'warning'); return; }
      if (!isAuto && !body.codigoBarras) { toast('Debes introducir un código de barras si seleccionas manual', 'warning'); return; }

      try {
        if (editar) {
          if (isAuto) body.codigoBarras = art.codigoBarras; // No modificar si estaba automático en edición
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
