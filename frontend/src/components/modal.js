/**
 * Crea y muestra un modal genérico.
 * @param {string} title
 * @param {string} bodyHTML — HTML del formulario
 * @param {function} onConfirm — callback al confirmar
 * @param {string} confirmText
 * @param {boolean} danger — estilo peligroso en el botón de confirmación
 * @param {boolean} hideCancelBtn — oculta el botón Cancelar (útil para modales de solo lectura)
 * @param {function} onOpen — callback después de insertar el modal en el DOM
 * @param {function} onClose — callback al cerrar el modal
 */
export function openModal({
  title,
  bodyHTML,
  onConfirm,
  confirmText = 'Guardar',
  danger = false,
  hideCancelBtn = false,
  onOpen = null,
  onClose = null,
}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-footer">
        ${!hideCancelBtn ? '<button class="btn btn-outline" id="modal-cancel-btn">Cancelar</button>' : ''}
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="modal-confirm-btn">${confirmText}</button>
      </div>
    </div>`;

  overlay.classList.add('active');
  document.body.appendChild(overlay);

  const close = () => {
    if (onClose) onClose();
    overlay.remove();
  };

  overlay.querySelector('#modal-close-btn').addEventListener('click', close);
  overlay.querySelector('#modal-cancel-btn')?.addEventListener('click', close);
  overlay.querySelector('#modal-confirm-btn').addEventListener('click', () => {
    if (onConfirm) onConfirm(overlay, close);
    else close();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Llamar onOpen después de que el modal esté en el DOM
  if (onOpen) setTimeout(() => onOpen(overlay), 0);

  return overlay;
}
