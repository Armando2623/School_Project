(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const Oe="sg_session",m={save(e){sessionStorage.setItem(Oe,JSON.stringify(e))},get(){try{return JSON.parse(sessionStorage.getItem(Oe))}catch{return null}},clear(){sessionStorage.removeItem(Oe)},token(){var e;return((e=this.get())==null?void 0:e.token)??null},usuario(){var e;return((e=this.get())==null?void 0:e.usuario)??null},nombre(){var e;return((e=this.get())==null?void 0:e.nombre)??null},rol(){var e;return((e=this.get())==null?void 0:e.rol)??null},id(){var e;return((e=this.get())==null?void 0:e.id)??null},isLogged(){return!!this.token()},hasRole(...e){return e.includes(this.rol())}},ht=[{section:"PRINCIPAL",items:[{icon:"fas fa-chart-line",label:"Dashboard",hash:"#/dashboard",roles:null},{icon:"fas fa-clipboard-list",label:"Visitas",hash:"#/visitas",roles:["ADMINISTRADOR","PORTERO","SECRETARIA","DIRECTOR","PROFESOR"]}]},{section:"GESTIÓN",items:[{icon:"fas fa-users",label:"Visitantes",hash:"#/visitantes",roles:["ADMINISTRADOR","SECRETARIA"]},{icon:"fas fa-user-graduate",label:"Alumnos",hash:"#/alumnos",roles:["ADMINISTRADOR","SECRETARIA","PROFESOR"]},{icon:"fas fa-check-square",label:"Asistencia",hash:"#/asistencia",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-calendar-alt",label:"Agenda",hash:"#/agenda",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-boxes",label:"Inventario",hash:"#/inventario",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-user-cog",label:"Usuarios",hash:"#/usuarios",roles:["ADMINISTRADOR"]},{icon:"fas fa-history",label:"Auditoría",hash:"#/auditoria",roles:["ADMINISTRADOR"]}]}],yt={ADMINISTRADOR:"Administrador",PORTERO:"Portero",SECRETARIA:"Secretaria",DIRECTOR:"Director",PROFESOR:"Profesor"};function Et(e){const t=m.rol(),r=window.location.hash||"#/dashboard",a=ht.map(s=>{const i=s.items.filter(o=>!o.roles||o.roles.includes(t));return i.length?`
      <div class="nav-section-title">${s.section}</div>
      <ul class="nav-list">
        ${i.map(o=>`
          <li>
            <a class="nav-link ${r===o.hash?"active":""}"
               href="${o.hash}" data-hash="${o.hash}">
              <span class="nav-icon"><i class="${o.icon}"></i></span>
              <span>${o.label}</span>
            </a>
          </li>`).join("")}
      </ul>`:""}).join("");if(!document.getElementById("sidebar-toggle")){const s=document.createElement("button");s.id="sidebar-toggle",s.className="sidebar-toggle",s.setAttribute("aria-label","Abrir menú"),s.innerHTML='<i class="fas fa-bars"></i>',document.body.prepend(s);const i=document.createElement("div");i.id="sidebar-overlay",i.className="sidebar-overlay",document.body.prepend(i);const o=()=>{var n;(n=document.querySelector(".sidebar"))==null||n.classList.add("open"),i.classList.add("active"),s.innerHTML='<i class="fas fa-times"></i>'},l=()=>{var n;(n=document.querySelector(".sidebar"))==null||n.classList.remove("open"),i.classList.remove("active"),s.innerHTML='<i class="fas fa-bars"></i>'};s.addEventListener("click",()=>{var d;((d=document.querySelector(".sidebar"))==null?void 0:d.classList.contains("open"))?l():o()}),i.addEventListener("click",l),window.addEventListener("hashchange",()=>{window.innerWidth<=768&&l()})}e.innerHTML=`
    <aside class="sidebar">
      <div class="sidebar-brand">
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
            <div class="u-name">${m.nombre()??m.usuario()}</div>
            <div class="u-role">${yt[t]??t}</div>
          </div>
        </div>
        <button class="btn-logout" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </aside>`,e.querySelector("#logout-btn").addEventListener("click",()=>{m.clear(),window.location.hash="#/login"})}const Me="https://school-project-1mso.onrender.com",Ne="https://school-project-assitencia-service.onrender.com",St="https://school-project-agendaservice.onrender.com",ue=`${Me}/api`,Be=`${Ne}/api`,ye=`${St}/api`;async function H(e,t,r={}){const a=m.token(),s={"Content-Type":"application/json",...r.headers};a&&(s.Authorization=`Bearer ${a}`);const i=await fetch(`${e}${t}`,{...r,headers:s});if(i.status===401)throw m.clear(),window.location.hash="#/login",new Error("Sesión expirada");if(i.status===204)return null;if(!i.ok){const o=await i.json().catch(()=>({error:`Error ${i.status}`}));throw new Error(o.error||o.message||`Error ${i.status}`)}return i.json()}const g={get:e=>H(ue,e),post:(e,t)=>H(ue,e,{method:"POST",body:JSON.stringify(t)}),put:(e,t)=>H(ue,e,{method:"PUT",body:JSON.stringify(t)}),delete:e=>H(ue,e,{method:"DELETE"}),fetchBlob:async e=>{const t=m.token(),r={};t&&(r.Authorization=`Bearer ${t}`);const a=await fetch(`${ue}${e}`,{headers:r});if(!a.ok)throw new Error(`Error ${a.status}`);return a.blob()}},O={get:e=>H(Be,e),post:(e,t)=>H(Be,e,{method:"POST",body:JSON.stringify(t)})},S={get:e=>H(ye,e),post:(e,t)=>H(ye,e,{method:"POST",body:JSON.stringify(t)}),put:(e,t)=>H(ye,e,{method:"PUT",body:JSON.stringify(t)}),delete:e=>H(ye,e,{method:"DELETE"})},$t=Object.freeze(Object.defineProperty({__proto__:null,AST_URL:Ne,MVC_URL:Me,agendaApi:S,api:g,astApi:O},Symbol.toStringTag,{value:"Module"})),At={login:(e,t)=>g.post("/auth/login",{usuario:e,contraseña:t})};function u(e,t="info",r=3500){const a=document.getElementById("toast-container"),s=document.createElement("div"),i={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"};s.className=`toast toast-${t}`,s.innerHTML=`<span>${i[t]??"ℹ️"}</span><span>${e}</span>`,a.appendChild(s),setTimeout(()=>{s.classList.add("leaving"),setTimeout(()=>s.remove(),310)},r)}function Rt(e){e.innerHTML=`
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
    </div>`;const t=e.querySelector("#login-form"),r=e.querySelector("#login-btn"),a=e.querySelector("#eye-btn"),s=e.querySelector("#l-pass"),i=e.querySelector("#login-error"),o=e.querySelector("#error-msg");a.addEventListener("click",()=>{const l=s.type==="password";s.type=l?"text":"password",a.innerHTML=l?'<i class="fas fa-eye-slash"></i>':'<i class="fas fa-eye"></i>'}),t.addEventListener("submit",async l=>{l.preventDefault(),i.classList.remove("show");const n=e.querySelector("#l-user").value.trim(),d=s.value;if(!n||!d){o.textContent="Completa todos los campos",i.classList.add("show");return}r.disabled=!0,r.textContent="Ingresando…";try{const c=await At.login(n,d);m.save(c),window.location.hash="#/dashboard"}catch(c){o.textContent=c.message||"Credenciales inválidas",i.classList.add("show"),u(o.textContent,"error")}finally{r.disabled=!1,r.innerHTML='<i class="fas fa-sign-in-alt"></i> Iniciar Sesión'}})}const te={listar:()=>g.get("/visitas"),registrar:e=>g.post("/visitas",e),actualizar:(e,t)=>g.put(`/visitas/${e}`,t),buscarPorDni:e=>g.get(`/visitas/visitante?dni=${encodeURIComponent(e)}`),buscarUsuarios:e=>g.get(`/visitas/usuarios?search=${encodeURIComponent(e)}`)},ge={listar:()=>g.get("/alumnos"),registrar:e=>g.post("/alumnos",e),actualizar:(e,t)=>g.put(`/alumnos/${e}`,t),obtener:e=>g.get(`/alumnos/${e}`),obtenerQrBlob:e=>g.fetchBlob(`/alumnos/${e}/qr`)},xe={listar:()=>O.get("/asistencia"),registrar:e=>O.post("/asistencia",e),porPersonal:e=>O.get(`/asistencia/personal/${e}`),porFecha:e=>O.get(`/asistencia/fecha?fecha=${e}`),porPersonalYFecha:(e,t)=>O.get(`/asistencia/personal/${e}/fecha?fecha=${t}`)},wt=()=>new Date().toLocaleDateString("es-PE",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),Ve=()=>new Date().toISOString().split("T")[0],It={REGISTRADO:"badge-blue",EN_CURSO:"badge-yellow",COMPLETADO:"badge-green"};async function xt(e){e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>I.E.P. — SchoolGuard</h1>
        <div class="sub">Sistema de Registro de Visitas</div>
      </div>
      <div class="date-pill"><i class="fa-thin fa-calendar-clock"></i> ${wt()}</div>
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

    </div>`;const t=m.token(),r=t?{Authorization:`Bearer ${t}`}:{},a=async(s,i,o={})=>{const l=e.querySelector(`#${i}`);try{const n=await fetch(s,{signal:AbortSignal.timeout(3e3),headers:o});l.classList.add(n.status<500?"online":"offline")}catch{l.classList.add("offline")}};a(`${Me}/api/alumnos`,"dot-mvc",r),a(`${Ne}/api/asistencia`,"dot-ast",r);try{const[s,i]=await Promise.all([te.listar(),ge.listar()]),o=s.filter(c=>{var p;return(p=c.horaIngreso)==null?void 0:p.startsWith(Ve())}),l=s.filter(c=>c.estadoRegistro==="EN_CURSO");e.querySelector("#s-activos").textContent=l.length,e.querySelector("#s-hoy").textContent=o.length,e.querySelector("#s-alumnos").textContent=i.length,e.querySelector("#footer-count").textContent=`${o.length} hoy`;const n=e.querySelector("#recent-tbody"),d=[...s].reverse().slice(0,5);d.length?n.innerHTML=d.map(c=>`
        <tr>
          <td><strong>${c.nombreVisitante}</strong></td>
          <td class="td-muted">${c.dniVisitante}</td>
          <td>${c.motivo}</td>
          <td class="td-small">${c.horaIngreso?new Date(c.horaIngreso).toLocaleString("es-PE"):"—"}</td>
          <td><span class="badge ${It[c.estadoRegistro]??"badge-gray"}">${c.estadoRegistro??"—"}</span></td>
        </tr>`).join(""):n.innerHTML='<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text3)">No hay registros</td></tr>'}catch{}try{const s=await xe.porFecha(Ve());e.querySelector("#s-asist").textContent=s.length}catch{e.querySelector("#s-asist").textContent="—"}}function L({title:e,bodyHTML:t,onConfirm:r,confirmText:a="Guardar",danger:s=!1,hideCancelBtn:i=!1,onOpen:o=null,onClose:l=null}){var c;const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <h2>${e}</h2>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">${t}</div>
      <div class="modal-footer">
        ${i?"":'<button class="btn btn-outline" id="modal-cancel-btn">Cancelar</button>'}
        <button class="btn ${s?"btn-danger":"btn-primary"}" id="modal-confirm-btn">${a}</button>
      </div>
    </div>`,n.classList.add("active"),document.body.appendChild(n);const d=()=>{l&&l(),n.remove()};return n.querySelector("#modal-close-btn").addEventListener("click",d),(c=n.querySelector("#modal-cancel-btn"))==null||c.addEventListener("click",d),n.querySelector("#modal-confirm-btn").addEventListener("click",()=>{r?r(n,d):d()}),n.addEventListener("click",p=>{p.target===n&&d()}),o&&setTimeout(()=>o(n),0),n}const Lt=["REGISTRADO","EN_CURSO","COMPLETADO"],Tt={REGISTRADO:"badge-blue",EN_CURSO:"badge-yellow",COMPLETADO:"badge-green"},Ot=e=>`<span class="badge ${Tt[e]??"badge-gray"}">${e??"—"}</span>`,Dt=e=>e?new Date(e).toLocaleString("es-PE"):"—",Se=()=>m.hasRole("ADMINISTRADOR","PORTERO","SECRETARIA");let me=[];async function qt(e){var t,r;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Registro de Visitas</h1>
        <div class="sub">Control de ingreso de visitantes</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${Se()?'<button class="btn btn-primary" id="btn-new">+ Nueva Visita</button>':""}
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
              ${Se()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-count">—</span></div>
      </div>
    </div>`,await ze(e),(t=e.querySelector("#search"))==null||t.addEventListener("input",a=>{const s=a.target.value.toLowerCase();_e(e,me.filter(i=>{var o,l,n;return((o=i.nombreVisitante)==null?void 0:o.toLowerCase().includes(s))||((l=i.dniVisitante)==null?void 0:l.toLowerCase().includes(s))||((n=i.motivo)==null?void 0:n.toLowerCase().includes(s))}))}),(r=e.querySelector("#btn-new"))==null||r.addEventListener("click",()=>Ge(e))}async function ze(e){try{me=await te.listar(),e.querySelector("#footer-count").textContent=`${me.length} registros`,_e(e,me)}catch(t){u(t.message,"error")}}function _e(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="7">No hay registros</td></tr>';return}r.innerHTML=t.map(a=>{var s;return`
    <tr>
      <td><strong>${a.nombreVisitante}</strong></td>
      <td class="td-muted">${a.dniVisitante}</td>
      <td>${a.motivo}</td>
      <td>${((s=a.usuario)==null?void 0:s.nombre)??"—"}</td>
      <td class="td-small">${Dt(a.horaIngreso)}</td>
      <td>${Ot(a.estadoRegistro)}</td>
      ${Se()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),Se()&&r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>{Ge(e,me.find(s=>s.id==a.dataset.id))}))}async function Ge(e,t=null){const r=!!t;let a=[];try{a=await te.buscarUsuarios("")}catch{}const s=new Date().toISOString().slice(0,16);L({title:r?"✏️ Editar Visita":"+ Nueva Visita",bodyHTML:`
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
            ${a.map(i=>{var o;return`<option value="${i.id}" ${((o=t==null?void 0:t.usuario)==null?void 0:o.id)===i.id?"selected":""}>${i.nombre} (${i.usuario})</option>`}).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" id="m-estado">
            ${Lt.map(i=>`<option value="${i}" ${((t==null?void 0:t.estadoRegistro)??"REGISTRADO")===i?"selected":""}>${i}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Hora Ingreso</label>
          <input class="form-control" type="datetime-local" id="m-hora"
            value="${t!=null&&t.horaIngreso?new Date(t.horaIngreso).toISOString().slice(0,16):s}" />
        </div>
      </div>`,confirmText:r?"Actualizar":"Registrar",onConfirm:async(i,o)=>{const l=i.querySelector("#m-dni").value.trim(),n=i.querySelector("#m-nombre").value.trim(),d=i.querySelector("#m-motivo").value.trim(),c=i.querySelector("#m-usuario").value,p=i.querySelector("#m-estado").value,b=i.querySelector("#m-hora").value;if(!l||!n||!d||!c){u("Completa los campos obligatorios","warning");return}const h={dniVisitante:l,nombreVisitante:n,motivo:d,usuario_id:Number(c),estadoRegistro:p,horaIngreso:b?new Date(b).toISOString():null};try{r?await te.actualizar(t.id,h):await te.registrar(h),u(r?"Visita actualizada":"Visita registrada","success"),o(),await ze(e)}catch(v){u(v.message,"error")}}}),setTimeout(()=>{var i;(i=document.querySelector("#btn-dni"))==null||i.addEventListener("click",async()=>{var l;const o=(l=document.querySelector("#m-dni"))==null?void 0:l.value.trim();if(o)try{const n=await te.buscarPorDni(o);n?(document.querySelector("#m-nombre").value=n.nombreVisitante??"",u("Datos autocompletados","info")):u("DNI no encontrado","warning")}catch{u("DNI no encontrado","warning")}})},100)}const $e={listar:()=>g.get("/visitantes"),registrar:e=>g.post("/visitantes",e),actualizar:(e,t)=>g.put(`/visitantes/${e}`,t),buscarPorDni:e=>g.get(`/visitantes/buscar?dni=${encodeURIComponent(e)}`)},Ae=()=>m.hasRole("ADMINISTRADOR","SECRETARIA");let ae=[];async function Ct(e){var t;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Visitantes</h1>
        <div class="sub">Personas externas registradas en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${Ae()?'<button class="btn btn-primary" id="btn-new">+ Nuevo Visitante</button>':""}
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
              ${Ae()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`,await Qe(e),e.querySelector("#search").addEventListener("input",r=>{const a=r.target.value.toLowerCase();Je(e,ae.filter(s=>{var i,o;return((i=s.dniVisitante)==null?void 0:i.toLowerCase().includes(a))||((o=s.nombreVisitante)==null?void 0:o.toLowerCase().includes(a))}))}),(t=e.querySelector("#btn-new"))==null||t.addEventListener("click",()=>Xe(e))}async function Qe(e){try{ae=await $e.listar(),e.querySelector("#total").textContent=`${ae.length}`,e.querySelector("#footer-lbl").textContent=`${ae.length} visitantes registrados`,Je(e,ae)}catch(t){u(t.message,"error")}}function Je(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="6">Sin visitantes registrados</td></tr>';return}r.innerHTML=t.map(a=>{var s;return`
    <tr>
      <td class="td-muted" style="font-family:monospace">${a.dniVisitante}</td>
      <td><strong>${a.nombreVisitante}</strong></td>
      <td class="td-muted">${a.telefono??"—"}</td>
      <td class="td-muted">${a.email??"—"}</td>
      <td><span class="badge badge-purple">${((s=a.hijos)==null?void 0:s.length)??0} hijos</span></td>
      ${Ae()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),Ae()&&r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>Xe(e,ae.find(s=>s.id==a.dataset.id))))}function Xe(e,t=null){L({title:t?"✏️ Editar Visitante":"+ Nuevo Visitante",bodyHTML:`
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
      </div>`,confirmText:t?"Actualizar":"Registrar",onConfirm:async(r,a)=>{const s={dniVisitante:r.querySelector("#m-dni").value.trim(),nombreVisitante:r.querySelector("#m-nombre").value.trim(),telefono:r.querySelector("#m-tel").value.trim()||null,email:r.querySelector("#m-email").value.trim()||null};if(!s.dniVisitante||!s.nombreVisitante){u("DNI y nombre son obligatorios","warning");return}try{t?await $e.actualizar(t.id,s):await $e.registrar(s),u(t?"Visitante actualizado":"Visitante registrado","success"),a(),await Qe(e)}catch(i){u(i.message,"error")}}})}const Re=()=>m.hasRole("ADMINISTRADOR","SECRETARIA");let se=[],Ye=[];async function Mt(e){var t;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Alumnos</h1>
        <div class="sub">Estudiantes registrados en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${Re()?'<button class="btn btn-primary" id="btn-new">+ Nuevo Alumno</button>':""}
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
              ${Re()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`,await We(e),e.querySelector("#search").addEventListener("input",r=>{const a=r.target.value.toLowerCase();Ke(e,se.filter(s=>{var i,o,l;return((i=s.nombre)==null?void 0:i.toLowerCase().includes(a))||((o=s.grado)==null?void 0:o.toLowerCase().includes(a))||((l=s.seccion)==null?void 0:l.toLowerCase().includes(a))}))}),(t=e.querySelector("#btn-new"))==null||t.addEventListener("click",()=>Ze(e))}async function We(e){try{[se,Ye]=await Promise.all([ge.listar(),$e.listar()]),e.querySelector("#total").textContent=`${se.length}`,e.querySelector("#footer-lbl").textContent=`${se.length} alumnos registrados`,Ke(e,se)}catch(t){u(t.message,"error")}}function Ke(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="6">Sin alumnos registrados</td></tr>';return}r.innerHTML=t.map(a=>{var o,l;const i=!!((o=a.apoderado)!=null&&o.email)?`<span class="badge badge-green" title="El apoderado ${a.apoderado.nombreVisitante} recibirá notificaciones en ${a.apoderado.email}" style="cursor:default">📧 Email</span>`:'<span class="td-muted" title="El apoderado no tiene email registrado">—</span>';return`
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td><span class="badge badge-blue">${a.grado}</span></td>
      <td><span class="badge badge-gray">${a.seccion}</span></td>
      <td class="td-muted">${((l=a.apoderado)==null?void 0:l.nombreVisitante)??"—"}</td>
      <td>${i}</td>
      <td>
        ${a.codigoQr?`<button class="btn btn-outline btn-sm qr-btn" data-id="${a.id}" data-nombre="${a.nombre}" title="Ver código QR">
               📱 Ver QR
             </button>`:'<span class="td-muted">Sin QR</span>'}
      </td>
      ${Re()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),Re()&&r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>Ze(e,se.find(s=>s.id==a.dataset.id)))),r.querySelectorAll(".qr-btn").forEach(a=>a.addEventListener("click",()=>Nt(a.dataset.id,a.dataset.nombre)))}async function Nt(e,t){let r=null;L({title:`📱 Código QR — ${t}`,bodyHTML:`
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
        <div id="qr-loading" style="color:var(--text2);font-size:13px">Cargando QR…</div>
        <img id="qr-img" style="display:none;border-radius:12px;border:3px solid var(--border);
          box-shadow:0 4px 24px rgba(0,0,0,0.15);width:220px;height:220px;object-fit:contain" />
        <p style="font-size:12px;color:var(--text3);text-align:center;max-width:240px">
          Muestra este código en la entrada para registrar la asistencia del alumno.
        </p>
        <button class="btn btn-outline btn-sm" id="btn-download-qr">⬇ Descargar QR</button>
      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:async a=>{try{const s=await ge.obtenerQrBlob(e);r=URL.createObjectURL(s);const i=a.querySelector("#qr-img");i.src=r,i.style.display="block",a.querySelector("#qr-loading").style.display="none",a.querySelector("#btn-download-qr").addEventListener("click",()=>{const o=document.createElement("a");o.href=r,o.download=`qr-alumno-${t.replace(/\s+/g,"-")}.png`,o.click()})}catch{a.querySelector("#qr-loading").textContent="Error al cargar el QR",u("No se pudo cargar el código QR","error")}},onClose:()=>{r&&URL.revokeObjectURL(r)}})}function Ze(e,t=null){const r=Ye.map(a=>{var s;return`<option value="${a.id}" ${((s=t==null?void 0:t.apoderado)==null?void 0:s.id)===a.id?"selected":""}>${a.nombreVisitante} (${a.dniVisitante})</option>`}).join("");L({title:t?"✏️ Editar Alumno":"+ Nuevo Alumno",bodyHTML:`
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
            ${r}
          </select>
        </div>
      </div>`,confirmText:t?"Actualizar":"Registrar",onConfirm:async(a,s)=>{const i={nombre:a.querySelector("#m-nombre").value.trim(),grado:a.querySelector("#m-grado").value.trim(),seccion:a.querySelector("#m-seccion").value.trim(),visitanteId:a.querySelector("#m-apoderado").value||null};if(!i.nombre||!i.grado||!i.seccion){u("Nombre, grado y sección son obligatorios","warning");return}i.visitanteId&&(i.visitanteId=Number(i.visitanteId));try{t?await ge.actualizar(t.id,i):await ge.registrar(i),u(t?"Alumno actualizado":"Alumno registrado — QR generado automáticamente","success"),s(),await We(e)}catch(o){u(o.message,"error")}}})}const re={listar:()=>g.get("/usuarios"),registrar:e=>g.post("/usuarios",e),actualizar:(e,t)=>g.put(`/usuarios/${e}`,t),eliminar:e=>g.delete(`/usuarios/${e}`)},Pt=["ADMINISTRADOR","PORTERO","SECRETARIA","DIRECTOR","PROFESOR"],kt={ADMINISTRADOR:"badge-red",PORTERO:"badge-blue",SECRETARIA:"badge-green",DIRECTOR:"badge-yellow",PROFESOR:"badge-purple"},Ht=e=>`<span class="badge ${kt[e]??"badge-gray"}">${e}</span>`;let J=[];async function Bt(e){e.innerHTML=`
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
    </div>`,await Pe(e),e.querySelector("#search").addEventListener("input",t=>{const r=t.target.value.toLowerCase();et(e,J.filter(a=>{var s,i;return((s=a.nombre)==null?void 0:s.toLowerCase().includes(r))||((i=a.usuario)==null?void 0:i.toLowerCase().includes(r))}))}),e.querySelector("#btn-new").addEventListener("click",()=>tt(e))}async function Pe(e){try{J=await re.listar(),e.querySelector("#total").textContent=`${J.length}`,e.querySelector("#footer-lbl").textContent=`${J.length} usuarios`,et(e,J)}catch(t){u(t.message,"error")}}function et(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="4">Sin usuarios registrados</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td class="td-muted" style="font-family:monospace">@${a.usuario}</td>
      <td>${Ht(a.rol)}</td>
      <td style="display:flex;gap:6px;padding:10px 16px">
        <button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button>
        <button class="btn btn-danger  btn-sm del-btn"  data-id="${a.id}">🗑 Eliminar</button>
      </td>
    </tr>`).join(""),r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>tt(e,J.find(s=>s.id==a.dataset.id)))),r.querySelectorAll(".del-btn").forEach(a=>a.addEventListener("click",()=>Vt(e,J.find(s=>s.id==a.dataset.id))))}function tt(e,t=null){const r=Pt.map(a=>`<option value="${a}" ${(t==null?void 0:t.rol)===a?"selected":""}>${a}</option>`).join("");L({title:t?"✏️ Editar Usuario":"+ Nuevo Usuario",bodyHTML:`
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
            ${r}
          </select>
        </div>
      </div>`,confirmText:t?"Actualizar":"Crear Usuario",onConfirm:async(a,s)=>{const i={nombre:a.querySelector("#m-nombre").value.trim(),usuario:a.querySelector("#m-usuario").value.trim(),contraseña:a.querySelector("#m-pass").value,rol:a.querySelector("#m-rol").value};if(!i.nombre||!i.usuario||!i.rol){u("Nombre, usuario y rol son obligatorios","warning");return}if(!t&&!i.contraseña){u("La contraseña es obligatoria","warning");return}try{t?await re.actualizar(t.id,i):await re.registrar(i),u(t?"Usuario actualizado":"Usuario creado","success"),s(),await Pe(e)}catch(o){u(o.message,"error")}}})}function Vt(e,t){L({title:"🗑 Eliminar Usuario",bodyHTML:`<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${t.nombre}</strong> (@${t.usuario})?<br/>Esta acción no se puede deshacer.</p>`,confirmText:"Eliminar",danger:!0,onConfirm:async(r,a)=>{try{await re.eliminar(t.id),u("Usuario eliminado","success"),a(),await Pe(e)}catch(s){u(s.message,"error")}}})}const jt="modulepreload",Ft=function(e){return"/"+e},je={},Fe=function(t,r,a){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(r.map(n=>{if(n=Ft(n),n in je)return;je[n]=!0;const d=n.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${c}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":jt,d||(p.as="script"),p.crossOrigin="",p.href=n,l&&p.setAttribute("nonce",l),document.head.appendChild(p),d)return new Promise((b,h)=>{p.addEventListener("load",b),p.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${n}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return s.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})},ke={registrar:e=>O.post("/asistencia/alumnos",e),listar:()=>O.get("/asistencia/alumnos"),obtenerPorId:e=>O.get(`/asistencia/alumnos/${e}`),porAlumno:e=>O.get(`/asistencia/alumnos/alumno/${e}`),porFecha:e=>O.get(`/asistencia/alumnos/fecha?fecha=${e}`),porAlumnoYFecha:(e,t)=>O.get(`/asistencia/alumnos/alumno/${e}/fecha?fecha=${t}`),porGradoYFecha:(e,t)=>O.get(`/asistencia/alumnos/grado/${encodeURIComponent(e)}/fecha?fecha=${t}`)},oe=()=>new Date().toISOString().split("T")[0],at=e=>e?new Date(e).toLocaleString("es-PE"):"—",st=e=>e==="ENTRADA"?'<span class="badge badge-green">▶ ENTRADA</span>':'<span class="badge badge-red">◀ SALIDA</span>';let U=[],z=[],ot=[],Z="personal";async function Ut(e){var r,a,s,i,o,l;const t=m.hasRole("ADMINISTRADOR","PORTERO","SECRETARIA");e.innerHTML=`
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
                <input type="date" id="filter-fecha" value="${oe()}"
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
            <div class="table-card-title"><span class="title-icon"><i class="fa-solid fa-camera"></i></span> Registrar Asistencia por QR</div>
          </div>
          <div style="padding:16px 20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="btn btn-primary" id="btn-scan-qr">QR del Alumno</button>
            <span style="color:var(--text3);font-size:13px">Enfoca la cámara al código QR del alumno</span>
          </div>
        </div>`:""}

        <div class="table-card">
          <div class="table-card-header">
            <div class="table-card-title"><span class="title-icon"></span> Registros — Alumnos</div>
            <div class="table-controls">
              <div class="search-box">
                <input type="date" id="filter-fecha-alumnos" value="${oe()}"
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

    </div>`,e.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{Z=n.dataset.tab,e.querySelectorAll(".tab-btn").forEach(d=>{d.classList.toggle("active",d.dataset.tab===Z),d.classList.toggle("btn-primary",d.dataset.tab===Z),d.classList.toggle("btn-outline",d.dataset.tab!==Z)}),e.querySelector("#section-personal").style.display=Z==="personal"?"":"none",e.querySelector("#section-alumnos").style.display=Z==="alumnos"?"":"none"})});try{ot=await re.listar()}catch{}await qe(e,oe()),(r=e.querySelector("#btn-filter"))==null||r.addEventListener("click",()=>{const n=e.querySelector("#filter-fecha").value;n&&qe(e,n)}),(a=e.querySelector("#btn-all"))==null||a.addEventListener("click",()=>zt(e)),(s=e.querySelector("#btn-new"))==null||s.addEventListener("click",()=>_t(e)),await Ce(e,oe()),(i=e.querySelector("#btn-filter-alumnos"))==null||i.addEventListener("click",()=>{const n=e.querySelector("#filter-fecha-alumnos").value;n&&Ce(e,n)}),(o=e.querySelector("#btn-all-alumnos"))==null||o.addEventListener("click",()=>Gt(e)),(l=e.querySelector("#btn-scan-qr"))==null||l.addEventListener("click",()=>Qt(e))}async function qe(e,t){try{U=await xe.porFecha(t),e.querySelector("#total-personal").textContent=`${U.length}`,e.querySelector("#footer-personal").textContent=`${U.length} registros`,it(e,U)}catch{u("No se pudo conectar al servicio de asistencia (puerto 8081)","error")}}async function zt(e){try{U=await xe.listar(),e.querySelector("#total-personal").textContent=`${U.length}`,e.querySelector("#footer-personal").textContent=`${U.length} registros totales`,it(e,U)}catch(t){u(t.message,"error")}}function it(e,t){const r=e.querySelector("#tbody-personal");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="5">Sin registros para este filtro</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombrePersonal}</strong></td>
      <td><span class="badge badge-purple">${a.rolPersonal}</span></td>
      <td>${st(a.tipoEvento)}</td>
      <td class="td-small">${at(a.horaEvento)}</td>
      <td class="td-muted">${a.observaciones??"—"}</td>
    </tr>`).join("")}function _t(e){const t=ot.map(a=>`<option value="${a.id}" data-nombre="${a.nombre}" data-rol="${a.rol}">${a.nombre} — ${a.rol}</option>`).join(""),r=new Date().toISOString().slice(0,16);L({title:"+ Registrar Asistencia — Personal",bodyHTML:`
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
          <input class="form-control" type="datetime-local" id="m-hora" value="${r}" />
        </div>
        <div class="form-group" style="grid-column:1/-1">
          <label>Observaciones</label>
          <input class="form-control" id="m-obs" placeholder="Ej: Llegó tarde, justificación médica…" />
        </div>
      </div>`,confirmText:"Registrar",onConfirm:async(a,s)=>{const i=a.querySelector("#m-usuario"),o=i.options[i.selectedIndex],l=i.value;if(!l){u("Selecciona un miembro del personal","warning");return}const n={usuarioId:Number(l),nombrePersonal:o.dataset.nombre,rolPersonal:o.dataset.rol,tipoEvento:a.querySelector("#m-tipo").value,horaEvento:a.querySelector("#m-hora").value?new Date(a.querySelector("#m-hora").value).toISOString():null,observaciones:a.querySelector("#m-obs").value.trim()||null};try{await xe.registrar(n),u("Asistencia registrada","success"),s();const d=e.querySelector("#filter-fecha").value||oe();await qe(e,d)}catch(d){u(d.message,"error")}}})}async function Ce(e,t){try{z=await ke.porFecha(t),e.querySelector("#total-alumnos").textContent=`${z.length}`,e.querySelector("#footer-alumnos").textContent=`${z.length} registros`,rt(e,z)}catch{u("No se pudo cargar asistencia de alumnos","error")}}async function Gt(e){try{z=await ke.listar(),e.querySelector("#total-alumnos").textContent=`${z.length}`,e.querySelector("#footer-alumnos").textContent=`${z.length} registros totales`,rt(e,z)}catch(t){u(t.message,"error")}}function rt(e,t){const r=e.querySelector("#tbody-alumnos");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="6">Sin registros para este filtro</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombreAlumno}</strong></td>
      <td><span class="badge badge-blue">${a.grado??"—"}</span></td>
      <td><span class="badge badge-gray">${a.seccion??"—"}</span></td>
      <td>${st(a.tipoEvento)}</td>
      <td class="td-small">${at(a.horaEvento)}</td>
      <td class="td-muted">${a.observaciones??"—"}</td>
    </tr>`).join("")}function Qt(e){const t="qr-reader-"+Date.now();let r=null,a=!1;L({title:"📷 Escanear QR del Alumno",bodyHTML:`
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
      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:async o=>{try{const{Html5Qrcode:l}=await Fe(async()=>{const{Html5Qrcode:d}=await import("./index-BNMS5zO2.js");return{Html5Qrcode:d}},[]);r=new l(t);const n={fps:10,qrbox:{width:220,height:220}};await r.start({facingMode:"environment"},n,d=>i(o,d),()=>{}),a=!0,o.querySelector("#scan-status").textContent="Esperando QR…"}catch(l){o.querySelector("#scan-status").textContent="No se pudo acceder a la cámara. "+(l.message||""),u("Error al iniciar la cámara","error")}},onClose:async()=>{if(r&&a)try{await r.stop()}catch{}}});let s=null;async function i(o,l){if(l!==s){if(s=l,r&&a)try{await r.pause()}catch{}o.querySelector("#scan-status").textContent="QR detectado — verificando alumno…";try{const{api:n}=await Fe(async()=>{const{api:c}=await Promise.resolve().then(()=>$t);return{api:c}},void 0),d=await n.get(`/alumnos/qr/${l}`);o.querySelector("#scan-result").style.display="block",o.querySelector("#scan-nombre").textContent="🎒 "+d.nombre,o.querySelector("#scan-badges").innerHTML=`
        <span class="badge badge-blue">${d.grado}</span>
        <span class="badge badge-gray">${d.seccion}</span>`,o.querySelector("#scan-actions").style.display="block",o.querySelector("#scan-status").textContent="Selecciona el tipo de evento:",o.querySelector("#btn-entrada-qr").onclick=()=>Ue(o,l,"ENTRADA",e),o.querySelector("#btn-salida-qr").onclick=()=>Ue(o,l,"SALIDA",e)}catch{if(o.querySelector("#scan-status").textContent="❌ QR inválido — alumno no encontrado",u("QR no corresponde a ningún alumno","error"),s=null,r&&a)try{await r.resume()}catch{}}}}}async function Ue(e,t,r,a){var o,l,n;const s=((l=(o=e.querySelector("#scan-obs"))==null?void 0:o.value)==null?void 0:l.trim())||null,i={codigoQr:t,tipoEvento:r,horaEvento:null,registradoPorId:m.id()?Number(m.id()):null,observaciones:s};try{await ke.registrar(i),u(`${r} del alumno registrada correctamente`,"success"),e.remove();const d=((n=a.querySelector("#filter-fecha-alumnos"))==null?void 0:n.value)||oe();await Ce(a,d)}catch(d){u(d.message||"Error al registrar asistencia","error")}}const N={listarTodos:()=>S.get("/agenda"),listarPorProfesor:e=>S.get(`/agenda/profesor/${e}`),listarPorFecha:e=>S.get(`/agenda/fecha?fecha=${e}`),listarPorProfesorFecha:(e,t)=>S.get(`/agenda/profesor/${e}/fecha?fecha=${t}`),listarPorEstado:(e,t)=>S.get(`/agenda/profesor/${e}/estado/${t}`),listarRecurrentes:e=>S.get(`/agenda/recurrentes/${e}`),crear:e=>S.post("/agenda",e),actualizar:(e,t)=>S.put(`/agenda/${e}`,t),eliminar:e=>S.delete(`/agenda/${e}`),listarHorarios:()=>S.get("/horarios"),listarHorariosPorProfesor:e=>S.get(`/horarios/profesor/${e}`),listarHorariosPorDia:e=>S.get(`/horarios/dia/${e}`),crearHorario:e=>S.post("/horarios",e),actualizarHorario:(e,t)=>S.put(`/horarios/${e}`,t),eliminarHorario:e=>S.delete(`/horarios/${e}`)},lt=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Jt=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],nt=["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"],W={HORARIO_ATENCION:{bg:"#6366f1",light:"#eef2ff",text:"#4338ca",label:"Atención"},REUNION:{bg:"#f59e0b",light:"#fffbeb",text:"#b45309",label:"Reunión"},ACTIVIDAD:{bg:"#10b981",light:"#ecfdf5",text:"#047857",label:"Actividad"},OTRO:{bg:"#64748b",light:"#f1f5f9",text:"#334155",label:"Otro"}},he={ACTIVO:{bg:"#dcfce7",text:"#16a34a",label:"Activo"},CANCELADO:{bg:"#fee2e2",text:"#dc2626",label:"Cancelado"},COMPLETADO:{bg:"#e0e7ff",text:"#4338ca",label:"Completado"}},we=e=>e?new Date(e).toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}):"—",Xt=e=>e?new Date(e).toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}):"—",Ie=e=>e.toISOString().split("T")[0];let F=new Date().getFullYear(),C=new Date().getMonth(),V=[],K=[],$=null,De="calendario";async function Yt(e){const t=m.hasRole("ADMINISTRADOR","DIRECTOR","PROFESOR"),r=m.hasRole("ADMINISTRADOR","DIRECTOR");e.innerHTML=Wt(t,r),Kt(e);const a=m.hasRole("PROFESOR")?m.id():null;await le(a),_(e),Y(e),Zt(e)}function Wt(e,t){const r=m.hasRole("PROFESOR");return`
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
          ${Object.entries(W).map(([a,s])=>`
            <div class="legend-item">
              <span class="legend-dot" style="background:${s.bg}"></span>
              <span>${s.label}</span>
            </div>`).join("")}
        </div>

        <!-- Filtros rápidos -->
        ${r?"":`
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
  </div>`}async function le(e=null){try{const[t,r]=await Promise.all([e?N.listarPorProfesor(e):N.listarTodos(),e?N.listarHorariosPorProfesor(e):N.listarHorarios()]);V=t||[],K=r||[]}catch(t){u(`Error cargando datos: ${t.message}`,"error"),V=[],K=[]}}function _(e){const t=e.querySelector("#cal-month-label"),r=e.querySelector("#cal-grid");if(!t||!r)return;t.textContent=`${lt[C]} ${F}`;const a=new Date(F,C,1).getDay(),s=new Date(F,C+1,0).getDate(),i=new Date;let o=Jt.map(l=>`<div class="cal-day-header">${l}</div>`).join("");for(let l=0;l<a;l++)o+='<div class="cal-cell cal-empty"></div>';for(let l=1;l<=s;l++){const n=new Date(F,C,l),d=Ie(n),c=l===i.getDate()&&C===i.getMonth()&&F===i.getFullYear(),p=$===d,b=V.filter(v=>{const E=new Date(v.fechaInicio);return E.getFullYear()===F&&E.getMonth()===C&&E.getDate()===l}),h=[...new Set(b.map(v=>v.tipoAgenda))].slice(0,3).map(v=>{var E;return`<span class="cal-dot" style="background:${((E=W[v])==null?void 0:E.bg)??"#888"}"></span>`}).join("");o+=`
      <div class="cal-cell ${c?"cal-today":""} ${p?"cal-selected":""} ${b.length?"cal-has-events":""}"
           data-date="${d}" data-count="${b.length}">
        <span class="cal-day-num">${l}</span>
        <div class="cal-dots">${h}</div>
      </div>`}r.innerHTML=o,r.querySelectorAll(".cal-cell[data-date]").forEach(l=>{l.addEventListener("click",()=>{$=l.dataset.date,_(e),X(e,$)})})}function X(e,t){const r=e.querySelector("#day-events-title"),a=e.querySelector("#day-events-list");if(!r||!a)return;const s=new Date(t+"T00:00:00");r.innerHTML=`<i class="fas fa-calendar-day"></i>
    Eventos del ${s.getDate()} de ${lt[s.getMonth()]} ${s.getFullYear()}`;const i=V.filter(o=>{const l=new Date(o.fechaInicio);return Ie(l)===t});if(!i.length){a.innerHTML='<div class="day-empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>';return}a.innerHTML=i.map(o=>{const l=W[o.tipoAgenda]??W.OTRO,n=he[o.estado]??he.ACTIVO;return`
      <div class="day-event-item" style="border-left:4px solid ${l.bg}">
        <div class="day-event-header">
          <span class="day-event-tipo" style="background:${l.light};color:${l.text}">
            ${l.label}
          </span>
          <span class="day-event-estado" style="background:${n.bg};color:${n.text}">
            ${n.label}
          </span>
        </div>
        <div class="day-event-title">${o.titulo}</div>
        <div class="day-event-meta">
          <span><i class="fas fa-user-tie"></i> ${o.nombreProfesor}</span>
          <span><i class="fas fa-clock"></i> ${we(o.fechaInicio)} – ${we(o.fechaFin)}</span>
          ${o.lugar?`<span><i class="fas fa-location-dot"></i> ${o.lugar}</span>`:""}
          ${o.recurrente?`<span><i class="fas fa-rotate"></i> Recurrente — ${o.diaSemana??""}</span>`:""}
        </div>
        ${o.descripcion?`<div class="day-event-desc">${o.descripcion}</div>`:""}
      </div>`}).join("")}function ie(e,t=""){const r=e.querySelector("#eventos-tbody");if(!r)return;const a=m.hasRole("ADMINISTRADOR","DIRECTOR","PROFESOR"),s=m.hasRole("ADMINISTRADOR","DIRECTOR");let i=V;if(t){const o=t.toLowerCase();i=i.filter(l=>{var n,d,c;return((n=l.nombreProfesor)==null?void 0:n.toLowerCase().includes(o))||((d=l.titulo)==null?void 0:d.toLowerCase().includes(o))||((c=l.especialidad)==null?void 0:c.toLowerCase().includes(o))})}if(!i.length){r.innerHTML=`<tr><td colspan="8" class="text-center" style="padding:30px;color:var(--text3)">
      <i class="fas fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:6px"></i>
      Sin eventos registrados
    </td></tr>`;return}r.innerHTML=i.map(o=>{const l=W[o.tipoAgenda]??W.OTRO,n=he[o.estado]??he.ACTIVO;return`
      <tr>
        <td>
          <span class="badge-tipo" style="background:${l.light};color:${l.text}">
            ${l.label}
          </span>
        </td>
        <td><strong>${o.titulo}</strong>
          ${o.recurrente?'<span class="recurrente-tag"><i class="fas fa-rotate"></i></span>':""}
        </td>
        <td>
          <div style="font-weight:500">${o.nombreProfesor}</div>
          ${o.especialidad?`<div style="font-size:11px;color:var(--text3)">${o.especialidad}</div>`:""}
        </td>
        <td>${Xt(o.fechaInicio)}</td>
        <td style="font-variant-numeric:tabular-nums;font-size:13px">
          ${we(o.fechaInicio)} – ${we(o.fechaFin)}
        </td>
        <td><span class="badge-estado" style="background:${n.bg};color:${n.text}">${n.label}</span></td>
        <td style="color:var(--text2);font-size:13px">${o.lugar??"—"}</td>
        ${a?`
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline btn-edit-evento" data-id="${o.id}"
              title="Editar"><i class="fas fa-pen"></i></button>
            ${s?`
            <button class="btn btn-sm btn-danger btn-del-evento" data-id="${o.id}"
              title="Eliminar"><i class="fas fa-trash"></i></button>`:""}
          </div>
        </td>`:""}
      </tr>`}).join(""),e.querySelectorAll(".btn-edit-evento").forEach(o=>{o.addEventListener("click",()=>{const l=V.find(n=>n.id==o.dataset.id);l&&dt(e,l)})}),e.querySelectorAll(".btn-del-evento").forEach(o=>{o.addEventListener("click",()=>pt(e,o.dataset.id,"evento"))})}function Y(e,t=""){const r=e.querySelector("#horario-week-grid");if(!r)return;const a=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"],s={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},i=m.hasRole("ADMINISTRADOR","DIRECTOR"),o=t?[t]:a,l=K;if(!l.length){r.innerHTML=`<div class="day-empty" style="padding:40px;text-align:center">
      <i class="fas fa-calendar-week" style="font-size:2rem;color:var(--text3);display:block;margin-bottom:10px"></i>
      <span style="color:var(--text3)">Sin horarios registrados</span>
    </div>`;return}r.innerHTML=o.map(n=>{const d=l.filter(c=>c.diaSemana===n&&c.activo);return d.length?`
      <div class="week-day-col">
        <div class="week-day-header">${s[n]}</div>
        <div class="week-day-body">
          ${d.map(c=>{var p,b;return`
            <div class="week-block" style="border-left:4px solid var(--primary)">
              <div class="week-block-time">${((p=c.horaInicio)==null?void 0:p.slice(0,5))??""} – ${((b=c.horaFin)==null?void 0:b.slice(0,5))??""}</div>
              <div class="week-block-materia">${c.materia}</div>
              <div class="week-block-meta">
                <span><i class="fas fa-user-tie"></i> ${c.nombreProfesor}</span>
                ${c.aula?`<span><i class="fas fa-door-open"></i> ${c.aula}</span>`:""}
              </div>
              ${c.activo?"":'<span class="week-inactive">Inactivo</span>'}
              ${i?`
              <div class="week-block-actions">
                <button class="btn btn-sm btn-outline btn-edit-horario" data-id="${c.id}"
                  title="Editar"><i class="fas fa-pen"></i></button>
                <button class="btn btn-sm btn-danger btn-del-horario" data-id="${c.id}"
                  title="Eliminar"><i class="fas fa-trash"></i></button>
              </div>`:""}
            </div>`}).join("")}
        </div>
      </div>`:""}).join(""),e.querySelectorAll(".btn-edit-horario").forEach(n=>{n.addEventListener("click",()=>{const d=K.find(c=>c.id==n.dataset.id);d&&ct(e,d)})}),e.querySelectorAll(".btn-del-horario").forEach(n=>{n.addEventListener("click",()=>pt(e,n.dataset.id,"horario"))})}function Kt(e){e.addEventListener("click",t=>{const r=t.target.closest(".agenda-tab");r&&(De=r.dataset.tab,e.querySelectorAll(".agenda-tab").forEach(a=>a.classList.toggle("active",a===r)),e.querySelectorAll(".tab-content").forEach(a=>{a.style.display=a.id===`tab-${De}`?"":"none"}),De==="horarios"&&Y(e))})}function Zt(e,t,r){var a,s,i,o,l,n,d,c;(a=e.querySelector("#cal-prev"))==null||a.addEventListener("click",()=>{C===0?(C=11,F--):C--,_(e),$&&X(e,$)}),(s=e.querySelector("#cal-next"))==null||s.addEventListener("click",()=>{C===11?(C=0,F++):C++,_(e),$&&X(e,$)}),(i=e.querySelector("#btn-filter-prof"))==null||i.addEventListener("click",async()=>{var b,h;const p=(h=(b=e.querySelector("#filter-profesor"))==null?void 0:b.value)==null?void 0:h.trim();await le(p?Number(p):null),_(e),ie(e),Y(e),$&&X(e,$)}),(o=e.querySelector("#btn-clear-filter"))==null||o.addEventListener("click",async()=>{const p=e.querySelector("#filter-profesor");p&&(p.value=""),await le(null),_(e),ie(e),Y(e),$&&X(e,$)}),(l=e.querySelector("#search-eventos"))==null||l.addEventListener("input",p=>{ie(e,p.target.value)}),(n=e.querySelector("#filter-dia"))==null||n.addEventListener("change",p=>{Y(e,p.target.value)}),(d=e.querySelector("#btn-new-evento"))==null||d.addEventListener("click",()=>{dt(e,null)}),(c=e.querySelector("#btn-new-horario"))==null||c.addEventListener("click",()=>{ct(e,null)}),ie(e)}function dt(e,t){const r=!!t,a=r?"Editar Evento de Agenda":"Nuevo Evento de Agenda",s=m.hasRole("PROFESOR"),i=(t==null?void 0:t.profesorId)??(s?m.id():""),o=(t==null?void 0:t.nombreProfesor)??(s?m.nombre():""),l=d=>d?d.replace("T","T").substring(0,16):"",n=`
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
              value="${o}" autocomplete="off" ${s?"disabled":""}/>
          </div>
          <div class="profesor-search-dropdown" id="ev-profesor-dropdown"></div>
          <input type="hidden" id="ev-profesorId" value="${i}"/>
          <input type="hidden" id="ev-nombreProfesor" value="${o}"/>
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
        <input id="ev-fecha" type="date" class="form-input" value="${t?Ie(new Date(t.fechaInicio)):$??Ie(new Date)}"/>
      </div>
      <div class="form-group">
        <label>Horario de Atención *</label>
        <select id="ev-horario-select" class="form-select">
          <option value="">Seleccione un profesor primero...</option>
        </select>
      </div>
      <input type="hidden" id="ev-inicio" value="${t!=null&&t.fechaInicio?l(t.fechaInicio):""}"/>
      <input type="hidden" id="ev-fin" value="${t!=null&&t.fechaFin?l(t.fechaFin):""}"/>
      <div id="ev-fecha-warning" class="form-warning-message" style="display:none;grid-column:1/-1;margin-top:5px;color:#d97706;background:#fffbeb;padding:8px;border-radius:4px;border:1px solid #fef3c7;font-size:12px;"></div>
      <div class="form-group">
        <label>Estado</label>
        <select id="ev-estado" class="form-select">
          ${Object.entries(he).map(([d,c])=>`<option value="${d}" ${(t==null?void 0:t.estado)===d?"selected":""}>${c.label}</option>`).join("")}
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
          ${nt.map(d=>`<option value="${d}" ${(t==null?void 0:t.diaSemana)===d?"selected":""}>${d.charAt(0)+d.slice(1).toLowerCase()}</option>`).join("")}
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Descripción</label>
        <textarea id="ev-descripcion" class="form-input" rows="3" placeholder="Descripción opcional…">${(t==null?void 0:t.descripcion)??""}</textarea>
      </div>
    </div>`;L({title:a,bodyHTML:n,onConfirm:async(d,c)=>{const p={profesorId:Number(document.getElementById("ev-profesorId").value),nombreProfesor:document.getElementById("ev-nombreProfesor").value.trim(),especialidad:document.getElementById("ev-especialidad").value.trim()||null,titulo:document.getElementById("ev-titulo").value.trim(),descripcion:document.getElementById("ev-descripcion").value.trim()||null,fechaInicio:document.getElementById("ev-inicio").value,fechaFin:document.getElementById("ev-fin").value,tipoAgenda:document.getElementById("ev-tipo").value,estado:document.getElementById("ev-estado").value,lugar:document.getElementById("ev-lugar").value.trim()||null,recurrente:document.getElementById("ev-recurrente").checked,diaSemana:document.getElementById("ev-recurrente").checked?document.getElementById("ev-diaSemana").value:null};if(!p.profesorId||!p.nombreProfesor||!p.titulo||!p.fechaInicio||!p.fechaFin){u("Completa los campos obligatorios (*)","error");return}try{r?(await N.actualizar(t.id,p),u("Evento actualizado correctamente","success")):(await N.crear(p),u("Evento creado correctamente","success"));const b=m.hasRole("PROFESOR")?m.id():null;await le(b),_(e),ie(e),$&&X(e,$),c()}catch(b){u(`Error: ${b.message}`,"error")}}}),setTimeout(()=>{var v,E,de,j;const d=A=>{if(!A)return"";const[R,y,w]=A.split("-").map(Number),T=new Date(R,y-1,w).getDay();return["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"][T]},c=A=>{const y={DOMINGO:0,LUNES:1,MARTES:2,MIERCOLES:3,JUEVES:4,VIERNES:5,SABADO:6}[A];if(y===void 0)return null;const w=new Date,P=w.getDay();let T=y-P;T<0&&(T+=7);const I=new Date(w.getFullYear(),w.getMonth(),w.getDate()+T),D=I.getFullYear(),B=String(I.getMonth()+1).padStart(2,"0"),M=String(I.getDate()).padStart(2,"0");return`${D}-${B}-${M}`},p=(A=!1)=>{const R=document.getElementById("ev-horario-select");if(!R)return;const y=R.options[R.selectedIndex],w=document.getElementById("ev-fecha"),P=document.getElementById("ev-inicio"),T=document.getElementById("ev-fin");if(y&&y.dataset.dia){const D=y.dataset.dia;if(!A&&w){const B=c(D);B&&(w.value=B)}}const I=w==null?void 0:w.value;if(I&&y&&y.dataset.inicio&&y.dataset.fin){const D=y.dataset.inicio,B=y.dataset.fin;P&&(P.value=`${I}T${D}`),T&&(T.value=`${I}T${B}`);const M=y.dataset.dia,Q=document.getElementById("ev-diaSemana");M&&Q&&(Q.value=M);const f=y.dataset.materia,k=document.getElementById("ev-especialidad");f&&k&&(k.value=f);const x=document.getElementById("ev-fecha-warning");if(M){const q=d(I);if(q!==M){const ce={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},Le=ce[M]||M,Te=ce[q]||q;x&&(x.innerHTML=`<i class="fas fa-exclamation-triangle"></i> La fecha seleccionada es <strong>${Te}</strong>, pero el horario seleccionado es para los <strong>${Le}</strong>.`,x.style.display="block")}else x&&(x.style.display="none",x.innerHTML="")}else x&&(x.style.display="none",x.innerHTML="")}else{P&&(P.value=""),T&&(T.value="");const D=document.getElementById("ev-fecha-warning");D&&(D.style.display="none",D.innerHTML="")}},b=async A=>{var y,w,P;const R=document.getElementById("ev-horario-select");if(R){R.innerHTML='<option value="">Cargando horarios...</option>';try{const I=(await N.listarHorariosPorProfesor(A)||[]).filter(f=>f.activo),D=((y=V.find(f=>f.profesorId==A&&f.especialidad))==null?void 0:y.especialidad)||((w=I.find(f=>f.materia))==null?void 0:w.materia)||((P=K.find(f=>f.profesorId==A&&f.materia))==null?void 0:P.materia)||"",B=document.getElementById("ev-especialidad");if(B&&D&&(B.value=D),I.length===0){R.innerHTML='<option value="">El profesor no tiene horarios registrados</option>',p(!0);return}const M={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"};let Q='<option value="">Seleccione un horario...</option>';if(I.forEach(f=>{const k=f.horaInicio.slice(0,5),x=f.horaFin.slice(0,5),q=M[f.diaSemana]||f.diaSemana;let ce=!1;if(t){const Le=l(t.fechaInicio).split("T")[1],Te=l(t.fechaFin).split("T")[1];Le===k&&Te===x&&f.diaSemana===t.diaSemana&&(ce=!0)}Q+=`<option value="${f.id}" data-inicio="${k}" data-fin="${x}" data-dia="${f.diaSemana}" data-materia="${f.materia}" ${ce?"selected":""}>
            ${q}: ${k} - ${x} (${f.materia}${f.aula?" · "+f.aula:""})
          </option>`}),t){const f=l(t.fechaInicio).split("T")[1],k=l(t.fechaFin).split("T")[1];if(!I.some(q=>q.horaInicio.slice(0,5)===f&&q.horaFin.slice(0,5)===k&&q.diaSemana===t.diaSemana)){const q=M[t.diaSemana]||t.diaSemana||"";Q=`<option value="original" data-inicio="${f}" data-fin="${k}" data-dia="${t.diaSemana}" selected>
              [Horario Original] ${q?q+": ":""}${f} - ${k}
            </option>`+Q}}R.innerHTML=Q,p(!0)}catch(T){R.innerHTML='<option value="">Error al cargar horarios</option>',console.error(T)}}};ut("ev-profesor-search","ev-profesor-dropdown","ev-profesorId","ev-nombreProfesor",async A=>{if(A)await b(A);else{const R=document.getElementById("ev-horario-select");R&&(R.innerHTML='<option value="">Seleccione un profesor primero...</option>'),p(!0)}}),(v=document.getElementById("ev-recurrente"))==null||v.addEventListener("change",A=>{document.getElementById("dia-semana-group").style.display=A.target.checked?"":"none"}),(E=document.getElementById("ev-fecha"))==null||E.addEventListener("change",()=>p(!0)),(de=document.getElementById("ev-horario-select"))==null||de.addEventListener("change",()=>p(!1));const h=(j=document.getElementById("ev-profesorId"))==null?void 0:j.value;h&&b(h)},50)}function ct(e,t){var n,d;const r=!!t,a=r?"Editar Horario Semanal":"Nuevo Horario Semanal",s=m.hasRole("PROFESOR"),i=(t==null?void 0:t.profesorId)??(s?m.id():""),o=(t==null?void 0:t.nombreProfesor)??(s?m.nombre():""),l=`
    <div class="form-grid-2">
      <div class="form-group" style="grid-column:1/-1">
        <label>Profesor *</label>
        <div class="profesor-search-wrap" id="h-profesor-wrap">
          <div class="profesor-search-input-row">
            <i class="fas fa-search profesor-search-icon"></i>
            <input id="h-profesor-search" class="form-input profesor-search-input"
              placeholder="Escribe el nombre del profesor…"
              value="${o}" autocomplete="off" ${s?"disabled":""}/>
          </div>
          <div class="profesor-search-dropdown" id="h-profesor-dropdown"></div>
          <input type="hidden" id="h-profesorId" value="${i}"/>
          <input type="hidden" id="h-nombreProfesor" value="${o}"/>
        </div>
      </div>
      <div class="form-group">
        <label>Día de la semana *</label>
        <select id="h-dia" class="form-select">
          ${nt.map(c=>`<option value="${c}" ${(t==null?void 0:t.diaSemana)===c?"selected":""}>${c.charAt(0)+c.slice(1).toLowerCase()}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Materia *</label>
        <input id="h-materia" class="form-input" value="${(t==null?void 0:t.materia)??""}" placeholder="Ej: Matemáticas"/>
      </div>
      <div class="form-group">
        <label>Hora inicio *</label>
        <input id="h-inicio" type="time" class="form-input" value="${((n=t==null?void 0:t.horaInicio)==null?void 0:n.slice(0,5))??""}"/>
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
    </div>`;L({title:a,bodyHTML:l,onConfirm:async(c,p)=>{const b={profesorId:Number(document.getElementById("h-profesorId").value),nombreProfesor:document.getElementById("h-nombreProfesor").value.trim(),diaSemana:document.getElementById("h-dia").value,horaInicio:document.getElementById("h-inicio").value,horaFin:document.getElementById("h-fin").value,materia:document.getElementById("h-materia").value.trim(),aula:document.getElementById("h-aula").value.trim()||null,activo:document.getElementById("h-activo").checked,observaciones:document.getElementById("h-obs").value.trim()||null};if(!b.profesorId||!b.nombreProfesor||!b.horaInicio||!b.horaFin||!b.materia){u("Completa los campos obligatorios (*)","error");return}try{r?(await N.actualizarHorario(t.id,b),u("Horario actualizado correctamente","success")):(await N.crearHorario(b),u("Horario creado correctamente","success"));const h=m.hasRole("PROFESOR")?m.id():null;await le(h),Y(e),p()}catch(h){u(`Error: ${h.message}`,"error")}}}),setTimeout(()=>{var c,p;if(ut("h-profesor-search","h-profesor-dropdown","h-profesorId","h-nombreProfesor",b=>{var h,v;if(b){const E=((h=K.find(j=>j.profesorId==b&&j.materia))==null?void 0:h.materia)||((v=V.find(j=>j.profesorId==b&&j.especialidad))==null?void 0:v.especialidad)||"",de=document.getElementById("h-materia");de&&E&&(de.value=E)}}),s&&!t){const b=((c=K.find(v=>v.profesorId==m.id()&&v.materia))==null?void 0:c.materia)||((p=V.find(v=>v.profesorId==m.id()&&v.especialidad))==null?void 0:p.especialidad)||"",h=document.getElementById("h-materia");h&&b&&(h.value=b)}},50)}async function ut(e,t,r,a,s){const i=document.getElementById(e),o=document.getElementById(t),l=document.getElementById(r),n=document.getElementById(a);if(!i||!o||m.hasRole("PROFESOR"))return;let d=[];try{d=(await re.listar()||[]).filter(b=>b.rol==="PROFESOR")}catch{}function c(p){const b=p.trim().toLowerCase(),h=b?d.filter(v=>{var E;return(E=v.nombre)==null?void 0:E.toLowerCase().includes(b)}):d;if(!h.length){o.innerHTML='<div class="profesor-no-result"><i class="fas fa-user-slash"></i> Sin resultados</div>',o.classList.add("open");return}o.innerHTML=h.map(v=>`
      <div class="profesor-option" data-id="${v.id}" data-nombre="${v.nombre}">
        <span class="profesor-option-avatar">${v.nombre.charAt(0).toUpperCase()}</span>
        <div class="profesor-option-info">
          <span class="profesor-option-name">${v.nombre}</span>
          <span class="profesor-option-role">ID: ${v.id} · Profesor</span>
        </div>
      </div>`).join(""),o.classList.add("open"),o.querySelectorAll(".profesor-option").forEach(v=>{v.addEventListener("mousedown",E=>{E.preventDefault(),l.value=v.dataset.id,n.value=v.dataset.nombre,i.value=v.dataset.nombre,i.classList.add("profesor-selected"),o.classList.remove("open"),o.innerHTML="",typeof s=="function"&&s(v.dataset.id)})})}i.addEventListener("input",()=>{l.value="",n.value="",i.classList.remove("profesor-selected"),c(i.value),typeof s=="function"&&s(null)}),i.addEventListener("focus",()=>{c(i.value)}),i.addEventListener("blur",()=>{setTimeout(()=>{if(o.classList.remove("open"),o.innerHTML="",!l.value&&i.value.trim()){const p=d.find(b=>b.nombre.toLowerCase()===i.value.trim().toLowerCase());p&&(l.value=p.id,n.value=p.nombre,i.classList.add("profesor-selected"),typeof s=="function"&&s(p.id))}},200)})}function pt(e,t,r){L({title:r==="evento"?"Eliminar Evento":"Eliminar Horario",bodyHTML:`<p style="color:var(--text2);line-height:1.6">
    ¿Estás seguro que deseas eliminar este ${r==="evento"?"evento de agenda":"bloque de horario"}?
    <strong>Esta acción no se puede deshacer.</strong>
  </p>`,onConfirm:async(i,o)=>{try{r==="evento"?(await N.eliminar(t),u("Evento eliminado","success")):(await N.eliminarHorario(t),u("Horario eliminado","success"));const l=m.hasRole("PROFESOR")?m.id():null;await le(l),_(e),ie(e),Y(e),$&&X(e,$),o()}catch(l){u(`Error: ${l.message}`,"error")}}})}const ea={listar:()=>g.get("/auditoria")};let be=[];const ta={ADMINISTRADOR:"badge-red",PORTERO:"badge-blue",SECRETARIA:"badge-green",DIRECTOR:"badge-yellow",PROFESOR:"badge-purple",SISTEMA:"badge-gray"},aa=e=>`<span class="badge ${ta[e]??"badge-gray"}">${e}</span>`;function sa(e){return e?new Date(e).toLocaleString("es-PE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}):""}async function oa(e){e.innerHTML=`
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
    </div>`,await ia(e);const t=e.querySelector("#aud-search"),r=e.querySelector("#aud-filter-rol"),a=()=>{const s=t.value.toLowerCase().trim(),i=r.value;let o=be;i&&(o=o.filter(l=>l.rol===i)),s&&(o=o.filter(l=>{var n,d,c;return((n=l.usuario)==null?void 0:n.toLowerCase().includes(s))||((d=l.accion)==null?void 0:d.toLowerCase().includes(s))||((c=l.detalles)==null?void 0:c.toLowerCase().includes(s))})),bt(e,o)};t.addEventListener("input",a),r.addEventListener("change",a)}async function ia(e){try{be=await ea.listar(),e.querySelector("#aud-total").textContent=`${be.length}`,e.querySelector("#aud-footer-lbl").textContent=`${be.length} transacciones registradas`,bt(e,be)}catch(t){u(t.message,"error")}}function bt(e,t){const r=e.querySelector("#aud-tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="5">Sin transacciones registradas que coincidan</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td class="td-muted">${sa(a.fecha)}</td>
      <td><strong>${a.usuario}</strong></td>
      <td>${aa(a.rol)}</td>
      <td><span class="badge badge-yellow" style="font-family:monospace">${a.accion}</span></td>
      <td style="color:var(--text2);font-size:0.92rem;max-width:400px;word-break:break-word">${a.detalles??""}</td>
    </tr>`).join("")}const ne={listarAreas:()=>g.get("/inventario/areas"),registrarArea:e=>g.post("/inventario/areas",e),listarArticulos:e=>{const t=e?`?areaId=${e}`:"";return g.get(`/inventario/articulos${t}`)},registrarArticulo:e=>g.post("/inventario/articulos",e),actualizarArticulo:(e,t)=>g.put(`/inventario/articulos/${e}`,t),eliminarArticulo:e=>g.delete(`/inventario/articulos/${e}`),buscarPorCodigo:e=>g.get(`/inventario/articulos/codigo/${e}`)};let ee=[],Ee=[],G=null,ve="";const fe=()=>m.hasRole("ADMINISTRADOR","DIRECTOR","SECRETARIA"),ra={EXCELENTE:"badge-green",BUENO:"badge-blue",REGULAR:"badge-yellow",DETERIORADO:"badge-red",EN_MANTENIMIENTO:"badge-purple"};async function la(e){var t,r;G=null,ve="",e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1><i class="fas fa-boxes" style="color:var(--primary)"></i> Inventario & Logística</h1>
        <div class="sub">Control de activos por aula e infraestructura</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${fe()?`
          <button class="btn btn-outline" id="btn-new-area"><i class="fas fa-folder-plus"></i> Nueva Área / Aula</button>
          <button class="btn btn-primary" id="btn-new-articulo"><i class="fas fa-plus"></i> Nuevo Artículo</button>
        `:""}
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
                ${fe()?'<th style="width:100px">Acciones</th>':""}
              </tr>
            </thead>
            <tbody id="tbody-articulos">
              <tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Selecciona un área para ver sus ítems</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-inventario">—</span></div>
      </div>

    </div>`,await mt(e),(t=e.querySelector("#btn-new-area"))==null||t.addEventListener("click",()=>na(e)),(r=e.querySelector("#btn-new-articulo"))==null||r.addEventListener("click",()=>ft(e)),e.querySelector("#search-articulos").addEventListener("input",a=>{ve=a.target.value.toLowerCase().trim(),vt(e)})}async function mt(e){try{ee=await ne.listarAreas();const t=e.querySelector("#areas-list-container");if(!ee.length){t.innerHTML='<div style="text-align:center;color:var(--text3);padding:12px;font-size:0.85rem">Sin áreas registradas</div>';return}t.innerHTML=ee.map(r=>`
      <button class="btn btn-outline area-selector-btn" data-id="${r.id}" 
        style="justify-content:flex-start;text-align:left;width:100%;border:none;background:transparent;padding:10px 12px;border-radius:8px;display:flex;align-items:center;gap:10px">
        <i class="${r.tipo==="AULA"?"fas fa-door-open":"fas fa-layer-group"}" style="color:var(--primary);opacity:0.8"></i>
        <div style="flex-grow:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          <div style="font-weight:600;font-size:0.88rem;color:var(--text)">${r.nombre}</div>
          <div style="font-size:0.75rem;color:var(--text3)">${r.tipo}</div>
        </div>
      </button>`).join(""),t.querySelectorAll(".area-selector-btn").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".area-selector-btn").forEach(s=>s.style.background="transparent"),r.style.background="rgba(99, 102, 241, 0.1)",G=Number(r.dataset.id);const a=ee.find(s=>s.id===G);e.querySelector("#table-title").innerHTML=`📦 ${a.nombre} <span style="font-weight:400;font-size:0.8rem;color:var(--text3)">(${a.tipo})</span>`,He(e)})}),ee.length>0&&!G&&t.querySelector(".area-selector-btn").click()}catch(t){u(t.message,"error")}}async function He(e){if(G)try{Ee=await ne.listarArticulos(G),vt(e)}catch(t){u(t.message,"error")}}function vt(e){const t=e.querySelector("#tbody-articulos"),r=e.querySelector("#total-articulos"),a=e.querySelector("#footer-inventario"),s=Ee.filter(i=>{var o,l,n;return((o=i.nombre)==null?void 0:o.toLowerCase().includes(ve))||((l=i.codigoBarras)==null?void 0:l.toLowerCase().includes(ve))||((n=i.descripcion)==null?void 0:n.toLowerCase().includes(ve))});if(r.textContent=`${s.length}`,a.textContent=`${s.length} artículos en esta área`,!s.length){t.innerHTML=`<tr><td colspan="${fe()?6:5}" style="text-align:center;padding:28px;color:var(--text3)">Sin artículos registrados en esta área que coincidan</td></tr>`;return}t.innerHTML=s.map(i=>`
    <tr>
      <td>
        <span style="font-family:monospace;font-weight:700;color:var(--text2);background:var(--border);padding:4px 8px;border-radius:4px;font-size:0.85rem">
          <i class="fas fa-barcode" style="margin-right:4px"></i>${i.codigoBarras}
        </span>
      </td>
      <td><strong>${i.nombre}</strong></td>
      <td><span class="badge badge-blue" style="font-size:0.9rem">${i.cantidad}</span></td>
      <td><span class="badge ${ra[i.estado]??"badge-gray"}">${i.estado.replace("_"," ")}</span></td>
      <td class="td-muted" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${i.descripcion??""}">${i.descripcion??"—"}</td>
      ${fe()?`
        <td style="display:flex;gap:6px">
          <button class="btn btn-outline btn-sm edit-art-btn" data-id="${i.id}" title="Editar artículo">✏️</button>
          <button class="btn btn-danger btn-sm del-art-btn" data-id="${i.id}" title="Eliminar artículo">🗑</button>
        </td>
      `:""}
    </tr>`).join(""),fe()&&(t.querySelectorAll(".edit-art-btn").forEach(i=>{i.addEventListener("click",()=>ft(e,Ee.find(o=>o.id==i.dataset.id)))}),t.querySelectorAll(".del-art-btn").forEach(i=>{i.addEventListener("click",()=>da(e,Ee.find(o=>o.id==i.dataset.id)))}))}function na(e){L({title:"+ Nueva Área o Aula",bodyHTML:`
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
      </div>`,confirmText:"Registrar",onConfirm:async(t,r)=>{const a={nombre:t.querySelector("#ma-nombre").value.trim(),tipo:t.querySelector("#ma-tipo").value,descripcion:t.querySelector("#ma-desc").value.trim()};if(!a.nombre){u("El nombre es obligatorio","warning");return}try{const s=await ne.registrarArea(a);u("Área / Aula creada exitosamente","success"),G=s.id,r(),await mt(e)}catch(s){u(s.message,"error")}}})}function ft(e,t=null){const r=!!t,a=ee.map(s=>`<option value="${s.id}" ${(t?t.area.id:G)===s.id?"selected":""}>${s.nombre}</option>`).join("");L({title:r?"✏️ Editar Artículo":"+ Nuevo Artículo de Inventario",bodyHTML:`
      <div class="form-grid">
        <div class="form-group" style="grid-column:1/-1">
          <label>Nombre del Artículo *</label>
          <input class="form-control" id="mar-nombre" value="${(t==null?void 0:t.nombre)??""}" placeholder="Ej: Proyector Multimedia Epson" />
        </div>
        
        <div class="form-group">
          <label>Cantidad *</label>
          <input class="form-control" type="number" id="mar-cant" value="${(t==null?void 0:t.cantidad)??1}" min="1" />
        </div>

        <div class="form-group">
          <label>Estado actual *</label>
          <select class="form-control" id="mar-estado">
            <option value="EXCELENTE" ${(t==null?void 0:t.estado)==="EXCELENTE"?"selected":""}>EXCELENTE</option>
            <option value="BUENO" ${(t==null?void 0:t.estado)==="BUENO"?"selected":""}>BUENO</option>
            <option value="REGULAR" ${(t==null?void 0:t.estado)==="REGULAR"?"selected":""}>REGULAR</option>
            <option value="DETERIORADO" ${(t==null?void 0:t.estado)==="DETERIORADO"?"selected":""}>DETERIORADO</option>
            <option value="EN_MANTENIMIENTO" ${(t==null?void 0:t.estado)==="EN_MANTENIMIENTO"?"selected":""}>EN MANTENIMIENTO</option>
          </select>
        </div>

        <div class="form-group" style="grid-column:1/-1">
          <label>Área / Aula Asignada *</label>
          <select class="form-control" id="mar-area">
            ${a}
          </select>
        </div>

        <!-- Sección de Código de Barras -->
        <div class="form-group" style="grid-column:1/-1">
          <label>Código de Barras</label>
          <div style="display:flex;gap:12px;margin-bottom:8px">
            <label style="font-weight:400;font-size:0.85rem;display:flex;align-items:center;gap:6px">
              <input type="radio" name="barcode-mode" id="barcode-auto" ${r?"":"checked"} /> Autogenerar código
            </label>
            <label style="font-weight:400;font-size:0.85rem;display:flex;align-items:center;gap:6px">
              <input type="radio" name="barcode-mode" id="barcode-manual" ${r?"checked":""} /> Asignar código manual
            </label>
          </div>
          <input class="form-control" id="mar-barcode" value="${(t==null?void 0:t.codigoBarras)??""}" 
            placeholder="Introduce o escanea el código de barras..." 
            ${r?"":'disabled style="background:var(--border);color:var(--text3)"'} />
        </div>

        <div class="form-group" style="grid-column:1/-1">
          <label>Descripción o número de serie</label>
          <input class="form-control" id="mar-desc" value="${(t==null?void 0:t.descripcion)??""}" placeholder="Opcional. Ej: Serie S/N 12345" />
        </div>
      </div>`,confirmText:r?"Actualizar":"Registrar Ítem",onOpen:s=>{const i=s.querySelector("#barcode-auto"),o=s.querySelector("#barcode-manual"),l=s.querySelector("#mar-barcode");r||(l.value="SG-XXXXXXXX (Se autogenerará)"),i==null||i.addEventListener("change",()=>{i.checked&&(l.disabled=!0,l.style.background="var(--border)",l.style.color="var(--text3)",l.value="SG-XXXXXXXX (Se autogenerará)")}),o==null||o.addEventListener("change",()=>{o.checked&&(l.disabled=!1,l.style.background="",l.style.color="",l.value=r?t.codigoBarras:"",l.focus())})},onConfirm:async(s,i)=>{var d;const o=((d=s.querySelector("#barcode-auto"))==null?void 0:d.checked)??!1,l=s.querySelector("#mar-barcode").value.trim(),n={nombre:s.querySelector("#mar-nombre").value.trim(),cantidad:Number(s.querySelector("#mar-cant").value),estado:s.querySelector("#mar-estado").value,areaId:Number(s.querySelector("#mar-area").value),codigoBarras:o?"":l,descripcion:s.querySelector("#mar-desc").value.trim()};if(!n.nombre||!n.cantidad){u("Completa los campos obligatorios","warning");return}if(!o&&!n.codigoBarras){u("Debes introducir un código de barras si seleccionas manual","warning");return}try{r?(o&&(n.codigoBarras=t.codigoBarras),await ne.actualizarArticulo(t.id,n),u("Artículo actualizado exitosamente","success")):(await ne.registrarArticulo(n),u("Artículo registrado exitosamente","success")),i(),await He(e)}catch(c){u(c.message,"error")}}})}function da(e,t){L({title:"🗑 Eliminar Artículo del Inventario",bodyHTML:`<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${t.nombre}</strong> (${t.codigoBarras}) del inventario?<br/>Esta acción no se puede deshacer y quedará registrada en auditoría.</p>`,confirmText:"Eliminar",danger:!0,onConfirm:async(r,a)=>{try{await ne.eliminarArticulo(t.id),u("Artículo eliminado del inventario","success"),a(),await He(e)}catch(s){u(s.message,"error")}}})}const pe=document.getElementById("app"),ca={"#/login":{page:Rt,auth:!1},"#/dashboard":{page:xt,auth:!0},"#/visitas":{page:qt,auth:!0},"#/visitantes":{page:Ct,auth:!0},"#/alumnos":{page:Mt,auth:!0},"#/usuarios":{page:Bt,auth:!0,roles:["ADMINISTRADOR"]},"#/auditoria":{page:oa,auth:!0,roles:["ADMINISTRADOR"]},"#/asistencia":{page:Ut,auth:!0},"#/agenda":{page:Yt,auth:!0},"#/inventario":{page:la,auth:!0}};async function gt(){const e=window.location.hash||"#/dashboard",t=ca[e];if(!t){window.location.hash="#/dashboard";return}if(!t.auth){if(m.isLogged()){window.location.hash="#/dashboard";return}pe.innerHTML="",t.page(pe);return}if(!m.isLogged()){window.location.hash="#/login";return}if(t.roles&&!t.roles.includes(m.rol())){window.location.hash="#/dashboard";return}pe.innerHTML=`
    <div class="app-container">
      <div id="sidebar-wrap"></div>
      <div class="main-content" id="page-root"></div>
    </div>`,Et(pe.querySelector("#sidebar-wrap"));const r=pe.querySelector("#page-root");try{await t.page(r)}catch(a){r.innerHTML=`
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;height:60vh;gap:10px;color:var(--text2)">
        <span style="font-size:2.5rem">⚠️</span>
        <p style="font-weight:600">Error al cargar la página</p>
        <small>${a.message}</small>
      </div>`}}window.addEventListener("hashchange",gt);window.addEventListener("load",()=>{window.location.hash||(window.location.hash="#/dashboard"),gt()});
