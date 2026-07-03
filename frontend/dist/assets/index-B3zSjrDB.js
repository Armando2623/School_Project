(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=o(i);fetch(i.href,r)}})();const we="sg_session",b={save(e){sessionStorage.setItem(we,JSON.stringify(e))},get(){try{return JSON.parse(sessionStorage.getItem(we))}catch{return null}},clear(){sessionStorage.removeItem(we)},token(){var e;return((e=this.get())==null?void 0:e.token)??null},usuario(){var e;return((e=this.get())==null?void 0:e.usuario)??null},nombre(){var e;return((e=this.get())==null?void 0:e.nombre)??null},rol(){var e;return((e=this.get())==null?void 0:e.rol)??null},id(){var e;return((e=this.get())==null?void 0:e.id)??null},isLogged(){return!!this.token()},hasRole(...e){return e.includes(this.rol())}},rt=[{section:"PRINCIPAL",items:[{icon:"fas fa-chart-line",label:"Dashboard",hash:"#/dashboard",roles:null},{icon:"fas fa-clipboard-list",label:"Visitas",hash:"#/visitas",roles:["ADMINISTRADOR","PORTERO","SECRETARIA","DIRECTOR","PROFESOR"]}]},{section:"GESTIÓN",items:[{icon:"fas fa-users",label:"Visitantes",hash:"#/visitantes",roles:["ADMINISTRADOR","SECRETARIA"]},{icon:"fas fa-user-graduate",label:"Alumnos",hash:"#/alumnos",roles:["ADMINISTRADOR","SECRETARIA","PROFESOR"]},{icon:"fas fa-check-square",label:"Asistencia",hash:"#/asistencia",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-calendar-alt",label:"Agenda",hash:"#/agenda",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-user-cog",label:"Usuarios",hash:"#/usuarios",roles:["ADMINISTRADOR"]},{icon:"fas fa-history",label:"Auditoría",hash:"#/auditoria",roles:["ADMINISTRADOR"]}]}],nt={ADMINISTRADOR:"Administrador",PORTERO:"Portero",SECRETARIA:"Secretaria",DIRECTOR:"Director",PROFESOR:"Profesor"};function lt(e){const t=b.rol(),o=window.location.hash||"#/dashboard",a=rt.map(i=>{const r=i.items.filter(s=>!s.roles||s.roles.includes(t));return r.length?`
      <div class="nav-section-title">${i.section}</div>
      <ul class="nav-list">
        ${r.map(s=>`
          <li>
            <a class="nav-link ${o===s.hash?"active":""}"
               href="${s.hash}" data-hash="${s.hash}">
              <!-- CAMBIO AQUÍ: Ahora usamos <i> con la clase dinámica de Font Awesome -->
              <span class="nav-icon"><i class="${s.icon}"></i></span>
              <span>${s.label}</span>
            </a>
          </li>`).join("")}
      </ul>`:""}).join("");e.innerHTML=`
    <aside class="sidebar">
      <div class="sidebar-brand">
        <!-- Puedes dejar este emoji o cambiarlo por <i class="fas fa-school"></i> si prefieres -->
        <div class="brand-icon"><i class="fas fa-school"></i></div>
        <div>
          <div class="brand-name">SchoolGuard</div>
          <div class="brand-sub">Sistema de Visitas</div>
        </div>
      </div>
      <nav class="sidebar-nav">${a}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="u-avatar"><i class="fas fa-user-circle"></i></div>
          <div>
            <div class="u-name">${b.nombre()??b.usuario()}</div>
            <div class="u-role">${nt[t]??t}</div>
          </div>
        </div>
        <button class="btn-logout" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </aside>`,e.querySelector("#logout-btn").addEventListener("click",()=>{b.clear(),window.location.hash="#/login"})}const le="/api",Oe="/asistencia-api";async function k(e,t,o={}){const a=b.token(),i={"Content-Type":"application/json",...o.headers};a&&(i.Authorization=`Bearer ${a}`);const r=await fetch(`${e}${t}`,{...o,headers:i});if(r.status===401)throw b.clear(),window.location.hash="#/login",new Error("Sesión expirada");if(r.status===204)return null;if(!r.ok){const s=await r.json().catch(()=>({error:`Error ${r.status}`}));throw new Error(s.error||s.message||`Error ${r.status}`)}return r.json()}const h={get:e=>k(le,e),post:(e,t)=>k(le,e,{method:"POST",body:JSON.stringify(t)}),put:(e,t)=>k(le,e,{method:"PUT",body:JSON.stringify(t)}),delete:e=>k(le,e,{method:"DELETE"}),fetchBlob:async e=>{const t=b.token(),o={};t&&(o.Authorization=`Bearer ${t}`);const a=await fetch(`${le}${e}`,{headers:o});if(!a.ok)throw new Error(`Error ${a.status}`);return a.blob()}},x={get:e=>k(Oe,e),post:(e,t)=>k(Oe,e,{method:"POST",body:JSON.stringify(t)})},be="/agenda-api",S={get:e=>k(be,e),post:(e,t)=>k(be,e,{method:"POST",body:JSON.stringify(t)}),put:(e,t)=>k(be,e,{method:"PUT",body:JSON.stringify(t)}),delete:e=>k(be,e,{method:"DELETE"})},dt=Object.freeze(Object.defineProperty({__proto__:null,agendaApi:S,api:h,astApi:x},Symbol.toStringTag,{value:"Module"})),ct={login:(e,t)=>h.post("/auth/login",{usuario:e,contraseña:t})};function p(e,t="info",o=3500){const a=document.getElementById("toast-container"),i=document.createElement("div"),r={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"};i.className=`toast toast-${t}`,i.innerHTML=`<span>${r[t]??"ℹ️"}</span><span>${e}</span>`,a.appendChild(i),setTimeout(()=>{i.classList.add("leaving"),setTimeout(()=>i.remove(),310)},o)}function ut(e){e.innerHTML=`
    <div class="login-wrapper">

      <!-- Logo y título sobre la card -->
      <div class="login-brand">
        <div class="l-app-icon"><i class="fas fa-school"></i></div>
        <h1 style="font-family: 'Georgia', serif;">ViraSchool</h1>
        <p>Sistema de Registro de Visitas</p>
      </div>

      <!-- Card blanca con el formulario -->
      <div class="login-card">
        <div class="login-card-title">
          <i class="fas fa-sign-in-alt lct-icon"></i> Iniciar Sesión
        </div>
        <hr class="login-divider" />

        <div class="login-error" id="login-error">
          <span>⚠️</span><span id="error-msg">Credenciales inválidas</span>
        </div>

        <form id="login-form" novalidate>

          <div class="login-field">
            <div class="login-field-label">
              <i class="fas fa-user lfl-icon"></i> Usuario
            </div>
            <div class="login-input-wrap">
              <input id="l-user" type="text"
                     placeholder="Ej: jperez"
                     autocomplete="username" required />
            </div>
          </div>

          <div class="login-field">
            <div class="login-field-label">
              <i class="fas fa-lock lfl-icon"></i> Contraseña
            </div>
            <div class="login-input-wrap">
              <input id="l-pass" type="password"
                     placeholder="........"
                     autocomplete="current-password" required />
              <button type="button" class="l-eye" id="eye-btn"><i class="fas fa-eye"></i></button>
            </div>
          </div>

          <button type="submit" class="btn-login" id="login-btn">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
          </button>

        </form>
      </div>

      <div class="login-footer">© 2026 SchoolGuard - Acceso restringido al personal autorizado</div>
    </div>`;const t=e.querySelector("#login-form"),o=e.querySelector("#login-btn"),a=e.querySelector("#eye-btn"),i=e.querySelector("#l-pass"),r=e.querySelector("#login-error"),s=e.querySelector("#error-msg");a.addEventListener("click",()=>{const n=i.type==="password";i.type=n?"text":"password",a.innerHTML=n?'<i class="fas fa-eye-slash"></i>':'<i class="fas fa-eye"></i>'}),t.addEventListener("submit",async n=>{n.preventDefault(),r.classList.remove("show");const l=e.querySelector("#l-user").value.trim(),d=i.value;if(!l||!d){s.textContent="Completa todos los campos",r.classList.add("show");return}o.disabled=!0,o.textContent="Ingresando…";try{const c=await ct.login(l,d);b.save(c),window.location.hash="#/dashboard"}catch(c){s.textContent=c.message||"Credenciales inválidas",r.classList.add("show"),p(s.textContent,"error")}finally{o.disabled=!1,o.innerHTML='<i class="fas fa-sign-in-alt"></i> Iniciar Sesión'}})}const Z={listar:()=>h.get("/visitas"),registrar:e=>h.post("/visitas",e),actualizar:(e,t)=>h.put(`/visitas/${e}`,t),buscarPorDni:e=>h.get(`/visitas/visitante?dni=${encodeURIComponent(e)}`),buscarUsuarios:e=>h.get(`/visitas/usuarios?search=${encodeURIComponent(e)}`)},pe={listar:()=>h.get("/alumnos"),registrar:e=>h.post("/alumnos",e),actualizar:(e,t)=>h.put(`/alumnos/${e}`,t),obtener:e=>h.get(`/alumnos/${e}`),obtenerQrBlob:e=>h.fetchBlob(`/alumnos/${e}/qr`)},Se={listar:()=>x.get("/asistencia"),registrar:e=>x.post("/asistencia",e),porPersonal:e=>x.get(`/asistencia/personal/${e}`),porFecha:e=>x.get(`/asistencia/fecha?fecha=${e}`),porPersonalYFecha:(e,t)=>x.get(`/asistencia/personal/${e}/fecha?fecha=${t}`)},pt=()=>new Date().toLocaleDateString("es-PE",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),De=()=>new Date().toISOString().split("T")[0],mt={REGISTRADO:"badge-blue",EN_CURSO:"badge-yellow",COMPLETADO:"badge-green"};async function bt(e){e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>I.E.P. — SchoolGuard</h1>
        <div class="sub">Sistema de Registro de Visitas</div>
      </div>
      <div class="date-pill"><i class="fa-thin fa-calendar-clock"></i> ${pt()}</div>
    </div>

    <div class="page-body">

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon-box si-blue"><i class="fa-solid fa-id-card"></i></div>
          <div><div class="stat-num" id="s-activos">—</div><div class="stat-lbl">Visitas Activas</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box si-blue"><i class="fa-solid fa-calendar"></i></div>

          <div><div class="stat-num" id="s-hoy">—</div><div class="stat-lbl">Hoy</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box si-orange"><i class="fa-solid fa-user-graduate"></i></div>
          <div><div class="stat-num" id="s-alumnos">—</div><div class="stat-lbl">Alumnos</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-box si-gray"><i class="fa-solid fa-calendar-check"></i></div>
          <div><div class="stat-num" id="s-asist">—</div><div class="stat-lbl">Asistencias hoy</div></div>
        </div>
      </div>

<div class="svc-row">
    <div class="svc-chip"><span class="svc-dot" id="dot-mvc"></span> Backend MVC :8080</div>
    <div class="svc-chip"><span class="svc-dot" id="dot-ast"></span> Asistencia :8081</div>
    </div>

      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title">
            <span class="title-icon"><i class="fa-solid fa-clock"></i></span> Actividad Reciente
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Visitante</th><th>DNI</th>
                <th>Motivo</th><th>Hora Ingreso</th><th>Estado</th>
              </tr>
            </thead>
            <tbody id="recent-tbody">
              <tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text3)">Cargando…</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-card-footer">
          <span id="footer-count">—</span>
        </div>
      </div>

    </div>`;const t=b.token(),o=t?{Authorization:`Bearer ${t}`}:{},a=async(i,r,s={})=>{const n=e.querySelector(`#${r}`);try{const l=await fetch(i,{signal:AbortSignal.timeout(3e3),headers:s});n.classList.add(l.status<500?"online":"offline")}catch{n.classList.add("offline")}};a("/api/alumnos","dot-mvc",o),a("/asistencia-api/asistencia","dot-ast",o);try{const[i,r]=await Promise.all([Z.listar(),pe.listar()]),s=i.filter(c=>{var u;return(u=c.horaIngreso)==null?void 0:u.startsWith(De())}),n=i.filter(c=>c.estadoRegistro==="EN_CURSO");e.querySelector("#s-activos").textContent=n.length,e.querySelector("#s-hoy").textContent=s.length,e.querySelector("#s-alumnos").textContent=r.length,e.querySelector("#footer-count").textContent=`${s.length} hoy`;const l=e.querySelector("#recent-tbody"),d=[...i].reverse().slice(0,5);d.length?l.innerHTML=d.map(c=>`
        <tr>
          <td><strong>${c.nombreVisitante}</strong></td>
          <td class="td-muted">${c.dniVisitante}</td>
          <td>${c.motivo}</td>
          <td class="td-small">${c.horaIngreso?new Date(c.horaIngreso).toLocaleString("es-PE"):"—"}</td>
          <td><span class="badge ${mt[c.estadoRegistro]??"badge-gray"}">${c.estadoRegistro??"—"}</span></td>
        </tr>`).join(""):l.innerHTML='<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text3)">No hay registros</td></tr>'}catch{}try{const i=await Se.porFecha(De());e.querySelector("#s-asist").textContent=i.length}catch{e.querySelector("#s-asist").textContent="—"}}function P({title:e,bodyHTML:t,onConfirm:o,confirmText:a="Guardar",danger:i=!1,hideCancelBtn:r=!1,onOpen:s=null,onClose:n=null}){var c;const l=document.createElement("div");l.className="modal-overlay",l.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <h2>${e}</h2>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">${t}</div>
      <div class="modal-footer">
        ${r?"":'<button class="btn btn-outline" id="modal-cancel-btn">Cancelar</button>'}
        <button class="btn ${i?"btn-danger":"btn-primary"}" id="modal-confirm-btn">${a}</button>
      </div>
    </div>`,l.classList.add("active"),document.body.appendChild(l);const d=()=>{n&&n(),l.remove()};return l.querySelector("#modal-close-btn").addEventListener("click",d),(c=l.querySelector("#modal-cancel-btn"))==null||c.addEventListener("click",d),l.querySelector("#modal-confirm-btn").addEventListener("click",()=>{o?o(l,d):d()}),l.addEventListener("click",u=>{u.target===l&&d()}),s&&setTimeout(()=>s(l),0),l}const ft=["REGISTRADO","EN_CURSO","COMPLETADO"],vt={REGISTRADO:"badge-blue",EN_CURSO:"badge-yellow",COMPLETADO:"badge-green"},gt=e=>`<span class="badge ${vt[e]??"badge-gray"}">${e??"—"}</span>`,ht=e=>e?new Date(e).toLocaleString("es-PE"):"—",fe=()=>b.hasRole("ADMINISTRADOR","PORTERO","SECRETARIA");let ue=[];async function yt(e){var t,o;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Registro de Visitas</h1>
        <div class="sub">Control de ingreso de visitantes</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${fe()?'<button class="btn btn-primary" id="btn-new">+ Nueva Visita</button>':""}
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
              ${fe()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-count">—</span></div>
      </div>
    </div>`,await Pe(e),(t=e.querySelector("#search"))==null||t.addEventListener("input",a=>{const i=a.target.value.toLowerCase();Ne(e,ue.filter(r=>{var s,n,l;return((s=r.nombreVisitante)==null?void 0:s.toLowerCase().includes(i))||((n=r.dniVisitante)==null?void 0:n.toLowerCase().includes(i))||((l=r.motivo)==null?void 0:l.toLowerCase().includes(i))}))}),(o=e.querySelector("#btn-new"))==null||o.addEventListener("click",()=>He(e))}async function Pe(e){try{ue=await Z.listar(),e.querySelector("#footer-count").textContent=`${ue.length} registros`,Ne(e,ue)}catch(t){p(t.message,"error")}}function Ne(e,t){const o=e.querySelector("#tbody");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="7">No hay registros</td></tr>';return}o.innerHTML=t.map(a=>{var i;return`
    <tr>
      <td><strong>${a.nombreVisitante}</strong></td>
      <td class="td-muted">${a.dniVisitante}</td>
      <td>${a.motivo}</td>
      <td>${((i=a.usuario)==null?void 0:i.nombre)??"—"}</td>
      <td class="td-small">${ht(a.horaIngreso)}</td>
      <td>${gt(a.estadoRegistro)}</td>
      ${fe()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),fe()&&o.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>{He(e,ue.find(i=>i.id==a.dataset.id))}))}async function He(e,t=null){const o=!!t;let a=[];try{a=await Z.buscarUsuarios("")}catch{}const i=new Date().toISOString().slice(0,16);P({title:o?"✏️ Editar Visita":"+ Nueva Visita",bodyHTML:`
      <div class="form-grid">
        <div class="form-group">
          <label>DNI Visitante *</label>
          <div style="display:flex;gap:6px">
            <input class="form-control" id="m-dni" value="${(t==null?void 0:t.dniVisitante)??""}" placeholder="Ej: 12345678" maxlength="15" />
            <button type="button" class="btn btn-outline btn-sm" id="btn-dni">🔍</button>
          </div>
        </div>
        <div class="form-group">
          <label>Nombre Visitante *</label>
          <input class="form-control" id="m-nombre" value="${(t==null?void 0:t.nombreVisitante)??""}" placeholder="Nombre completo" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Motivo *</label>
          <input class="form-control" id="m-motivo" value="${(t==null?void 0:t.motivo)??""}" placeholder="Motivo de la visita" />
        </div>
        <div class="form-group">
          <label>Persona a Visitar *</label>
          <select class="form-control" id="m-usuario">
            <option value="">— Selecciona —</option>
            ${a.map(r=>{var s;return`<option value="${r.id}" ${((s=t==null?void 0:t.usuario)==null?void 0:s.id)===r.id?"selected":""}>${r.nombre} (${r.usuario})</option>`}).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" id="m-estado">
            ${ft.map(r=>`<option value="${r}" ${((t==null?void 0:t.estadoRegistro)??"REGISTRADO")===r?"selected":""}>${r}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Hora Ingreso</label>
          <input class="form-control" type="datetime-local" id="m-hora"
            value="${t!=null&&t.horaIngreso?new Date(t.horaIngreso).toISOString().slice(0,16):i}" />
        </div>
      </div>`,confirmText:o?"Actualizar":"Registrar",onConfirm:async(r,s)=>{const n=r.querySelector("#m-dni").value.trim(),l=r.querySelector("#m-nombre").value.trim(),d=r.querySelector("#m-motivo").value.trim(),c=r.querySelector("#m-usuario").value,u=r.querySelector("#m-estado").value,m=r.querySelector("#m-hora").value;if(!n||!l||!d||!c){p("Completa los campos obligatorios","warning");return}const g={dniVisitante:n,nombreVisitante:l,motivo:d,usuario_id:Number(c),estadoRegistro:u,horaIngreso:m?new Date(m).toISOString():null};try{o?await Z.actualizar(t.id,g):await Z.registrar(g),p(o?"Visita actualizada":"Visita registrada","success"),s(),await Pe(e)}catch(f){p(f.message,"error")}}}),setTimeout(()=>{var r;(r=document.querySelector("#btn-dni"))==null||r.addEventListener("click",async()=>{var n;const s=(n=document.querySelector("#m-dni"))==null?void 0:n.value.trim();if(s)try{const l=await Z.buscarPorDni(s);l?(document.querySelector("#m-nombre").value=l.nombreVisitante??"",p("Datos autocompletados","info")):p("DNI no encontrado","warning")}catch{p("DNI no encontrado","warning")}})},100)}const ve={listar:()=>h.get("/visitantes"),registrar:e=>h.post("/visitantes",e),actualizar:(e,t)=>h.put(`/visitantes/${e}`,t),buscarPorDni:e=>h.get(`/visitantes/buscar?dni=${encodeURIComponent(e)}`)},ge=()=>b.hasRole("ADMINISTRADOR","SECRETARIA");let ee=[];async function Et(e){var t;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Visitantes</h1>
        <div class="sub">Personas externas registradas en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${ge()?'<button class="btn btn-primary" id="btn-new">+ Nuevo Visitante</button>':""}
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
              ${ge()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`,await ke(e),e.querySelector("#search").addEventListener("input",o=>{const a=o.target.value.toLowerCase();Ve(e,ee.filter(i=>{var r,s;return((r=i.dniVisitante)==null?void 0:r.toLowerCase().includes(a))||((s=i.nombreVisitante)==null?void 0:s.toLowerCase().includes(a))}))}),(t=e.querySelector("#btn-new"))==null||t.addEventListener("click",()=>Be(e))}async function ke(e){try{ee=await ve.listar(),e.querySelector("#total").textContent=`${ee.length}`,e.querySelector("#footer-lbl").textContent=`${ee.length} visitantes registrados`,Ve(e,ee)}catch(t){p(t.message,"error")}}function Ve(e,t){const o=e.querySelector("#tbody");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="6">Sin visitantes registrados</td></tr>';return}o.innerHTML=t.map(a=>{var i;return`
    <tr>
      <td class="td-muted" style="font-family:monospace">${a.dniVisitante}</td>
      <td><strong>${a.nombreVisitante}</strong></td>
      <td class="td-muted">${a.telefono??"—"}</td>
      <td class="td-muted">${a.email??"—"}</td>
      <td><span class="badge badge-purple">${((i=a.hijos)==null?void 0:i.length)??0} hijos</span></td>
      ${ge()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),ge()&&o.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>Be(e,ee.find(i=>i.id==a.dataset.id))))}function Be(e,t=null){P({title:t?"✏️ Editar Visitante":"+ Nuevo Visitante",bodyHTML:`
      <div class="form-grid">
        <div class="form-group">
          <label>DNI *</label>
          <input class="form-control" id="m-dni" value="${(t==null?void 0:t.dniVisitante)??""}" maxlength="20" placeholder="Número de documento" />
        </div>
        <div class="form-group">
          <label>Nombre completo *</label>
          <input class="form-control" id="m-nombre" value="${(t==null?void 0:t.nombreVisitante)??""}" placeholder="Nombre y apellidos" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="form-control" id="m-tel" value="${(t==null?void 0:t.telefono)??""}" placeholder="Ej: 987654321" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" type="email" id="m-email" value="${(t==null?void 0:t.email)??""}" placeholder="correo@ejemplo.com" />
        </div>
      </div>`,confirmText:t?"Actualizar":"Registrar",onConfirm:async(o,a)=>{const i={dniVisitante:o.querySelector("#m-dni").value.trim(),nombreVisitante:o.querySelector("#m-nombre").value.trim(),telefono:o.querySelector("#m-tel").value.trim()||null,email:o.querySelector("#m-email").value.trim()||null};if(!i.dniVisitante||!i.nombreVisitante){p("DNI y nombre son obligatorios","warning");return}try{t?await ve.actualizar(t.id,i):await ve.registrar(i),p(t?"Visitante actualizado":"Visitante registrado","success"),a(),await ke(e)}catch(r){p(r.message,"error")}}})}const he=()=>b.hasRole("ADMINISTRADOR","SECRETARIA");let te=[],Fe=[];async function St(e){var t;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Alumnos</h1>
        <div class="sub">Estudiantes registrados en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${he()?'<button class="btn btn-primary" id="btn-new">+ Nuevo Alumno</button>':""}
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
              <th>Nombre</th><th>Grado</th><th>Sección</th><th>Apoderado</th><th>QR</th>
              ${he()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`,await je(e),e.querySelector("#search").addEventListener("input",o=>{const a=o.target.value.toLowerCase();Ue(e,te.filter(i=>{var r,s,n;return((r=i.nombre)==null?void 0:r.toLowerCase().includes(a))||((s=i.grado)==null?void 0:s.toLowerCase().includes(a))||((n=i.seccion)==null?void 0:n.toLowerCase().includes(a))}))}),(t=e.querySelector("#btn-new"))==null||t.addEventListener("click",()=>ze(e))}async function je(e){try{[te,Fe]=await Promise.all([pe.listar(),ve.listar()]),e.querySelector("#total").textContent=`${te.length}`,e.querySelector("#footer-lbl").textContent=`${te.length} alumnos registrados`,Ue(e,te)}catch(t){p(t.message,"error")}}function Ue(e,t){const o=e.querySelector("#tbody");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="6">Sin alumnos registrados</td></tr>';return}o.innerHTML=t.map(a=>{var i;return`
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td><span class="badge badge-blue">${a.grado}</span></td>
      <td><span class="badge badge-gray">${a.seccion}</span></td>
      <td class="td-muted">${((i=a.apoderado)==null?void 0:i.nombreVisitante)??"—"}</td>
      <td>
        ${a.codigoQr?`<button class="btn btn-outline btn-sm qr-btn" data-id="${a.id}" data-nombre="${a.nombre}" title="Ver código QR">
               📱 Ver QR
             </button>`:'<span class="td-muted">Sin QR</span>'}
      </td>
      ${he()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),he()&&o.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>ze(e,te.find(i=>i.id==a.dataset.id)))),o.querySelectorAll(".qr-btn").forEach(a=>a.addEventListener("click",()=>$t(a.dataset.id,a.dataset.nombre)))}async function $t(e,t){let o=null;P({title:`📱 Código QR — ${t}`,bodyHTML:`
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
        <div id="qr-loading" style="color:var(--text2);font-size:13px">Cargando QR…</div>
        <img id="qr-img" style="display:none;border-radius:12px;border:3px solid var(--border);
          box-shadow:0 4px 24px rgba(0,0,0,0.15);width:220px;height:220px;object-fit:contain" />
        <p style="font-size:12px;color:var(--text3);text-align:center;max-width:240px">
          Muestra este código en la entrada para registrar la asistencia del alumno.
        </p>
        <button class="btn btn-outline btn-sm" id="btn-download-qr">⬇ Descargar QR</button>
      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:async a=>{try{const i=await pe.obtenerQrBlob(e);o=URL.createObjectURL(i);const r=a.querySelector("#qr-img");r.src=o,r.style.display="block",a.querySelector("#qr-loading").style.display="none",a.querySelector("#btn-download-qr").addEventListener("click",()=>{const s=document.createElement("a");s.href=o,s.download=`qr-alumno-${t.replace(/\s+/g,"-")}.png`,s.click()})}catch{a.querySelector("#qr-loading").textContent="Error al cargar el QR",p("No se pudo cargar el código QR","error")}},onClose:()=>{o&&URL.revokeObjectURL(o)}})}function ze(e,t=null){const o=Fe.map(a=>{var i;return`<option value="${a.id}" ${((i=t==null?void 0:t.apoderado)==null?void 0:i.id)===a.id?"selected":""}>${a.nombreVisitante} (${a.dniVisitante})</option>`}).join("");P({title:t?"✏️ Editar Alumno":"+ Nuevo Alumno",bodyHTML:`
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Nombre completo *</label>
          <input class="form-control" id="m-nombre" value="${(t==null?void 0:t.nombre)??""}" placeholder="Nombre del alumno" />
        </div>
        <div class="form-group">
          <label>Grado *</label>
          <input class="form-control" id="m-grado" value="${(t==null?void 0:t.grado)??""}" placeholder="Ej: 3° Primaria" />
        </div>
        <div class="form-group">
          <label>Sección *</label>
          <input class="form-control" id="m-seccion" value="${(t==null?void 0:t.seccion)??""}" placeholder="Ej: A" maxlength="5" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Apoderado (Visitante)</label>
          <select class="form-control" id="m-apoderado">
            <option value="">— Sin apoderado —</option>
            ${o}
          </select>
        </div>
      </div>`,confirmText:t?"Actualizar":"Registrar",onConfirm:async(a,i)=>{const r={nombre:a.querySelector("#m-nombre").value.trim(),grado:a.querySelector("#m-grado").value.trim(),seccion:a.querySelector("#m-seccion").value.trim(),visitanteId:a.querySelector("#m-apoderado").value||null};if(!r.nombre||!r.grado||!r.seccion){p("Nombre, grado y sección son obligatorios","warning");return}r.visitanteId&&(r.visitanteId=Number(r.visitanteId));try{t?await pe.actualizar(t.id,r):await pe.registrar(r),p(t?"Alumno actualizado":"Alumno registrado — QR generado automáticamente","success"),i(),await je(e)}catch(s){p(s.message,"error")}}})}const oe={listar:()=>h.get("/usuarios"),registrar:e=>h.post("/usuarios",e),actualizar:(e,t)=>h.put(`/usuarios/${e}`,t),eliminar:e=>h.delete(`/usuarios/${e}`)},Rt=["ADMINISTRADOR","PORTERO","SECRETARIA","DIRECTOR","PROFESOR"],wt={ADMINISTRADOR:"badge-red",PORTERO:"badge-blue",SECRETARIA:"badge-green",DIRECTOR:"badge-yellow",PROFESOR:"badge-purple"},At=e=>`<span class="badge ${wt[e]??"badge-gray"}">${e}</span>`;let G=[];async function It(e){e.innerHTML=`
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
    </div>`,await Te(e),e.querySelector("#search").addEventListener("input",t=>{const o=t.target.value.toLowerCase();_e(e,G.filter(a=>{var i,r;return((i=a.nombre)==null?void 0:i.toLowerCase().includes(o))||((r=a.usuario)==null?void 0:r.toLowerCase().includes(o))}))}),e.querySelector("#btn-new").addEventListener("click",()=>Qe(e))}async function Te(e){try{G=await oe.listar(),e.querySelector("#total").textContent=`${G.length}`,e.querySelector("#footer-lbl").textContent=`${G.length} usuarios`,_e(e,G)}catch(t){p(t.message,"error")}}function _e(e,t){const o=e.querySelector("#tbody");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="4">Sin usuarios registrados</td></tr>';return}o.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td class="td-muted" style="font-family:monospace">@${a.usuario}</td>
      <td>${At(a.rol)}</td>
      <td style="display:flex;gap:6px;padding:10px 16px">
        <button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button>
        <button class="btn btn-danger  btn-sm del-btn"  data-id="${a.id}">🗑 Eliminar</button>
      </td>
    </tr>`).join(""),o.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>Qe(e,G.find(i=>i.id==a.dataset.id)))),o.querySelectorAll(".del-btn").forEach(a=>a.addEventListener("click",()=>Lt(e,G.find(i=>i.id==a.dataset.id))))}function Qe(e,t=null){const o=Rt.map(a=>`<option value="${a}" ${(t==null?void 0:t.rol)===a?"selected":""}>${a}</option>`).join("");P({title:t?"✏️ Editar Usuario":"+ Nuevo Usuario",bodyHTML:`
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre completo *</label>
          <input class="form-control" id="m-nombre" value="${(t==null?void 0:t.nombre)??""}" placeholder="Nombre completo" />
        </div>
        <div class="form-group">
          <label>Nombre de usuario *</label>
          <input class="form-control" id="m-usuario" value="${(t==null?void 0:t.usuario)??""}" placeholder="Ej: jperez" />
        </div>
        <div class="form-group">
          <label>${t?"Nueva contraseña (dejar vacío para no cambiar)":"Contraseña *"}</label>
          <input class="form-control" type="password" id="m-pass" placeholder="${t?"Nueva contraseña…":"Contraseña segura"}" />
        </div>
        <div class="form-group">
          <label>Rol *</label>
          <select class="form-control" id="m-rol">
            <option value="">— Selecciona —</option>
            ${o}
          </select>
        </div>
      </div>`,confirmText:t?"Actualizar":"Crear Usuario",onConfirm:async(a,i)=>{const r={nombre:a.querySelector("#m-nombre").value.trim(),usuario:a.querySelector("#m-usuario").value.trim(),contraseña:a.querySelector("#m-pass").value,rol:a.querySelector("#m-rol").value};if(!r.nombre||!r.usuario||!r.rol){p("Nombre, usuario y rol son obligatorios","warning");return}if(!t&&!r.contraseña){p("La contraseña es obligatoria","warning");return}try{t?await oe.actualizar(t.id,r):await oe.registrar(r),p(t?"Usuario actualizado":"Usuario creado","success"),i(),await Te(e)}catch(s){p(s.message,"error")}}})}function Lt(e,t){P({title:"🗑 Eliminar Usuario",bodyHTML:`<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${t.nombre}</strong> (@${t.usuario})?<br/>Esta acción no se puede deshacer.</p>`,confirmText:"Eliminar",danger:!0,onConfirm:async(o,a)=>{try{await oe.eliminar(t.id),p("Usuario eliminado","success"),a(),await Te(e)}catch(i){p(i.message,"error")}}})}const Tt="modulepreload",xt=function(e){return"/"+e},qe={},Ce=function(t,o,a){let i=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),n=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));i=Promise.allSettled(o.map(l=>{if(l=xt(l),l in qe)return;qe[l]=!0;const d=l.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Tt,d||(u.as="script"),u.crossOrigin="",u.href=l,n&&u.setAttribute("nonce",n),document.head.appendChild(u),d)return new Promise((m,g)=>{u.addEventListener("load",m),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(s){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=s,window.dispatchEvent(n),!n.defaultPrevented)throw s}return i.then(s=>{for(const n of s||[])n.status==="rejected"&&r(n.reason);return t().catch(r)})},xe={registrar:e=>x.post("/asistencia/alumnos",e),listar:()=>x.get("/asistencia/alumnos"),obtenerPorId:e=>x.get(`/asistencia/alumnos/${e}`),porAlumno:e=>x.get(`/asistencia/alumnos/alumno/${e}`),porFecha:e=>x.get(`/asistencia/alumnos/fecha?fecha=${e}`),porAlumnoYFecha:(e,t)=>x.get(`/asistencia/alumnos/alumno/${e}/fecha?fecha=${t}`),porGradoYFecha:(e,t)=>x.get(`/asistencia/alumnos/grado/${encodeURIComponent(e)}/fecha?fecha=${t}`)},ae=()=>new Date().toISOString().split("T")[0],Ge=e=>e?new Date(e).toLocaleString("es-PE"):"—",Je=e=>e==="ENTRADA"?'<span class="badge badge-green">▶ ENTRADA</span>':'<span class="badge badge-red">◀ SALIDA</span>';let U=[],z=[],Ye=[],X="personal";async function Ot(e){var o,a,i,r,s,n;const t=b.hasRole("ADMINISTRADOR","PORTERO","SECRETARIA");e.innerHTML=`
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
          👤 Personal
        </button>
        <button class="btn btn-outline tab-btn" id="tab-alumnos" data-tab="alumnos">
          🎒 Alumnos (QR)
        </button>
      </div>

      <!-- ══════════ SECCIÓN PERSONAL ══════════ -->
      <div id="section-personal">
        ${t?`
        <div class="table-card" style="margin-bottom:20px">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"></span> Registro Rápido — Mi Asistencia</div>
          </div>
          <div style="padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" id="btn-new">+ Registro de personal</button>
          </div>
        </div>`:""}

        <div class="table-card">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"></span> Registros — Personal</div>
            <div class="table-controls">
              <div class="search-box">
                <span style="color:var(--text3);font-size:12px"></span>
                <input type="date" id="filter-fecha" value="${ae()}"
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
        ${t?`
        <div class="table-card" style="margin-bottom:20px">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon">📷</span> Registrar Asistencia por QR</div>
          </div>
          <div style="padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="btn btn-primary" id="btn-scan-qr">📱 Escanear QR</button>
            <span style="color:var(--text3);font-size:13px">Enfoca la cámara al código QR del alumno</span>
          </div>
        </div>`:""}

        <div class="table-card">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon">🎒</span> Registros — Alumnos</div>
            <div class="table-controls">
              <div class="search-box">
                <input type="date" id="filter-fecha-alumnos" value="${ae()}"
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

    </div>`,e.querySelectorAll(".tab-btn").forEach(l=>{l.addEventListener("click",()=>{X=l.dataset.tab,e.querySelectorAll(".tab-btn").forEach(d=>{d.classList.toggle("active",d.dataset.tab===X),d.classList.toggle("btn-primary",d.dataset.tab===X),d.classList.toggle("btn-outline",d.dataset.tab!==X)}),e.querySelector("#section-personal").style.display=X==="personal"?"":"none",e.querySelector("#section-alumnos").style.display=X==="alumnos"?"":"none"})});try{Ye=await oe.listar()}catch{}await Ie(e,ae()),(o=e.querySelector("#btn-filter"))==null||o.addEventListener("click",()=>{const l=e.querySelector("#filter-fecha").value;l&&Ie(e,l)}),(a=e.querySelector("#btn-all"))==null||a.addEventListener("click",()=>Dt(e)),(i=e.querySelector("#btn-new"))==null||i.addEventListener("click",()=>qt(e)),await Le(e,ae()),(r=e.querySelector("#btn-filter-alumnos"))==null||r.addEventListener("click",()=>{const l=e.querySelector("#filter-fecha-alumnos").value;l&&Le(e,l)}),(s=e.querySelector("#btn-all-alumnos"))==null||s.addEventListener("click",()=>Ct(e)),(n=e.querySelector("#btn-scan-qr"))==null||n.addEventListener("click",()=>Mt(e))}async function Ie(e,t){try{U=await Se.porFecha(t),e.querySelector("#total-personal").textContent=`${U.length}`,e.querySelector("#footer-personal").textContent=`${U.length} registros`,We(e,U)}catch{p("No se pudo conectar al servicio de asistencia (puerto 8081)","error")}}async function Dt(e){try{U=await Se.listar(),e.querySelector("#total-personal").textContent=`${U.length}`,e.querySelector("#footer-personal").textContent=`${U.length} registros totales`,We(e,U)}catch(t){p(t.message,"error")}}function We(e,t){const o=e.querySelector("#tbody-personal");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="5">Sin registros para este filtro</td></tr>';return}o.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombrePersonal}</strong></td>
      <td><span class="badge badge-purple">${a.rolPersonal}</span></td>
      <td>${Je(a.tipoEvento)}</td>
      <td class="td-small">${Ge(a.horaEvento)}</td>
      <td class="td-muted">${a.observaciones??"—"}</td>
    </tr>`).join("")}function qt(e){const t=Ye.map(a=>`<option value="${a.id}" data-nombre="${a.nombre}" data-rol="${a.rol}">${a.nombre} — ${a.rol}</option>`).join(""),o=new Date().toISOString().slice(0,16);P({title:"+ Registrar Asistencia — Personal",bodyHTML:`
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Personal *</label>
          <select class="form-control" id="m-usuario">
            <option value="">— Selecciona el personal —</option>
            ${t}
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
          <input class="form-control" type="datetime-local" id="m-hora" value="${o}" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Observaciones</label>
          <input class="form-control" id="m-obs" placeholder="Ej: Llegó tarde, justificación médica…" />
        </div>
      </div>`,confirmText:"Registrar",onConfirm:async(a,i)=>{const r=a.querySelector("#m-usuario"),s=r.options[r.selectedIndex],n=r.value;if(!n){p("Selecciona un miembro del personal","warning");return}const l={usuarioId:Number(n),nombrePersonal:s.dataset.nombre,rolPersonal:s.dataset.rol,tipoEvento:a.querySelector("#m-tipo").value,horaEvento:a.querySelector("#m-hora").value?new Date(a.querySelector("#m-hora").value).toISOString():null,observaciones:a.querySelector("#m-obs").value.trim()||null};try{await Se.registrar(l),p("Asistencia registrada","success"),i();const d=e.querySelector("#filter-fecha").value||ae();await Ie(e,d)}catch(d){p(d.message,"error")}}})}async function Le(e,t){try{z=await xe.porFecha(t),e.querySelector("#total-alumnos").textContent=`${z.length}`,e.querySelector("#footer-alumnos").textContent=`${z.length} registros`,Ke(e,z)}catch{p("No se pudo cargar asistencia de alumnos","error")}}async function Ct(e){try{z=await xe.listar(),e.querySelector("#total-alumnos").textContent=`${z.length}`,e.querySelector("#footer-alumnos").textContent=`${z.length} registros totales`,Ke(e,z)}catch(t){p(t.message,"error")}}function Ke(e,t){const o=e.querySelector("#tbody-alumnos");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="6">Sin registros para este filtro</td></tr>';return}o.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombreAlumno}</strong></td>
      <td><span class="badge badge-blue">${a.grado??"—"}</span></td>
      <td><span class="badge badge-gray">${a.seccion??"—"}</span></td>
      <td>${Je(a.tipoEvento)}</td>
      <td class="td-small">${Ge(a.horaEvento)}</td>
      <td class="td-muted">${a.observaciones??"—"}</td>
    </tr>`).join("")}function Mt(e){const t="qr-reader-"+Date.now();let o=null,a=!1;P({title:"📷 Escanear QR del Alumno",bodyHTML:`
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px">

        <!-- Vista previa del scanner -->
        <div id="${t}"
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
        <div id="scan-actions" style="display:none;width:100%;display:none">
          <label style="font-size:13px;color:var(--text2);margin-bottom:6px;display:block">Tipo de evento</label>
          <div style="display:flex;gap:10px">
            <button class="btn btn-primary" id="btn-entrada-qr" style="flex:1">▶ ENTRADA</button>
            <button class="btn btn-outline" id="btn-salida-qr" style="flex:1;border-color:#ef4444;color:#ef4444">◀ SALIDA</button>
          </div>
          <input class="form-control" id="scan-obs" placeholder="Observaciones (opcional)"
            style="margin-top:10px" />
        </div>

        <div id="scan-status" style="font-size:12px;color:var(--text3)">Iniciando cámara…</div>
      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:async s=>{try{const{Html5Qrcode:n}=await Ce(async()=>{const{Html5Qrcode:d}=await import("./index-BNMS5zO2.js");return{Html5Qrcode:d}},[]);o=new n(t);const l={fps:10,qrbox:{width:220,height:220}};await o.start({facingMode:"environment"},l,d=>r(s,d),()=>{}),a=!0,s.querySelector("#scan-status").textContent="Esperando QR…"}catch(n){s.querySelector("#scan-status").textContent="No se pudo acceder a la cámara. "+(n.message||""),p("Error al iniciar la cámara","error")}},onClose:async()=>{if(o&&a)try{await o.stop()}catch{}}});let i=null;async function r(s,n){if(n!==i){if(i=n,o&&a)try{await o.pause()}catch{}s.querySelector("#scan-status").textContent="QR detectado — verificando alumno…";try{const{api:l}=await Ce(async()=>{const{api:c}=await Promise.resolve().then(()=>dt);return{api:c}},void 0),d=await l.get(`/alumnos/qr/${n}`);s.querySelector("#scan-result").style.display="block",s.querySelector("#scan-nombre").textContent="🎒 "+d.nombre,s.querySelector("#scan-badges").innerHTML=`
        <span class="badge badge-blue">${d.grado}</span>
        <span class="badge badge-gray">${d.seccion}</span>`,s.querySelector("#scan-actions").style.display="block",s.querySelector("#scan-status").textContent="Selecciona el tipo de evento:",s.querySelector("#btn-entrada-qr").onclick=()=>Me(s,n,"ENTRADA",e),s.querySelector("#btn-salida-qr").onclick=()=>Me(s,n,"SALIDA",e)}catch{if(s.querySelector("#scan-status").textContent="❌ QR inválido — alumno no encontrado",p("QR no corresponde a ningún alumno","error"),i=null,o&&a)try{await o.resume()}catch{}}}}}async function Me(e,t,o,a){var s,n,l;const i=((n=(s=e.querySelector("#scan-obs"))==null?void 0:s.value)==null?void 0:n.trim())||null,r={codigoQr:t,tipoEvento:o,horaEvento:null,registradoPorId:b.id()?Number(b.id()):null,observaciones:i};try{await xe.registrar(r),p(`${o} del alumno registrada correctamente`,"success"),e.remove();const d=((l=a.querySelector("#filter-fecha-alumnos"))==null?void 0:l.value)||ae();await Le(a,d)}catch(d){p(d.message||"Error al registrar asistencia","error")}}const M={listarTodos:()=>S.get("/agenda"),listarPorProfesor:e=>S.get(`/agenda/profesor/${e}`),listarPorFecha:e=>S.get(`/agenda/fecha?fecha=${e}`),listarPorProfesorFecha:(e,t)=>S.get(`/agenda/profesor/${e}/fecha?fecha=${t}`),listarPorEstado:(e,t)=>S.get(`/agenda/profesor/${e}/estado/${t}`),listarRecurrentes:e=>S.get(`/agenda/recurrentes/${e}`),crear:e=>S.post("/agenda",e),actualizar:(e,t)=>S.put(`/agenda/${e}`,t),eliminar:e=>S.delete(`/agenda/${e}`),listarHorarios:()=>S.get("/horarios"),listarHorariosPorProfesor:e=>S.get(`/horarios/profesor/${e}`),listarHorariosPorDia:e=>S.get(`/horarios/dia/${e}`),crearHorario:e=>S.post("/horarios",e),actualizarHorario:(e,t)=>S.put(`/horarios/${e}`,t),eliminarHorario:e=>S.delete(`/horarios/${e}`)},Xe=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Pt=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],Ze=["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"],W={HORARIO_ATENCION:{bg:"#6366f1",light:"#eef2ff",text:"#4338ca",label:"Atención"},REUNION:{bg:"#f59e0b",light:"#fffbeb",text:"#b45309",label:"Reunión"},ACTIVIDAD:{bg:"#10b981",light:"#ecfdf5",text:"#047857",label:"Actividad"},OTRO:{bg:"#64748b",light:"#f1f5f9",text:"#334155",label:"Otro"}},me={ACTIVO:{bg:"#dcfce7",text:"#16a34a",label:"Activo"},CANCELADO:{bg:"#fee2e2",text:"#dc2626",label:"Cancelado"},COMPLETADO:{bg:"#e0e7ff",text:"#4338ca",label:"Completado"}},ye=e=>e?new Date(e).toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}):"—",Nt=e=>e?new Date(e).toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}):"—",Ee=e=>e.toISOString().split("T")[0];let j=new Date().getFullYear(),q=new Date().getMonth(),B=[],K=[],$=null,Ae="calendario";async function Ht(e){const t=b.hasRole("ADMINISTRADOR","DIRECTOR","PROFESOR"),o=b.hasRole("ADMINISTRADOR","DIRECTOR");e.innerHTML=kt(t,o),Vt(e);const a=b.hasRole("PROFESOR")?b.id():null;await ie(a),_(e),Y(e),Bt(e)}function kt(e,t){const o=b.hasRole("PROFESOR");return`
  <div class="page-topbar">
    <div>
      <h1><i class="fas fa-calendar-alt" style="color:var(--primary)"></i> Agenda de Profesores</h1>

    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      ${e?'<button class="btn btn-primary" id="btn-new-evento"><i class="fas fa-plus"></i> Nuevo Evento</button>':""}
      ${t?'<button class="btn btn-outline"  id="btn-new-horario"><i class="fas fa-clock"></i> Nuevo Horario</button>':""}
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
          ${Object.entries(W).map(([a,i])=>`
            <div class="legend-item">
              <span class="legend-dot" style="background:${i.bg}"></span>
              <span>${i.label}</span>
            </div>`).join("")}
        </div>

        <!-- Filtros rápidos -->
        ${o?"":`
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
        `}
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
                  ${e?"<th>Acciones</th>":""}
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
  </div>`}async function ie(e=null){try{const[t,o]=await Promise.all([e?M.listarPorProfesor(e):M.listarTodos(),e?M.listarHorariosPorProfesor(e):M.listarHorarios()]);B=t||[],K=o||[]}catch(t){p(`Error cargando datos: ${t.message}`,"error"),B=[],K=[]}}function _(e){const t=e.querySelector("#cal-month-label"),o=e.querySelector("#cal-grid");if(!t||!o)return;t.textContent=`${Xe[q]} ${j}`;const a=new Date(j,q,1).getDay(),i=new Date(j,q+1,0).getDate(),r=new Date;let s=Pt.map(n=>`<div class="cal-day-header">${n}</div>`).join("");for(let n=0;n<a;n++)s+='<div class="cal-cell cal-empty"></div>';for(let n=1;n<=i;n++){const l=new Date(j,q,n),d=Ee(l),c=n===r.getDate()&&q===r.getMonth()&&j===r.getFullYear(),u=$===d,m=B.filter(f=>{const E=new Date(f.fechaInicio);return E.getFullYear()===j&&E.getMonth()===q&&E.getDate()===n}),g=[...new Set(m.map(f=>f.tipoAgenda))].slice(0,3).map(f=>{var E;return`<span class="cal-dot" style="background:${((E=W[f])==null?void 0:E.bg)??"#888"}"></span>`}).join("");s+=`
      <div class="cal-cell ${c?"cal-today":""} ${u?"cal-selected":""} ${m.length?"cal-has-events":""}"
           data-date="${d}" data-count="${m.length}">
        <span class="cal-day-num">${n}</span>
        <div class="cal-dots">${g}</div>
      </div>`}o.innerHTML=s,o.querySelectorAll(".cal-cell[data-date]").forEach(n=>{n.addEventListener("click",()=>{$=n.dataset.date,_(e),J(e,$)})})}function J(e,t){const o=e.querySelector("#day-events-title"),a=e.querySelector("#day-events-list");if(!o||!a)return;const i=new Date(t+"T00:00:00");o.innerHTML=`<i class="fas fa-calendar-day"></i>
    Eventos del ${i.getDate()} de ${Xe[i.getMonth()]} ${i.getFullYear()}`;const r=B.filter(s=>{const n=new Date(s.fechaInicio);return Ee(n)===t});if(!r.length){a.innerHTML='<div class="day-empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>';return}a.innerHTML=r.map(s=>{const n=W[s.tipoAgenda]??W.OTRO,l=me[s.estado]??me.ACTIVO;return`
      <div class="day-event-item" style="border-left:4px solid ${n.bg}">
        <div class="day-event-header">
          <span class="day-event-tipo" style="background:${n.light};color:${n.text}">
            ${n.label}
          </span>
          <span class="day-event-estado" style="background:${l.bg};color:${l.text}">
            ${l.label}
          </span>
        </div>
        <div class="day-event-title">${s.titulo}</div>
        <div class="day-event-meta">
          <span><i class="fas fa-user-tie"></i> ${s.nombreProfesor}</span>
          <span><i class="fas fa-clock"></i> ${ye(s.fechaInicio)} – ${ye(s.fechaFin)}</span>
          ${s.lugar?`<span><i class="fas fa-location-dot"></i> ${s.lugar}</span>`:""}
          ${s.recurrente?`<span><i class="fas fa-rotate"></i> Recurrente — ${s.diaSemana??""}</span>`:""}
        </div>
        ${s.descripcion?`<div class="day-event-desc">${s.descripcion}</div>`:""}
      </div>`}).join("")}function se(e,t=""){const o=e.querySelector("#eventos-tbody");if(!o)return;const a=b.hasRole("ADMINISTRADOR","DIRECTOR","PROFESOR"),i=b.hasRole("ADMINISTRADOR","DIRECTOR");let r=B;if(t){const s=t.toLowerCase();r=r.filter(n=>{var l,d,c;return((l=n.nombreProfesor)==null?void 0:l.toLowerCase().includes(s))||((d=n.titulo)==null?void 0:d.toLowerCase().includes(s))||((c=n.especialidad)==null?void 0:c.toLowerCase().includes(s))})}if(!r.length){o.innerHTML=`<tr><td colspan="8" class="text-center" style="padding:30px;color:var(--text3)">
      <i class="fas fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:6px"></i>
      Sin eventos registrados
    </td></tr>`;return}o.innerHTML=r.map(s=>{const n=W[s.tipoAgenda]??W.OTRO,l=me[s.estado]??me.ACTIVO;return`
      <tr>
        <td>
          <span class="badge-tipo" style="background:${n.light};color:${n.text}">
            ${n.label}
          </span>
        </td>
        <td><strong>${s.titulo}</strong>
          ${s.recurrente?'<span class="recurrente-tag"><i class="fas fa-rotate"></i></span>':""}
        </td>
        <td>
          <div style="font-weight:500">${s.nombreProfesor}</div>
          ${s.especialidad?`<div style="font-size:11px;color:var(--text3)">${s.especialidad}</div>`:""}
        </td>
        <td>${Nt(s.fechaInicio)}</td>
        <td style="font-variant-numeric:tabular-nums;font-size:13px">
          ${ye(s.fechaInicio)} – ${ye(s.fechaFin)}
        </td>
        <td><span class="badge-estado" style="background:${l.bg};color:${l.text}">${l.label}</span></td>
        <td style="color:var(--text2);font-size:13px">${s.lugar??"—"}</td>
        ${a?`
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline btn-edit-evento" data-id="${s.id}"
              title="Editar"><i class="fas fa-pen"></i></button>
            ${i?`
            <button class="btn btn-sm btn-danger btn-del-evento" data-id="${s.id}"
              title="Eliminar"><i class="fas fa-trash"></i></button>`:""}
          </div>
        </td>`:""}
      </tr>`}).join(""),e.querySelectorAll(".btn-edit-evento").forEach(s=>{s.addEventListener("click",()=>{const n=B.find(l=>l.id==s.dataset.id);n&&et(e,n)})}),e.querySelectorAll(".btn-del-evento").forEach(s=>{s.addEventListener("click",()=>st(e,s.dataset.id,"evento"))})}function Y(e,t=""){const o=e.querySelector("#horario-week-grid");if(!o)return;const a=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"],i={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},r=b.hasRole("ADMINISTRADOR","DIRECTOR"),s=t?[t]:a,n=K;if(!n.length){o.innerHTML=`<div class="day-empty" style="padding:40px;text-align:center">
      <i class="fas fa-calendar-week" style="font-size:2rem;color:var(--text3);display:block;margin-bottom:10px"></i>
      <span style="color:var(--text3)">Sin horarios registrados</span>
    </div>`;return}o.innerHTML=s.map(l=>{const d=n.filter(c=>c.diaSemana===l&&c.activo);return d.length?`
      <div class="week-day-col">
        <div class="week-day-header">${i[l]}</div>
        <div class="week-day-body">
          ${d.map(c=>{var u,m;return`
            <div class="week-block" style="border-left:4px solid var(--primary)">
              <div class="week-block-time">${((u=c.horaInicio)==null?void 0:u.slice(0,5))??""} – ${((m=c.horaFin)==null?void 0:m.slice(0,5))??""}</div>
              <div class="week-block-materia">${c.materia}</div>
              <div class="week-block-meta">
                <span><i class="fas fa-user-tie"></i> ${c.nombreProfesor}</span>
                ${c.aula?`<span><i class="fas fa-door-open"></i> ${c.aula}</span>`:""}
              </div>
              ${c.activo?"":'<span class="week-inactive">Inactivo</span>'}
              ${r?`
              <div class="week-block-actions">
                <button class="btn btn-sm btn-outline btn-edit-horario" data-id="${c.id}"
                  title="Editar"><i class="fas fa-pen"></i></button>
                <button class="btn btn-sm btn-danger btn-del-horario" data-id="${c.id}"
                  title="Eliminar"><i class="fas fa-trash"></i></button>
              </div>`:""}
            </div>`}).join("")}
        </div>
      </div>`:""}).join(""),e.querySelectorAll(".btn-edit-horario").forEach(l=>{l.addEventListener("click",()=>{const d=K.find(c=>c.id==l.dataset.id);d&&tt(e,d)})}),e.querySelectorAll(".btn-del-horario").forEach(l=>{l.addEventListener("click",()=>st(e,l.dataset.id,"horario"))})}function Vt(e){e.addEventListener("click",t=>{const o=t.target.closest(".agenda-tab");o&&(Ae=o.dataset.tab,e.querySelectorAll(".agenda-tab").forEach(a=>a.classList.toggle("active",a===o)),e.querySelectorAll(".tab-content").forEach(a=>{a.style.display=a.id===`tab-${Ae}`?"":"none"}),Ae==="horarios"&&Y(e))})}function Bt(e,t,o){var a,i,r,s,n,l,d,c;(a=e.querySelector("#cal-prev"))==null||a.addEventListener("click",()=>{q===0?(q=11,j--):q--,_(e),$&&J(e,$)}),(i=e.querySelector("#cal-next"))==null||i.addEventListener("click",()=>{q===11?(q=0,j++):q++,_(e),$&&J(e,$)}),(r=e.querySelector("#btn-filter-prof"))==null||r.addEventListener("click",async()=>{var m,g;const u=(g=(m=e.querySelector("#filter-profesor"))==null?void 0:m.value)==null?void 0:g.trim();await ie(u?Number(u):null),_(e),se(e),Y(e),$&&J(e,$)}),(s=e.querySelector("#btn-clear-filter"))==null||s.addEventListener("click",async()=>{const u=e.querySelector("#filter-profesor");u&&(u.value=""),await ie(null),_(e),se(e),Y(e),$&&J(e,$)}),(n=e.querySelector("#search-eventos"))==null||n.addEventListener("input",u=>{se(e,u.target.value)}),(l=e.querySelector("#filter-dia"))==null||l.addEventListener("change",u=>{Y(e,u.target.value)}),(d=e.querySelector("#btn-new-evento"))==null||d.addEventListener("click",()=>{et(e,null)}),(c=e.querySelector("#btn-new-horario"))==null||c.addEventListener("click",()=>{tt(e,null)}),se(e)}function et(e,t){const o=!!t,a=o?"Editar Evento de Agenda":"Nuevo Evento de Agenda",i=b.hasRole("PROFESOR"),r=(t==null?void 0:t.profesorId)??(i?b.id():""),s=(t==null?void 0:t.nombreProfesor)??(i?b.nombre():""),n=d=>d?d.replace("T","T").substring(0,16):"",l=`
    <div class="form-grid-2">
      <div class="form-group" style="grid-column:1/-1">
        <label>Título del evento *</label>
        <input id="ev-titulo" class="form-input" value="${(t==null?void 0:t.titulo)??""}" placeholder="Ej: Horario de atención" />
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Profesor *</label>
        <div class="profesor-search-wrap" id="ev-profesor-wrap">
          <div class="profesor-search-input-row">
            <i class="fas fa-search profesor-search-icon"></i>
            <input id="ev-profesor-search" class="form-input profesor-search-input"
              placeholder="Escribe el nombre del profesor…"
              value="${s}" autocomplete="off" ${i?"disabled":""}/>
          </div>
          <div class="profesor-search-dropdown" id="ev-profesor-dropdown"></div>
          <input type="hidden" id="ev-profesorId" value="${r}"/>
          <input type="hidden" id="ev-nombreProfesor" value="${s}"/>
        </div>
      </div>
      <div class="form-group">
        <label>Especialidad</label>
        <input id="ev-especialidad" class="form-input" value="${(t==null?void 0:t.especialidad)??""}" placeholder="Ej: Matemáticas"/>
      </div>
      <div class="form-group">
        <label>Tipo *</label>
        <select id="ev-tipo" class="form-select">
          ${Object.entries(W).map(([d,c])=>`<option value="${d}" ${(t==null?void 0:t.tipoAgenda)===d?"selected":""}>${c.label}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Fecha del Evento *</label>
        <input id="ev-fecha" type="date" class="form-input" value="${t?Ee(new Date(t.fechaInicio)):$??Ee(new Date)}"/>
      </div>
      <div class="form-group">
        <label>Horario de Atención *</label>
        <select id="ev-horario-select" class="form-select">
          <option value="">Seleccione un profesor primero...</option>
        </select>
      </div>
      <input type="hidden" id="ev-inicio" value="${t!=null&&t.fechaInicio?n(t.fechaInicio):""}"/>
      <input type="hidden" id="ev-fin" value="${t!=null&&t.fechaFin?n(t.fechaFin):""}"/>
      <div id="ev-fecha-warning" class="form-warning-message" style="display:none;grid-column:1/-1;margin-top:5px;color:#d97706;background:#fffbeb;padding:8px;border-radius:4px;border:1px solid #fef3c7;font-size:12px;"></div>
      <div class="form-group">
        <label>Estado</label>
        <select id="ev-estado" class="form-select">
          ${Object.entries(me).map(([d,c])=>`<option value="${d}" ${(t==null?void 0:t.estado)===d?"selected":""}>${c.label}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Lugar</label>
        <input id="ev-lugar" class="form-input" value="${(t==null?void 0:t.lugar)??""}" placeholder="Ej: Aula 201"/>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="ev-recurrente" ${t!=null&&t.recurrente?"checked":""}/>
          Evento recurrente (semanal)
        </label>
      </div>
      <div class="form-group" id="dia-semana-group" style="${t!=null&&t.recurrente?"":"display:none"}">
        <label>Día de la semana</label>
        <select id="ev-diaSemana" class="form-select">
          ${Ze.map(d=>`<option value="${d}" ${(t==null?void 0:t.diaSemana)===d?"selected":""}>${d.charAt(0)+d.slice(1).toLowerCase()}</option>`).join("")}
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Descripción</label>
        <textarea id="ev-descripcion" class="form-input" rows="3" placeholder="Descripción opcional…">${(t==null?void 0:t.descripcion)??""}</textarea>
      </div>
    </div>`;P({title:a,bodyHTML:l,onConfirm:async(d,c)=>{const u={profesorId:Number(document.getElementById("ev-profesorId").value),nombreProfesor:document.getElementById("ev-nombreProfesor").value.trim(),especialidad:document.getElementById("ev-especialidad").value.trim()||null,titulo:document.getElementById("ev-titulo").value.trim(),descripcion:document.getElementById("ev-descripcion").value.trim()||null,fechaInicio:document.getElementById("ev-inicio").value,fechaFin:document.getElementById("ev-fin").value,tipoAgenda:document.getElementById("ev-tipo").value,estado:document.getElementById("ev-estado").value,lugar:document.getElementById("ev-lugar").value.trim()||null,recurrente:document.getElementById("ev-recurrente").checked,diaSemana:document.getElementById("ev-recurrente").checked?document.getElementById("ev-diaSemana").value:null};if(!u.profesorId||!u.nombreProfesor||!u.titulo||!u.fechaInicio||!u.fechaFin){p("Completa los campos obligatorios (*)","error");return}try{o?(await M.actualizar(t.id,u),p("Evento actualizado correctamente","success")):(await M.crear(u),p("Evento creado correctamente","success"));const m=b.hasRole("PROFESOR")?b.id():null;await ie(m),_(e),se(e),$&&J(e,$),c()}catch(m){p(`Error: ${m.message}`,"error")}}}),setTimeout(()=>{var f,E,re,F;const d=R=>{if(!R)return"";const[w,y,A]=R.split("-").map(Number),T=new Date(w,y-1,A).getDay();return["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"][T]},c=R=>{const y={DOMINGO:0,LUNES:1,MARTES:2,MIERCOLES:3,JUEVES:4,VIERNES:5,SABADO:6}[R];if(y===void 0)return null;const A=new Date,N=A.getDay();let T=y-N;T<0&&(T+=7);const I=new Date(A.getFullYear(),A.getMonth(),A.getDate()+T),O=I.getFullYear(),V=String(I.getMonth()+1).padStart(2,"0"),C=String(I.getDate()).padStart(2,"0");return`${O}-${V}-${C}`},u=(R=!1)=>{const w=document.getElementById("ev-horario-select");if(!w)return;const y=w.options[w.selectedIndex],A=document.getElementById("ev-fecha"),N=document.getElementById("ev-inicio"),T=document.getElementById("ev-fin");if(y&&y.dataset.dia){const O=y.dataset.dia;if(!R&&A){const V=c(O);V&&(A.value=V)}}const I=A==null?void 0:A.value;if(I&&y&&y.dataset.inicio&&y.dataset.fin){const O=y.dataset.inicio,V=y.dataset.fin;N&&(N.value=`${I}T${O}`),T&&(T.value=`${I}T${V}`);const C=y.dataset.dia,Q=document.getElementById("ev-diaSemana");C&&Q&&(Q.value=C);const v=y.dataset.materia,H=document.getElementById("ev-especialidad");v&&H&&(H.value=v);const L=document.getElementById("ev-fecha-warning");if(C){const D=d(I);if(D!==C){const ne={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},$e=ne[C]||C,Re=ne[D]||D;L&&(L.innerHTML=`<i class="fas fa-exclamation-triangle"></i> La fecha seleccionada es <strong>${Re}</strong>, pero el horario seleccionado es para los <strong>${$e}</strong>.`,L.style.display="block")}else L&&(L.style.display="none",L.innerHTML="")}else L&&(L.style.display="none",L.innerHTML="")}else{N&&(N.value=""),T&&(T.value="");const O=document.getElementById("ev-fecha-warning");O&&(O.style.display="none",O.innerHTML="")}},m=async R=>{var y,A,N;const w=document.getElementById("ev-horario-select");if(w){w.innerHTML='<option value="">Cargando horarios...</option>';try{const I=(await M.listarHorariosPorProfesor(R)||[]).filter(v=>v.activo),O=((y=B.find(v=>v.profesorId==R&&v.especialidad))==null?void 0:y.especialidad)||((A=I.find(v=>v.materia))==null?void 0:A.materia)||((N=K.find(v=>v.profesorId==R&&v.materia))==null?void 0:N.materia)||"",V=document.getElementById("ev-especialidad");if(V&&O&&(V.value=O),I.length===0){w.innerHTML='<option value="">El profesor no tiene horarios registrados</option>',u(!0);return}const C={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"};let Q='<option value="">Seleccione un horario...</option>';if(I.forEach(v=>{const H=v.horaInicio.slice(0,5),L=v.horaFin.slice(0,5),D=C[v.diaSemana]||v.diaSemana;let ne=!1;if(t){const $e=n(t.fechaInicio).split("T")[1],Re=n(t.fechaFin).split("T")[1];$e===H&&Re===L&&v.diaSemana===t.diaSemana&&(ne=!0)}Q+=`<option value="${v.id}" data-inicio="${H}" data-fin="${L}" data-dia="${v.diaSemana}" data-materia="${v.materia}" ${ne?"selected":""}>
            ${D}: ${H} - ${L} (${v.materia}${v.aula?" · "+v.aula:""})
          </option>`}),t){const v=n(t.fechaInicio).split("T")[1],H=n(t.fechaFin).split("T")[1];if(!I.some(D=>D.horaInicio.slice(0,5)===v&&D.horaFin.slice(0,5)===H&&D.diaSemana===t.diaSemana)){const D=C[t.diaSemana]||t.diaSemana||"";Q=`<option value="original" data-inicio="${v}" data-fin="${H}" data-dia="${t.diaSemana}" selected>
              [Horario Original] ${D?D+": ":""}${v} - ${H}
            </option>`+Q}}w.innerHTML=Q,u(!0)}catch(T){w.innerHTML='<option value="">Error al cargar horarios</option>',console.error(T)}}};at("ev-profesor-search","ev-profesor-dropdown","ev-profesorId","ev-nombreProfesor",async R=>{if(R)await m(R);else{const w=document.getElementById("ev-horario-select");w&&(w.innerHTML='<option value="">Seleccione un profesor primero...</option>'),u(!0)}}),(f=document.getElementById("ev-recurrente"))==null||f.addEventListener("change",R=>{document.getElementById("dia-semana-group").style.display=R.target.checked?"":"none"}),(E=document.getElementById("ev-fecha"))==null||E.addEventListener("change",()=>u(!0)),(re=document.getElementById("ev-horario-select"))==null||re.addEventListener("change",()=>u(!1));const g=(F=document.getElementById("ev-profesorId"))==null?void 0:F.value;g&&m(g)},50)}function tt(e,t){var l,d;const o=!!t,a=o?"Editar Horario Semanal":"Nuevo Horario Semanal",i=b.hasRole("PROFESOR"),r=(t==null?void 0:t.profesorId)??(i?b.id():""),s=(t==null?void 0:t.nombreProfesor)??(i?b.nombre():""),n=`
    <div class="form-grid-2">
      <div class="form-group" style="grid-column:1/-1">
        <label>Profesor *</label>
        <div class="profesor-search-wrap" id="h-profesor-wrap">
          <div class="profesor-search-input-row">
            <i class="fas fa-search profesor-search-icon"></i>
            <input id="h-profesor-search" class="form-input profesor-search-input"
              placeholder="Escribe el nombre del profesor…"
              value="${s}" autocomplete="off" ${i?"disabled":""}/>
          </div>
          <div class="profesor-search-dropdown" id="h-profesor-dropdown"></div>
          <input type="hidden" id="h-profesorId" value="${r}"/>
          <input type="hidden" id="h-nombreProfesor" value="${s}"/>
        </div>
      </div>
      <div class="form-group">
        <label>Día de la semana *</label>
        <select id="h-dia" class="form-select">
          ${Ze.map(c=>`<option value="${c}" ${(t==null?void 0:t.diaSemana)===c?"selected":""}>${c.charAt(0)+c.slice(1).toLowerCase()}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Materia *</label>
        <input id="h-materia" class="form-input" value="${(t==null?void 0:t.materia)??""}" placeholder="Ej: Matemáticas"/>
      </div>
      <div class="form-group">
        <label>Hora inicio *</label>
        <input id="h-inicio" type="time" class="form-input" value="${((l=t==null?void 0:t.horaInicio)==null?void 0:l.slice(0,5))??""}"/>
      </div>
      <div class="form-group">
        <label>Hora fin *</label>
        <input id="h-fin" type="time" class="form-input" value="${((d=t==null?void 0:t.horaFin)==null?void 0:d.slice(0,5))??""}"/>
      </div>
      <div class="form-group">
        <label>Aula</label>
        <input id="h-aula" class="form-input" value="${(t==null?void 0:t.aula)??""}" placeholder="Ej: Aula 201"/>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="h-activo" ${t===null||t!=null&&t.activo?"checked":""}/>
          Horario activo
        </label>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Observaciones</label>
        <textarea id="h-obs" class="form-input" rows="2" placeholder="Observaciones opcionales…">${(t==null?void 0:t.observaciones)??""}</textarea>
      </div>
    </div>`;P({title:a,bodyHTML:n,onConfirm:async(c,u)=>{const m={profesorId:Number(document.getElementById("h-profesorId").value),nombreProfesor:document.getElementById("h-nombreProfesor").value.trim(),diaSemana:document.getElementById("h-dia").value,horaInicio:document.getElementById("h-inicio").value,horaFin:document.getElementById("h-fin").value,materia:document.getElementById("h-materia").value.trim(),aula:document.getElementById("h-aula").value.trim()||null,activo:document.getElementById("h-activo").checked,observaciones:document.getElementById("h-obs").value.trim()||null};if(!m.profesorId||!m.nombreProfesor||!m.horaInicio||!m.horaFin||!m.materia){p("Completa los campos obligatorios (*)","error");return}try{o?(await M.actualizarHorario(t.id,m),p("Horario actualizado correctamente","success")):(await M.crearHorario(m),p("Horario creado correctamente","success"));const g=b.hasRole("PROFESOR")?b.id():null;await ie(g),Y(e),u()}catch(g){p(`Error: ${g.message}`,"error")}}}),setTimeout(()=>{var c,u;if(at("h-profesor-search","h-profesor-dropdown","h-profesorId","h-nombreProfesor",m=>{var g,f;if(m){const E=((g=K.find(F=>F.profesorId==m&&F.materia))==null?void 0:g.materia)||((f=B.find(F=>F.profesorId==m&&F.especialidad))==null?void 0:f.especialidad)||"",re=document.getElementById("h-materia");re&&E&&(re.value=E)}}),i&&!t){const m=((c=K.find(f=>f.profesorId==b.id()&&f.materia))==null?void 0:c.materia)||((u=B.find(f=>f.profesorId==b.id()&&f.especialidad))==null?void 0:u.especialidad)||"",g=document.getElementById("h-materia");g&&m&&(g.value=m)}},50)}async function at(e,t,o,a,i){const r=document.getElementById(e),s=document.getElementById(t),n=document.getElementById(o),l=document.getElementById(a);if(!r||!s||b.hasRole("PROFESOR"))return;let d=[];try{d=(await oe.listar()||[]).filter(m=>m.rol==="PROFESOR")}catch{}function c(u){const m=u.trim().toLowerCase(),g=m?d.filter(f=>{var E;return(E=f.nombre)==null?void 0:E.toLowerCase().includes(m)}):d;if(!g.length){s.innerHTML='<div class="profesor-no-result"><i class="fas fa-user-slash"></i> Sin resultados</div>',s.classList.add("open");return}s.innerHTML=g.map(f=>`
      <div class="profesor-option" data-id="${f.id}" data-nombre="${f.nombre}">
        <span class="profesor-option-avatar">${f.nombre.charAt(0).toUpperCase()}</span>
        <div class="profesor-option-info">
          <span class="profesor-option-name">${f.nombre}</span>
          <span class="profesor-option-role">ID: ${f.id} · Profesor</span>
        </div>
      </div>`).join(""),s.classList.add("open"),s.querySelectorAll(".profesor-option").forEach(f=>{f.addEventListener("mousedown",E=>{E.preventDefault(),n.value=f.dataset.id,l.value=f.dataset.nombre,r.value=f.dataset.nombre,r.classList.add("profesor-selected"),s.classList.remove("open"),s.innerHTML="",typeof i=="function"&&i(f.dataset.id)})})}r.addEventListener("input",()=>{n.value="",l.value="",r.classList.remove("profesor-selected"),c(r.value),typeof i=="function"&&i(null)}),r.addEventListener("focus",()=>{c(r.value)}),r.addEventListener("blur",()=>{setTimeout(()=>{if(s.classList.remove("open"),s.innerHTML="",!n.value&&r.value.trim()){const u=d.find(m=>m.nombre.toLowerCase()===r.value.trim().toLowerCase());u&&(n.value=u.id,l.value=u.nombre,r.classList.add("profesor-selected"),typeof i=="function"&&i(u.id))}},200)})}function st(e,t,o){P({title:o==="evento"?"Eliminar Evento":"Eliminar Horario",bodyHTML:`<p style="color:var(--text2);line-height:1.6">
    ¿Estás seguro que deseas eliminar este ${o==="evento"?"evento de agenda":"bloque de horario"}?
    <strong>Esta acción no se puede deshacer.</strong>
  </p>`,onConfirm:async(r,s)=>{try{o==="evento"?(await M.eliminar(t),p("Evento eliminado","success")):(await M.eliminarHorario(t),p("Horario eliminado","success"));const n=b.hasRole("PROFESOR")?b.id():null;await ie(n),_(e),se(e),Y(e),$&&J(e,$),s()}catch(n){p(`Error: ${n.message}`,"error")}}})}const Ft={listar:()=>h.get("/auditoria")};let ce=[];const jt={ADMINISTRADOR:"badge-red",PORTERO:"badge-blue",SECRETARIA:"badge-green",DIRECTOR:"badge-yellow",PROFESOR:"badge-purple",SISTEMA:"badge-gray"},Ut=e=>`<span class="badge ${jt[e]??"badge-gray"}">${e}</span>`;function zt(e){return e?new Date(e).toLocaleString("es-PE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}):""}async function _t(e){e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Auditoría del Sistema</h1>
        <div class="sub">Log de transacciones críticas del colegio</div>
      </div>
    </div>
    <div class="page-body">
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title"><span class="title-icon"></span> Historial de Transacciones</div>
          <div class="table-controls" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            
            <div class="search-box">
              <span class="search-icon"></span>
              <input id="aud-search" placeholder="Buscar por usuario, acción o detalles…" style="width:260px" />
            </div>

            <select id="aud-filter-rol" class="form-control" style="width:160px;margin-bottom:0;padding:6px 12px;height:38px">
              <option value="">Todos los Roles</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="PORTERO">PORTERO</option>
              <option value="SECRETARIA">SECRETARIA</option>
              <option value="DIRECTOR">DIRECTOR</option>
              <option value="PROFESOR">PROFESOR</option>
              <option value="SISTEMA">SISTEMA</option>
            </select>

            <span id="aud-total" class="badge badge-blue">—</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="width:180px">Fecha / Hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción</th>
                <th>Detalles de la Transacción</th>
              </tr>
            </thead>
            <tbody id="aud-tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="aud-footer-lbl">—</span></div>
      </div>
    </div>`,await Qt(e);const t=e.querySelector("#aud-search"),o=e.querySelector("#aud-filter-rol"),a=()=>{const i=t.value.toLowerCase().trim(),r=o.value;let s=ce;r&&(s=s.filter(n=>n.rol===r)),i&&(s=s.filter(n=>{var l,d,c;return((l=n.usuario)==null?void 0:l.toLowerCase().includes(i))||((d=n.accion)==null?void 0:d.toLowerCase().includes(i))||((c=n.detalles)==null?void 0:c.toLowerCase().includes(i))})),ot(e,s)};t.addEventListener("input",a),o.addEventListener("change",a)}async function Qt(e){try{ce=await Ft.listar(),e.querySelector("#aud-total").textContent=`${ce.length}`,e.querySelector("#aud-footer-lbl").textContent=`${ce.length} transacciones registradas`,ot(e,ce)}catch(t){p(t.message,"error")}}function ot(e,t){const o=e.querySelector("#aud-tbody");if(!t.length){o.innerHTML='<tr class="empty-row"><td colspan="5">Sin transacciones registradas que coincidan</td></tr>';return}o.innerHTML=t.map(a=>`
    <tr>
      <td class="td-muted">${zt(a.fecha)}</td>
      <td><strong>${a.usuario}</strong></td>
      <td>${Ut(a.rol)}</td>
      <td><span class="badge badge-yellow" style="font-family:monospace">${a.accion}</span></td>
      <td style="color:var(--text2);font-size:0.92rem;max-width:400px;word-break:break-word">${a.detalles??""}</td>
    </tr>`).join("")}const de=document.getElementById("app"),Gt={"#/login":{page:ut,auth:!1},"#/dashboard":{page:bt,auth:!0},"#/visitas":{page:yt,auth:!0},"#/visitantes":{page:Et,auth:!0},"#/alumnos":{page:St,auth:!0},"#/usuarios":{page:It,auth:!0,roles:["ADMINISTRADOR"]},"#/auditoria":{page:_t,auth:!0,roles:["ADMINISTRADOR"]},"#/asistencia":{page:Ot,auth:!0},"#/agenda":{page:Ht,auth:!0}};async function it(){const e=window.location.hash||"#/dashboard",t=Gt[e];if(!t){window.location.hash="#/dashboard";return}if(!t.auth){if(b.isLogged()){window.location.hash="#/dashboard";return}de.innerHTML="",t.page(de);return}if(!b.isLogged()){window.location.hash="#/login";return}if(t.roles&&!t.roles.includes(b.rol())){window.location.hash="#/dashboard";return}de.innerHTML=`
    <div class="app-container">
      <div id="sidebar-wrap"></div>
      <div class="main-content" id="page-root"></div>
    </div>`,lt(de.querySelector("#sidebar-wrap"));const o=de.querySelector("#page-root");try{await t.page(o)}catch(a){o.innerHTML=`
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;height:60vh;gap:10px;color:var(--text2)">
        <span style="font-size:2.5rem">⚠️</span>
        <p style="font-weight:600">Error al cargar la página</p>
        <small>${a.message}</small>
      </div>`}}window.addEventListener("hashchange",it);window.addEventListener("load",()=>{window.location.hash||(window.location.hash="#/dashboard"),it()});
