(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=r(o);fetch(o.href,i)}})();const Oe="sg_session",m={save(e){sessionStorage.setItem(Oe,JSON.stringify(e))},get(){try{return JSON.parse(sessionStorage.getItem(Oe))}catch{return null}},clear(){sessionStorage.removeItem(Oe)},token(){var e;return((e=this.get())==null?void 0:e.token)??null},usuario(){var e;return((e=this.get())==null?void 0:e.usuario)??null},nombre(){var e;return((e=this.get())==null?void 0:e.nombre)??null},rol(){var e;return((e=this.get())==null?void 0:e.rol)??null},id(){var e;return((e=this.get())==null?void 0:e.id)??null},isLogged(){return!!this.token()},hasRole(...e){return e.includes(this.rol())}},yt=[{section:"PRINCIPAL",items:[{icon:"fas fa-chart-line",label:"Dashboard",hash:"#/dashboard",roles:null},{icon:"fas fa-clipboard-list",label:"Visitas",hash:"#/visitas",roles:["ADMINISTRADOR","PORTERO","SECRETARIA","DIRECTOR","PROFESOR"]}]},{section:"GESTIÓN",items:[{icon:"fas fa-users",label:"Visitantes",hash:"#/visitantes",roles:["ADMINISTRADOR","SECRETARIA"]},{icon:"fas fa-user-graduate",label:"Alumnos",hash:"#/alumnos",roles:["ADMINISTRADOR","SECRETARIA","PROFESOR"]},{icon:"fas fa-check-square",label:"Asistencia",hash:"#/asistencia",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-calendar-alt",label:"Agenda",hash:"#/agenda",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-boxes",label:"Inventario",hash:"#/inventario",roles:["ADMINISTRADOR","DIRECTOR","SECRETARIA","PORTERO","PROFESOR"]},{icon:"fas fa-user-cog",label:"Usuarios",hash:"#/usuarios",roles:["ADMINISTRADOR"]},{icon:"fas fa-history",label:"Auditoría",hash:"#/auditoria",roles:["ADMINISTRADOR"]}]}],Et={ADMINISTRADOR:"Administrador",PORTERO:"Portero",SECRETARIA:"Secretaria",DIRECTOR:"Director",PROFESOR:"Profesor"};function St(e){const t=m.rol(),r=window.location.hash||"#/dashboard",a=yt.map(o=>{const i=o.items.filter(s=>!s.roles||s.roles.includes(t));return i.length?`
      <div class="nav-section-title">${o.section}</div>
      <ul class="nav-list">
        ${i.map(s=>`
          <li>
            <a class="nav-link ${r===s.hash?"active":""}"
               href="${s.hash}" data-hash="${s.hash}">
              <span class="nav-icon"><i class="${s.icon}"></i></span>
              <span>${s.label}</span>
            </a>
          </li>`).join("")}
      </ul>`:""}).join("");if(!document.getElementById("sidebar-toggle")){const o=document.createElement("button");o.id="sidebar-toggle",o.className="sidebar-toggle",o.setAttribute("aria-label","Abrir menú"),o.innerHTML='<i class="fas fa-bars"></i>',document.body.prepend(o);const i=document.createElement("div");i.id="sidebar-overlay",i.className="sidebar-overlay",document.body.prepend(i);const s=()=>{var l;(l=document.querySelector(".sidebar"))==null||l.classList.add("open"),i.classList.add("active"),o.innerHTML='<i class="fas fa-times"></i>'},n=()=>{var l;(l=document.querySelector(".sidebar"))==null||l.classList.remove("open"),i.classList.remove("active"),o.innerHTML='<i class="fas fa-bars"></i>'};o.addEventListener("click",()=>{var d;((d=document.querySelector(".sidebar"))==null?void 0:d.classList.contains("open"))?n():s()}),i.addEventListener("click",n),window.addEventListener("hashchange",()=>{window.innerWidth<=768&&n()})}e.innerHTML=`
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
            <div class="u-role">${Et[t]??t}</div>
          </div>
        </div>
        <button class="btn-logout" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
    </aside>`,e.querySelector("#logout-btn").addEventListener("click",()=>{m.clear(),window.location.hash="#/login"})}const Re="https://school-project-1mso.onrender.com",Ne="https://school-project-assitencia-service.onrender.com",$t="https://school-project-agendaservice.onrender.com",ue=`${Re}/api`,Be=`${Ne}/api`,ye=`${$t}/api`;async function B(e,t,r={}){const a=m.token(),o={"Content-Type":"application/json",...r.headers};a&&(o.Authorization=`Bearer ${a}`);const i=await fetch(`${e}${t}`,{...r,headers:o});if(i.status===401)throw m.clear(),window.location.hash="#/login",new Error("Sesión expirada");if(i.status===204)return null;if(!i.ok){const s=await i.json().catch(()=>({error:`Error ${i.status}`}));throw new Error(s.error||s.message||`Error ${i.status}`)}return i.json()}const g={get:e=>B(ue,e),post:(e,t)=>B(ue,e,{method:"POST",body:JSON.stringify(t)}),put:(e,t)=>B(ue,e,{method:"PUT",body:JSON.stringify(t)}),delete:e=>B(ue,e,{method:"DELETE"}),fetchBlob:async e=>{const t=m.token(),r={};t&&(r.Authorization=`Bearer ${t}`);const a=await fetch(`${ue}${e}`,{headers:r});if(!a.ok)throw new Error(`Error ${a.status}`);return a.blob()}},O={get:e=>B(Be,e),post:(e,t)=>B(Be,e,{method:"POST",body:JSON.stringify(t)})},w={get:e=>B(ye,e),post:(e,t)=>B(ye,e,{method:"POST",body:JSON.stringify(t)}),put:(e,t)=>B(ye,e,{method:"PUT",body:JSON.stringify(t)}),delete:e=>B(ye,e,{method:"DELETE"})},wt=Object.freeze(Object.defineProperty({__proto__:null,AST_URL:Ne,MVC_URL:Re,agendaApi:w,api:g,astApi:O},Symbol.toStringTag,{value:"Module"})),xt={login:(e,t)=>g.post("/auth/login",{usuario:e,contraseña:t})};function p(e,t="info",r=3500){const a=document.getElementById("toast-container"),o=document.createElement("div"),i={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"};o.className=`toast toast-${t}`,o.innerHTML=`<span>${i[t]??"ℹ️"}</span><span>${e}</span>`,a.appendChild(o),setTimeout(()=>{o.classList.add("leaving"),setTimeout(()=>o.remove(),310)},r)}function At(e){e.innerHTML=`
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
    </div>`;const t=e.querySelector("#login-form"),r=e.querySelector("#login-btn"),a=e.querySelector("#eye-btn"),o=e.querySelector("#l-pass"),i=e.querySelector("#login-error"),s=e.querySelector("#error-msg");a.addEventListener("click",()=>{const n=o.type==="password";o.type=n?"text":"password",a.innerHTML=n?'<i class="fas fa-eye-slash"></i>':'<i class="fas fa-eye"></i>'}),t.addEventListener("submit",async n=>{n.preventDefault(),i.classList.remove("show");const l=e.querySelector("#l-user").value.trim(),d=o.value;if(!l||!d){s.textContent="Completa todos los campos",i.classList.add("show");return}r.disabled=!0,r.textContent="Ingresando…";try{const c=await xt.login(l,d);m.save(c),window.location.hash="#/dashboard"}catch(c){s.textContent=c.message||"Credenciales inválidas",i.classList.add("show"),p(s.textContent,"error")}finally{r.disabled=!1,r.innerHTML='<i class="fas fa-sign-in-alt"></i> Iniciar Sesión'}})}const ae={listar:()=>g.get("/visitas"),registrar:e=>g.post("/visitas",e),actualizar:(e,t)=>g.put(`/visitas/${e}`,t),buscarPorDni:e=>g.get(`/visitas/visitante?dni=${encodeURIComponent(e)}`),buscarUsuarios:e=>g.get(`/visitas/usuarios?search=${encodeURIComponent(e)}`)},ge={listar:()=>g.get("/alumnos"),registrar:e=>g.post("/alumnos",e),actualizar:(e,t)=>g.put(`/alumnos/${e}`,t),obtener:e=>g.get(`/alumnos/${e}`),obtenerQrBlob:e=>g.fetchBlob(`/alumnos/${e}/qr`)},Ie={listar:()=>O.get("/asistencia"),registrar:e=>O.post("/asistencia",e),porPersonal:e=>O.get(`/asistencia/personal/${e}`),porFecha:e=>O.get(`/asistencia/fecha?fecha=${e}`),porPersonalYFecha:(e,t)=>O.get(`/asistencia/personal/${e}/fecha?fecha=${t}`)},Rt=()=>new Date().toLocaleDateString("es-PE",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),Ve=()=>new Date().toISOString().split("T")[0],It={REGISTRADO:"badge-blue",EN_CURSO:"badge-yellow",COMPLETADO:"badge-green"};async function Lt(e){e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>I.E.P. — SchoolGuard</h1>
        <div class="sub">Sistema de Registro de Visitas</div>
      </div>
      <div class="date-pill"><i class="fa-thin fa-calendar-clock"></i> ${Rt()}</div>
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

    </div>`;const t=m.token(),r=t?{Authorization:`Bearer ${t}`}:{},a=async(o,i,s={})=>{const n=e.querySelector(`#${i}`);try{const l=await fetch(o,{signal:AbortSignal.timeout(3e3),headers:s});n.classList.add(l.status<500?"online":"offline")}catch{n.classList.add("offline")}};a(`${Re}/api/alumnos`,"dot-mvc",r),a(`${Ne}/api/asistencia`,"dot-ast",r);try{const[o,i]=await Promise.all([ae.listar(),ge.listar()]),s=o.filter(c=>{var u;return(u=c.horaIngreso)==null?void 0:u.startsWith(Ve())}),n=o.filter(c=>c.estadoRegistro==="EN_CURSO");e.querySelector("#s-activos").textContent=n.length,e.querySelector("#s-hoy").textContent=s.length,e.querySelector("#s-alumnos").textContent=i.length,e.querySelector("#footer-count").textContent=`${s.length} hoy`;const l=e.querySelector("#recent-tbody"),d=[...o].reverse().slice(0,5);d.length?l.innerHTML=d.map(c=>`
        <tr>
          <td><strong>${c.nombreVisitante}</strong></td>
          <td class="td-muted">${c.dniVisitante}</td>
          <td>${c.motivo}</td>
          <td class="td-small">${c.horaIngreso?new Date(c.horaIngreso).toLocaleString("es-PE"):"—"}</td>
          <td><span class="badge ${It[c.estadoRegistro]??"badge-gray"}">${c.estadoRegistro??"—"}</span></td>
        </tr>`).join(""):l.innerHTML='<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text3)">No hay registros</td></tr>'}catch{}try{const o=await Ie.porFecha(Ve());e.querySelector("#s-asist").textContent=o.length}catch{e.querySelector("#s-asist").textContent="—"}}function R({title:e,bodyHTML:t,onConfirm:r,confirmText:a="Guardar",danger:o=!1,hideCancelBtn:i=!1,onOpen:s=null,onClose:n=null}){var c;const l=document.createElement("div");l.className="modal-overlay",l.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <h2>${e}</h2>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">${t}</div>
      <div class="modal-footer">
        ${i?"":'<button class="btn btn-outline" id="modal-cancel-btn">Cancelar</button>'}
        <button class="btn ${o?"btn-danger":"btn-primary"}" id="modal-confirm-btn">${a}</button>
      </div>
    </div>`,l.classList.add("active"),document.body.appendChild(l);const d=()=>{n&&n(),l.remove()};return l.querySelector("#modal-close-btn").addEventListener("click",d),(c=l.querySelector("#modal-cancel-btn"))==null||c.addEventListener("click",d),l.querySelector("#modal-confirm-btn").addEventListener("click",()=>{r?r(l,d):d()}),l.addEventListener("click",u=>{u.target===l&&d()}),s&&setTimeout(()=>s(l),0),l}const Tt=["REGISTRADO","EN_CURSO","COMPLETADO"],Ot={REGISTRADO:"badge-blue",EN_CURSO:"badge-yellow",COMPLETADO:"badge-green"},Dt=e=>`<span class="badge ${Ot[e]??"badge-gray"}">${e??"—"}</span>`,qt=e=>e?new Date(e).toLocaleString("es-PE"):"—",Ee=()=>m.hasRole("ADMINISTRADOR","PORTERO","SECRETARIA");let ve=[];async function Ct(e){var t,r;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Registro de Visitas</h1>
        <div class="sub">Control de ingreso de visitantes</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${Ee()?'<button class="btn btn-primary" id="btn-new">+ Nueva Visita</button>':""}
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
              ${Ee()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-count">—</span></div>
      </div>
    </div>`,await Ue(e),(t=e.querySelector("#search"))==null||t.addEventListener("input",a=>{const o=a.target.value.toLowerCase();_e(e,ve.filter(i=>{var s,n,l;return((s=i.nombreVisitante)==null?void 0:s.toLowerCase().includes(o))||((n=i.dniVisitante)==null?void 0:n.toLowerCase().includes(o))||((l=i.motivo)==null?void 0:l.toLowerCase().includes(o))}))}),(r=e.querySelector("#btn-new"))==null||r.addEventListener("click",()=>Ge(e))}async function Ue(e){try{ve=await ae.listar(),e.querySelector("#footer-count").textContent=`${ve.length} registros`,_e(e,ve)}catch(t){p(t.message,"error")}}function _e(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="7">No hay registros</td></tr>';return}r.innerHTML=t.map(a=>{var o;return`
    <tr>
      <td><strong>${a.nombreVisitante}</strong></td>
      <td class="td-muted">${a.dniVisitante}</td>
      <td>${a.motivo}</td>
      <td>${((o=a.usuario)==null?void 0:o.nombre)??"—"}</td>
      <td class="td-small">${qt(a.horaIngreso)}</td>
      <td>${Dt(a.estadoRegistro)}</td>
      ${Ee()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),Ee()&&r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>{Ge(e,ve.find(o=>o.id==a.dataset.id))}))}async function Ge(e,t=null){const r=!!t;let a=[];try{a=await ae.buscarUsuarios("")}catch{}const o=new Date().toISOString().slice(0,16);R({title:r?"✏️ Editar Visita":"+ Nueva Visita",bodyHTML:`
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
            ${a.map(i=>{var s;return`<option value="${i.id}" ${((s=t==null?void 0:t.usuario)==null?void 0:s.id)===i.id?"selected":""}>${i.nombre} (${i.usuario})</option>`}).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" id="m-estado">
            ${Tt.map(i=>`<option value="${i}" ${((t==null?void 0:t.estadoRegistro)??"REGISTRADO")===i?"selected":""}>${i}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Hora Ingreso</label>
          <input class="form-control" type="datetime-local" id="m-hora"
            value="${t!=null&&t.horaIngreso?new Date(t.horaIngreso).toISOString().slice(0,16):o}" />
        </div>
      </div>`,confirmText:r?"Actualizar":"Registrar",onConfirm:async(i,s)=>{const n=i.querySelector("#m-dni").value.trim(),l=i.querySelector("#m-nombre").value.trim(),d=i.querySelector("#m-motivo").value.trim(),c=i.querySelector("#m-usuario").value,u=i.querySelector("#m-estado").value,b=i.querySelector("#m-hora").value;if(!n||!l||!d||!c){p("Completa los campos obligatorios","warning");return}const h={dniVisitante:n,nombreVisitante:l,motivo:d,usuario_id:Number(c),estadoRegistro:u,horaIngreso:b?new Date(b).toISOString():null};try{r?await ae.actualizar(t.id,h):await ae.registrar(h),p(r?"Visita actualizada":"Visita registrada","success"),s(),await Ue(e)}catch(v){p(v.message,"error")}}}),setTimeout(()=>{var i;(i=document.querySelector("#btn-dni"))==null||i.addEventListener("click",async()=>{var n;const s=(n=document.querySelector("#m-dni"))==null?void 0:n.value.trim();if(s)try{const l=await ae.buscarPorDni(s);l?(document.querySelector("#m-nombre").value=l.nombreVisitante??"",p("Datos autocompletados","info")):p("DNI no encontrado","warning")}catch{p("DNI no encontrado","warning")}})},100)}const Se={listar:()=>g.get("/visitantes"),registrar:e=>g.post("/visitantes",e),actualizar:(e,t)=>g.put(`/visitantes/${e}`,t),buscarPorDni:e=>g.get(`/visitantes/buscar?dni=${encodeURIComponent(e)}`)},$e=()=>m.hasRole("ADMINISTRADOR","SECRETARIA");let se=[];async function Mt(e){var t;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Visitantes</h1>
        <div class="sub">Personas externas registradas en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${$e()?'<button class="btn btn-primary" id="btn-new">+ Nuevo Visitante</button>':""}
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
              ${$e()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`,await Qe(e),e.querySelector("#search").addEventListener("input",r=>{const a=r.target.value.toLowerCase();Je(e,se.filter(o=>{var i,s;return((i=o.dniVisitante)==null?void 0:i.toLowerCase().includes(a))||((s=o.nombreVisitante)==null?void 0:s.toLowerCase().includes(a))}))}),(t=e.querySelector("#btn-new"))==null||t.addEventListener("click",()=>Xe(e))}async function Qe(e){try{se=await Se.listar(),e.querySelector("#total").textContent=`${se.length}`,e.querySelector("#footer-lbl").textContent=`${se.length} visitantes registrados`,Je(e,se)}catch(t){p(t.message,"error")}}function Je(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="6">Sin visitantes registrados</td></tr>';return}r.innerHTML=t.map(a=>{var o;return`
    <tr>
      <td class="td-muted" style="font-family:monospace">${a.dniVisitante}</td>
      <td><strong>${a.nombreVisitante}</strong></td>
      <td class="td-muted">${a.telefono??"—"}</td>
      <td class="td-muted">${a.email??"—"}</td>
      <td><span class="badge badge-purple">${((o=a.hijos)==null?void 0:o.length)??0} hijos</span></td>
      ${$e()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),$e()&&r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>Xe(e,se.find(o=>o.id==a.dataset.id))))}function Xe(e,t=null){R({title:t?"✏️ Editar Visitante":"+ Nuevo Visitante",bodyHTML:`
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
      </div>`,confirmText:t?"Actualizar":"Registrar",onConfirm:async(r,a)=>{const o={dniVisitante:r.querySelector("#m-dni").value.trim(),nombreVisitante:r.querySelector("#m-nombre").value.trim(),telefono:r.querySelector("#m-tel").value.trim()||null,email:r.querySelector("#m-email").value.trim()||null};if(!o.dniVisitante||!o.nombreVisitante){p("DNI y nombre son obligatorios","warning");return}try{t?await Se.actualizar(t.id,o):await Se.registrar(o),p(t?"Visitante actualizado":"Visitante registrado","success"),a(),await Qe(e)}catch(i){p(i.message,"error")}}})}const we=()=>m.hasRole("ADMINISTRADOR","SECRETARIA");let oe=[],Ye=[];async function Nt(e){var t;e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1>Alumnos</h1>
        <div class="sub">Estudiantes registrados en el sistema</div>
      </div>
    </div>
    <div class="page-body">
      <div class="action-bar">
        ${we()?'<button class="btn btn-primary" id="btn-new">+ Nuevo Alumno</button>':""}
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
              ${we()?"<th></th>":""}
            </tr></thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-lbl">—</span></div>
      </div>
    </div>`,await We(e),e.querySelector("#search").addEventListener("input",r=>{const a=r.target.value.toLowerCase();Ke(e,oe.filter(o=>{var i,s,n;return((i=o.nombre)==null?void 0:i.toLowerCase().includes(a))||((s=o.grado)==null?void 0:s.toLowerCase().includes(a))||((n=o.seccion)==null?void 0:n.toLowerCase().includes(a))}))}),(t=e.querySelector("#btn-new"))==null||t.addEventListener("click",()=>Ze(e))}async function We(e){try{[oe,Ye]=await Promise.all([ge.listar(),Se.listar()]),e.querySelector("#total").textContent=`${oe.length}`,e.querySelector("#footer-lbl").textContent=`${oe.length} alumnos registrados`,Ke(e,oe)}catch(t){p(t.message,"error")}}function Ke(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="6">Sin alumnos registrados</td></tr>';return}r.innerHTML=t.map(a=>{var s,n;const i=!!((s=a.apoderado)!=null&&s.email)?`<span class="badge badge-green" title="El apoderado ${a.apoderado.nombreVisitante} recibirá notificaciones en ${a.apoderado.email}" style="cursor:default">📧 Email</span>`:'<span class="td-muted" title="El apoderado no tiene email registrado">—</span>';return`
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td><span class="badge badge-blue">${a.grado}</span></td>
      <td><span class="badge badge-gray">${a.seccion}</span></td>
      <td class="td-muted">${((n=a.apoderado)==null?void 0:n.nombreVisitante)??"—"}</td>
      <td>${i}</td>
      <td>
        ${a.codigoQr?`<button class="btn btn-outline btn-sm qr-btn" data-id="${a.id}" data-nombre="${a.nombre}" title="Ver código QR">
               📱 Ver QR
             </button>`:'<span class="td-muted">Sin QR</span>'}
      </td>
      ${we()?`<td><button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button></td>`:""}
    </tr>`}).join(""),we()&&r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>Ze(e,oe.find(o=>o.id==a.dataset.id)))),r.querySelectorAll(".qr-btn").forEach(a=>a.addEventListener("click",()=>Pt(a.dataset.id,a.dataset.nombre)))}async function Pt(e,t){let r=null;R({title:`📱 Código QR — ${t}`,bodyHTML:`
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
        <div id="qr-loading" style="color:var(--text2);font-size:13px">Cargando QR…</div>
        <img id="qr-img" style="display:none;border-radius:12px;border:3px solid var(--border);
          box-shadow:0 4px 24px rgba(0,0,0,0.15);width:220px;height:220px;object-fit:contain" />
        <p style="font-size:12px;color:var(--text3);text-align:center;max-width:240px">
          Muestra este código en la entrada para registrar la asistencia del alumno.
        </p>
        <button class="btn btn-outline btn-sm" id="btn-download-qr">⬇ Descargar QR</button>
      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:async a=>{try{const o=await ge.obtenerQrBlob(e);r=URL.createObjectURL(o);const i=a.querySelector("#qr-img");i.src=r,i.style.display="block",a.querySelector("#qr-loading").style.display="none",a.querySelector("#btn-download-qr").addEventListener("click",()=>{const s=document.createElement("a");s.href=r,s.download=`qr-alumno-${t.replace(/\s+/g,"-")}.png`,s.click()})}catch{a.querySelector("#qr-loading").textContent="Error al cargar el QR",p("No se pudo cargar el código QR","error")}},onClose:()=>{r&&URL.revokeObjectURL(r)}})}function Ze(e,t=null){const r=Ye.map(a=>{var o;return`<option value="${a.id}" ${((o=t==null?void 0:t.apoderado)==null?void 0:o.id)===a.id?"selected":""}>${a.nombreVisitante} (${a.dniVisitante})</option>`}).join("");R({title:t?"✏️ Editar Alumno":"+ Nuevo Alumno",bodyHTML:`
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
      </div>`,confirmText:t?"Actualizar":"Registrar",onConfirm:async(a,o)=>{const i={nombre:a.querySelector("#m-nombre").value.trim(),grado:a.querySelector("#m-grado").value.trim(),seccion:a.querySelector("#m-seccion").value.trim(),visitanteId:a.querySelector("#m-apoderado").value||null};if(!i.nombre||!i.grado||!i.seccion){p("Nombre, grado y sección son obligatorios","warning");return}i.visitanteId&&(i.visitanteId=Number(i.visitanteId));try{t?await ge.actualizar(t.id,i):await ge.registrar(i),p(t?"Alumno actualizado":"Alumno registrado — QR generado automáticamente","success"),o(),await We(e)}catch(s){p(s.message,"error")}}})}const ne={listar:()=>g.get("/usuarios"),registrar:e=>g.post("/usuarios",e),actualizar:(e,t)=>g.put(`/usuarios/${e}`,t),eliminar:e=>g.delete(`/usuarios/${e}`)},kt=["ADMINISTRADOR","PORTERO","SECRETARIA","DIRECTOR","PROFESOR"],Ht={ADMINISTRADOR:"badge-red",PORTERO:"badge-blue",SECRETARIA:"badge-green",DIRECTOR:"badge-yellow",PROFESOR:"badge-purple"},Bt=e=>`<span class="badge ${Ht[e]??"badge-gray"}">${e}</span>`;let X=[];async function Vt(e){e.innerHTML=`
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
    </div>`,await Pe(e),e.querySelector("#search").addEventListener("input",t=>{const r=t.target.value.toLowerCase();et(e,X.filter(a=>{var o,i;return((o=a.nombre)==null?void 0:o.toLowerCase().includes(r))||((i=a.usuario)==null?void 0:i.toLowerCase().includes(r))}))}),e.querySelector("#btn-new").addEventListener("click",()=>tt(e))}async function Pe(e){try{X=await ne.listar(),e.querySelector("#total").textContent=`${X.length}`,e.querySelector("#footer-lbl").textContent=`${X.length} usuarios`,et(e,X)}catch(t){p(t.message,"error")}}function et(e,t){const r=e.querySelector("#tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="4">Sin usuarios registrados</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombre}</strong></td>
      <td class="td-muted" style="font-family:monospace">@${a.usuario}</td>
      <td>${Bt(a.rol)}</td>
      <td style="display:flex;gap:6px;padding:10px 16px">
        <button class="btn btn-outline btn-sm edit-btn" data-id="${a.id}">✏️ Editar</button>
        <button class="btn btn-danger  btn-sm del-btn"  data-id="${a.id}">🗑 Eliminar</button>
      </td>
    </tr>`).join(""),r.querySelectorAll(".edit-btn").forEach(a=>a.addEventListener("click",()=>tt(e,X.find(o=>o.id==a.dataset.id)))),r.querySelectorAll(".del-btn").forEach(a=>a.addEventListener("click",()=>jt(e,X.find(o=>o.id==a.dataset.id))))}function tt(e,t=null){const r=kt.map(a=>`<option value="${a}" ${(t==null?void 0:t.rol)===a?"selected":""}>${a}</option>`).join("");R({title:t?"✏️ Editar Usuario":"+ Nuevo Usuario",bodyHTML:`
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
      </div>`,confirmText:t?"Actualizar":"Crear Usuario",onConfirm:async(a,o)=>{const i={nombre:a.querySelector("#m-nombre").value.trim(),usuario:a.querySelector("#m-usuario").value.trim(),contraseña:a.querySelector("#m-pass").value,rol:a.querySelector("#m-rol").value};if(!i.nombre||!i.usuario||!i.rol){p("Nombre, usuario y rol son obligatorios","warning");return}if(!t&&!i.contraseña){p("La contraseña es obligatoria","warning");return}try{t?await ne.actualizar(t.id,i):await ne.registrar(i),p(t?"Usuario actualizado":"Usuario creado","success"),o(),await Pe(e)}catch(s){p(s.message,"error")}}})}function jt(e,t){R({title:"🗑 Eliminar Usuario",bodyHTML:`<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${t.nombre}</strong> (@${t.usuario})?<br/>Esta acción no se puede deshacer.</p>`,confirmText:"Eliminar",danger:!0,onConfirm:async(r,a)=>{try{await ne.eliminar(t.id),p("Usuario eliminado","success"),a(),await Pe(e)}catch(o){p(o.message,"error")}}})}const Ft="modulepreload",zt=function(e){return"/"+e},je={},Fe=function(t,r,a){let o=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),n=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));o=Promise.allSettled(r.map(l=>{if(l=zt(l),l in je)return;je[l]=!0;const d=l.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":Ft,d||(u.as="script"),u.crossOrigin="",u.href=l,n&&u.setAttribute("nonce",n),document.head.appendChild(u),d)return new Promise((b,h)=>{u.addEventListener("load",b),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(s){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=s,window.dispatchEvent(n),!n.defaultPrevented)throw s}return o.then(s=>{for(const n of s||[])n.status==="rejected"&&i(n.reason);return t().catch(i)})},ke={registrar:e=>O.post("/asistencia/alumnos",e),listar:()=>O.get("/asistencia/alumnos"),obtenerPorId:e=>O.get(`/asistencia/alumnos/${e}`),porAlumno:e=>O.get(`/asistencia/alumnos/alumno/${e}`),porFecha:e=>O.get(`/asistencia/alumnos/fecha?fecha=${e}`),porAlumnoYFecha:(e,t)=>O.get(`/asistencia/alumnos/alumno/${e}/fecha?fecha=${t}`),porGradoYFecha:(e,t)=>O.get(`/asistencia/alumnos/grado/${encodeURIComponent(e)}/fecha?fecha=${t}`)},ie=()=>new Date().toISOString().split("T")[0],at=e=>e?new Date(e).toLocaleString("es-PE"):"—",st=e=>e==="ENTRADA"?'<span class="badge badge-green">▶ ENTRADA</span>':'<span class="badge badge-red">◀ SALIDA</span>';let z=[],U=[],ot=[],ee="personal";async function Ut(e){var r,a,o,i,s,n;const t=m.hasRole("ADMINISTRADOR","PORTERO","SECRETARIA");e.innerHTML=`
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
                <input type="date" id="filter-fecha" value="${ie()}"
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
                <input type="date" id="filter-fecha-alumnos" value="${ie()}"
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

    </div>`,e.querySelectorAll(".tab-btn").forEach(l=>{l.addEventListener("click",()=>{ee=l.dataset.tab,e.querySelectorAll(".tab-btn").forEach(d=>{d.classList.toggle("active",d.dataset.tab===ee),d.classList.toggle("btn-primary",d.dataset.tab===ee),d.classList.toggle("btn-outline",d.dataset.tab!==ee)}),e.querySelector("#section-personal").style.display=ee==="personal"?"":"none",e.querySelector("#section-alumnos").style.display=ee==="alumnos"?"":"none"})});try{ot=await ne.listar()}catch{}await qe(e,ie()),(r=e.querySelector("#btn-filter"))==null||r.addEventListener("click",()=>{const l=e.querySelector("#filter-fecha").value;l&&qe(e,l)}),(a=e.querySelector("#btn-all"))==null||a.addEventListener("click",()=>_t(e)),(o=e.querySelector("#btn-new"))==null||o.addEventListener("click",()=>Gt(e)),await Ce(e,ie()),(i=e.querySelector("#btn-filter-alumnos"))==null||i.addEventListener("click",()=>{const l=e.querySelector("#filter-fecha-alumnos").value;l&&Ce(e,l)}),(s=e.querySelector("#btn-all-alumnos"))==null||s.addEventListener("click",()=>Qt(e)),(n=e.querySelector("#btn-scan-qr"))==null||n.addEventListener("click",()=>Jt(e))}async function qe(e,t){try{z=await Ie.porFecha(t),e.querySelector("#total-personal").textContent=`${z.length}`,e.querySelector("#footer-personal").textContent=`${z.length} registros`,it(e,z)}catch{p("No se pudo conectar al servicio de asistencia (puerto 8081)","error")}}async function _t(e){try{z=await Ie.listar(),e.querySelector("#total-personal").textContent=`${z.length}`,e.querySelector("#footer-personal").textContent=`${z.length} registros totales`,it(e,z)}catch(t){p(t.message,"error")}}function it(e,t){const r=e.querySelector("#tbody-personal");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="5">Sin registros para este filtro</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombrePersonal}</strong></td>
      <td><span class="badge badge-purple">${a.rolPersonal}</span></td>
      <td>${st(a.tipoEvento)}</td>
      <td class="td-small">${at(a.horaEvento)}</td>
      <td class="td-muted">${a.observaciones??"—"}</td>
    </tr>`).join("")}function Gt(e){const t=ot.map(a=>`<option value="${a.id}" data-nombre="${a.nombre}" data-rol="${a.rol}">${a.nombre} — ${a.rol}</option>`).join(""),r=new Date().toISOString().slice(0,16);R({title:"+ Registrar Asistencia — Personal",bodyHTML:`
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
      </div>`,confirmText:"Registrar",onConfirm:async(a,o)=>{const i=a.querySelector("#m-usuario"),s=i.options[i.selectedIndex],n=i.value;if(!n){p("Selecciona un miembro del personal","warning");return}const l={usuarioId:Number(n),nombrePersonal:s.dataset.nombre,rolPersonal:s.dataset.rol,tipoEvento:a.querySelector("#m-tipo").value,horaEvento:a.querySelector("#m-hora").value?new Date(a.querySelector("#m-hora").value).toISOString():null,observaciones:a.querySelector("#m-obs").value.trim()||null};try{await Ie.registrar(l),p("Asistencia registrada","success"),o();const d=e.querySelector("#filter-fecha").value||ie();await qe(e,d)}catch(d){p(d.message,"error")}}})}async function Ce(e,t){try{U=await ke.porFecha(t),e.querySelector("#total-alumnos").textContent=`${U.length}`,e.querySelector("#footer-alumnos").textContent=`${U.length} registros`,rt(e,U)}catch{p("No se pudo cargar asistencia de alumnos","error")}}async function Qt(e){try{U=await ke.listar(),e.querySelector("#total-alumnos").textContent=`${U.length}`,e.querySelector("#footer-alumnos").textContent=`${U.length} registros totales`,rt(e,U)}catch(t){p(t.message,"error")}}function rt(e,t){const r=e.querySelector("#tbody-alumnos");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="6">Sin registros para este filtro</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td><strong>${a.nombreAlumno}</strong></td>
      <td><span class="badge badge-blue">${a.grado??"—"}</span></td>
      <td><span class="badge badge-gray">${a.seccion??"—"}</span></td>
      <td>${st(a.tipoEvento)}</td>
      <td class="td-small">${at(a.horaEvento)}</td>
      <td class="td-muted">${a.observaciones??"—"}</td>
    </tr>`).join("")}function Jt(e){const t="qr-reader-"+Date.now();let r=null,a=!1;R({title:"📷 Escanear QR del Alumno",bodyHTML:`
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
      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:async s=>{try{const{Html5Qrcode:n}=await Fe(async()=>{const{Html5Qrcode:d}=await import("./index-BNMS5zO2.js");return{Html5Qrcode:d}},[]);r=new n(t);const l={fps:10,qrbox:{width:220,height:220}};await r.start({facingMode:"environment"},l,d=>i(s,d),()=>{}),a=!0,s.querySelector("#scan-status").textContent="Esperando QR…"}catch(n){s.querySelector("#scan-status").textContent="No se pudo acceder a la cámara. "+(n.message||""),p("Error al iniciar la cámara","error")}},onClose:async()=>{if(r&&a)try{await r.stop()}catch{}}});let o=null;async function i(s,n){if(n!==o){if(o=n,r&&a)try{await r.pause()}catch{}s.querySelector("#scan-status").textContent="QR detectado — verificando alumno…";try{const{api:l}=await Fe(async()=>{const{api:c}=await Promise.resolve().then(()=>wt);return{api:c}},void 0),d=await l.get(`/alumnos/qr/${n}`);s.querySelector("#scan-result").style.display="block",s.querySelector("#scan-nombre").textContent="🎒 "+d.nombre,s.querySelector("#scan-badges").innerHTML=`
        <span class="badge badge-blue">${d.grado}</span>
        <span class="badge badge-gray">${d.seccion}</span>`,s.querySelector("#scan-actions").style.display="block",s.querySelector("#scan-status").textContent="Selecciona el tipo de evento:",s.querySelector("#btn-entrada-qr").onclick=()=>ze(s,n,"ENTRADA",e),s.querySelector("#btn-salida-qr").onclick=()=>ze(s,n,"SALIDA",e)}catch{if(s.querySelector("#scan-status").textContent="❌ QR inválido — alumno no encontrado",p("QR no corresponde a ningún alumno","error"),o=null,r&&a)try{await r.resume()}catch{}}}}}async function ze(e,t,r,a){var s,n,l;const o=((n=(s=e.querySelector("#scan-obs"))==null?void 0:s.value)==null?void 0:n.trim())||null,i={codigoQr:t,tipoEvento:r,horaEvento:null,registradoPorId:m.id()?Number(m.id()):null,observaciones:o};try{await ke.registrar(i),p(`${r} del alumno registrada correctamente`,"success"),e.remove();const d=((l=a.querySelector("#filter-fecha-alumnos"))==null?void 0:l.value)||ie();await Ce(a,d)}catch(d){p(d.message||"Error al registrar asistencia","error")}}const N={listarTodos:()=>w.get("/agenda"),listarPorProfesor:e=>w.get(`/agenda/profesor/${e}`),listarPorFecha:e=>w.get(`/agenda/fecha?fecha=${e}`),listarPorProfesorFecha:(e,t)=>w.get(`/agenda/profesor/${e}/fecha?fecha=${t}`),listarPorEstado:(e,t)=>w.get(`/agenda/profesor/${e}/estado/${t}`),listarRecurrentes:e=>w.get(`/agenda/recurrentes/${e}`),crear:e=>w.post("/agenda",e),actualizar:(e,t)=>w.put(`/agenda/${e}`,t),eliminar:e=>w.delete(`/agenda/${e}`),listarHorarios:()=>w.get("/horarios"),listarHorariosPorProfesor:e=>w.get(`/horarios/profesor/${e}`),listarHorariosPorDia:e=>w.get(`/horarios/dia/${e}`),crearHorario:e=>w.post("/horarios",e),actualizarHorario:(e,t)=>w.put(`/horarios/${e}`,t),eliminarHorario:e=>w.delete(`/horarios/${e}`)},nt=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Xt=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],lt=["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"],K={HORARIO_ATENCION:{bg:"#6366f1",light:"#eef2ff",text:"#4338ca",label:"Atención"},REUNION:{bg:"#f59e0b",light:"#fffbeb",text:"#b45309",label:"Reunión"},ACTIVIDAD:{bg:"#10b981",light:"#ecfdf5",text:"#047857",label:"Actividad"},OTRO:{bg:"#64748b",light:"#f1f5f9",text:"#334155",label:"Otro"}},he={ACTIVO:{bg:"#dcfce7",text:"#16a34a",label:"Activo"},CANCELADO:{bg:"#fee2e2",text:"#dc2626",label:"Cancelado"},COMPLETADO:{bg:"#e0e7ff",text:"#4338ca",label:"Completado"}},xe=e=>e?new Date(e).toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}):"—",Yt=e=>e?new Date(e).toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}):"—",Ae=e=>e.toISOString().split("T")[0];let F=new Date().getFullYear(),C=new Date().getMonth(),j=[],Z=[],x=null,De="calendario";async function Wt(e){const t=m.hasRole("ADMINISTRADOR","DIRECTOR","PROFESOR"),r=m.hasRole("ADMINISTRADOR","DIRECTOR");e.innerHTML=Kt(t,r),Zt(e);const a=m.hasRole("PROFESOR")?m.id():null;await le(a),_(e),W(e),ea(e)}function Kt(e,t){const r=m.hasRole("PROFESOR");return`
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
          ${Object.entries(K).map(([a,o])=>`
            <div class="legend-item">
              <span class="legend-dot" style="background:${o.bg}"></span>
              <span>${o.label}</span>
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
  </div>`}async function le(e=null){try{const[t,r]=await Promise.all([e?N.listarPorProfesor(e):N.listarTodos(),e?N.listarHorariosPorProfesor(e):N.listarHorarios()]);j=t||[],Z=r||[]}catch(t){p(`Error cargando datos: ${t.message}`,"error"),j=[],Z=[]}}function _(e){const t=e.querySelector("#cal-month-label"),r=e.querySelector("#cal-grid");if(!t||!r)return;t.textContent=`${nt[C]} ${F}`;const a=new Date(F,C,1).getDay(),o=new Date(F,C+1,0).getDate(),i=new Date;let s=Xt.map(n=>`<div class="cal-day-header">${n}</div>`).join("");for(let n=0;n<a;n++)s+='<div class="cal-cell cal-empty"></div>';for(let n=1;n<=o;n++){const l=new Date(F,C,n),d=Ae(l),c=n===i.getDate()&&C===i.getMonth()&&F===i.getFullYear(),u=x===d,b=j.filter(v=>{const E=new Date(v.fechaInicio);return E.getFullYear()===F&&E.getMonth()===C&&E.getDate()===n}),h=[...new Set(b.map(v=>v.tipoAgenda))].slice(0,3).map(v=>{var E;return`<span class="cal-dot" style="background:${((E=K[v])==null?void 0:E.bg)??"#888"}"></span>`}).join("");s+=`
      <div class="cal-cell ${c?"cal-today":""} ${u?"cal-selected":""} ${b.length?"cal-has-events":""}"
           data-date="${d}" data-count="${b.length}">
        <span class="cal-day-num">${n}</span>
        <div class="cal-dots">${h}</div>
      </div>`}r.innerHTML=s,r.querySelectorAll(".cal-cell[data-date]").forEach(n=>{n.addEventListener("click",()=>{x=n.dataset.date,_(e),Y(e,x)})})}function Y(e,t){const r=e.querySelector("#day-events-title"),a=e.querySelector("#day-events-list");if(!r||!a)return;const o=new Date(t+"T00:00:00");r.innerHTML=`<i class="fas fa-calendar-day"></i>
    Eventos del ${o.getDate()} de ${nt[o.getMonth()]} ${o.getFullYear()}`;const i=j.filter(s=>{const n=new Date(s.fechaInicio);return Ae(n)===t});if(!i.length){a.innerHTML='<div class="day-empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>';return}a.innerHTML=i.map(s=>{const n=K[s.tipoAgenda]??K.OTRO,l=he[s.estado]??he.ACTIVO;return`
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
          <span><i class="fas fa-clock"></i> ${xe(s.fechaInicio)} – ${xe(s.fechaFin)}</span>
          ${s.lugar?`<span><i class="fas fa-location-dot"></i> ${s.lugar}</span>`:""}
          ${s.recurrente?`<span><i class="fas fa-rotate"></i> Recurrente — ${s.diaSemana??""}</span>`:""}
        </div>
        ${s.descripcion?`<div class="day-event-desc">${s.descripcion}</div>`:""}
      </div>`}).join("")}function re(e,t=""){const r=e.querySelector("#eventos-tbody");if(!r)return;const a=m.hasRole("ADMINISTRADOR","DIRECTOR","PROFESOR"),o=m.hasRole("ADMINISTRADOR","DIRECTOR");let i=j;if(t){const s=t.toLowerCase();i=i.filter(n=>{var l,d,c;return((l=n.nombreProfesor)==null?void 0:l.toLowerCase().includes(s))||((d=n.titulo)==null?void 0:d.toLowerCase().includes(s))||((c=n.especialidad)==null?void 0:c.toLowerCase().includes(s))})}if(!i.length){r.innerHTML=`<tr><td colspan="8" class="text-center" style="padding:30px;color:var(--text3)">
      <i class="fas fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:6px"></i>
      Sin eventos registrados
    </td></tr>`;return}r.innerHTML=i.map(s=>{const n=K[s.tipoAgenda]??K.OTRO,l=he[s.estado]??he.ACTIVO;return`
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
        <td>${Yt(s.fechaInicio)}</td>
        <td style="font-variant-numeric:tabular-nums;font-size:13px">
          ${xe(s.fechaInicio)} – ${xe(s.fechaFin)}
        </td>
        <td><span class="badge-estado" style="background:${l.bg};color:${l.text}">${l.label}</span></td>
        <td style="color:var(--text2);font-size:13px">${s.lugar??"—"}</td>
        ${a?`
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline btn-edit-evento" data-id="${s.id}"
              title="Editar"><i class="fas fa-pen"></i></button>
            ${o?`
            <button class="btn btn-sm btn-danger btn-del-evento" data-id="${s.id}"
              title="Eliminar"><i class="fas fa-trash"></i></button>`:""}
          </div>
        </td>`:""}
      </tr>`}).join(""),e.querySelectorAll(".btn-edit-evento").forEach(s=>{s.addEventListener("click",()=>{const n=j.find(l=>l.id==s.dataset.id);n&&dt(e,n)})}),e.querySelectorAll(".btn-del-evento").forEach(s=>{s.addEventListener("click",()=>pt(e,s.dataset.id,"evento"))})}function W(e,t=""){const r=e.querySelector("#horario-week-grid");if(!r)return;const a=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"],o={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},i=m.hasRole("ADMINISTRADOR","DIRECTOR"),s=t?[t]:a,n=Z;if(!n.length){r.innerHTML=`<div class="day-empty" style="padding:40px;text-align:center">
      <i class="fas fa-calendar-week" style="font-size:2rem;color:var(--text3);display:block;margin-bottom:10px"></i>
      <span style="color:var(--text3)">Sin horarios registrados</span>
    </div>`;return}r.innerHTML=s.map(l=>{const d=n.filter(c=>c.diaSemana===l&&c.activo);return d.length?`
      <div class="week-day-col">
        <div class="week-day-header">${o[l]}</div>
        <div class="week-day-body">
          ${d.map(c=>{var u,b;return`
            <div class="week-block" style="border-left:4px solid var(--primary)">
              <div class="week-block-time">${((u=c.horaInicio)==null?void 0:u.slice(0,5))??""} – ${((b=c.horaFin)==null?void 0:b.slice(0,5))??""}</div>
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
      </div>`:""}).join(""),e.querySelectorAll(".btn-edit-horario").forEach(l=>{l.addEventListener("click",()=>{const d=Z.find(c=>c.id==l.dataset.id);d&&ct(e,d)})}),e.querySelectorAll(".btn-del-horario").forEach(l=>{l.addEventListener("click",()=>pt(e,l.dataset.id,"horario"))})}function Zt(e){e.addEventListener("click",t=>{const r=t.target.closest(".agenda-tab");r&&(De=r.dataset.tab,e.querySelectorAll(".agenda-tab").forEach(a=>a.classList.toggle("active",a===r)),e.querySelectorAll(".tab-content").forEach(a=>{a.style.display=a.id===`tab-${De}`?"":"none"}),De==="horarios"&&W(e))})}function ea(e,t,r){var a,o,i,s,n,l,d,c;(a=e.querySelector("#cal-prev"))==null||a.addEventListener("click",()=>{C===0?(C=11,F--):C--,_(e),x&&Y(e,x)}),(o=e.querySelector("#cal-next"))==null||o.addEventListener("click",()=>{C===11?(C=0,F++):C++,_(e),x&&Y(e,x)}),(i=e.querySelector("#btn-filter-prof"))==null||i.addEventListener("click",async()=>{var b,h;const u=(h=(b=e.querySelector("#filter-profesor"))==null?void 0:b.value)==null?void 0:h.trim();await le(u?Number(u):null),_(e),re(e),W(e),x&&Y(e,x)}),(s=e.querySelector("#btn-clear-filter"))==null||s.addEventListener("click",async()=>{const u=e.querySelector("#filter-profesor");u&&(u.value=""),await le(null),_(e),re(e),W(e),x&&Y(e,x)}),(n=e.querySelector("#search-eventos"))==null||n.addEventListener("input",u=>{re(e,u.target.value)}),(l=e.querySelector("#filter-dia"))==null||l.addEventListener("change",u=>{W(e,u.target.value)}),(d=e.querySelector("#btn-new-evento"))==null||d.addEventListener("click",()=>{dt(e,null)}),(c=e.querySelector("#btn-new-horario"))==null||c.addEventListener("click",()=>{ct(e,null)}),re(e)}function dt(e,t){const r=!!t,a=r?"Editar Evento de Agenda":"Nuevo Evento de Agenda",o=m.hasRole("PROFESOR"),i=(t==null?void 0:t.profesorId)??(o?m.id():""),s=(t==null?void 0:t.nombreProfesor)??(o?m.nombre():""),n=d=>d?d.replace("T","T").substring(0,16):"",l=`
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
              value="${s}" autocomplete="off" ${o?"disabled":""}/>
          </div>
          <div class="profesor-search-dropdown" id="ev-profesor-dropdown"></div>
          <input type="hidden" id="ev-profesorId" value="${i}"/>
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
          ${Object.entries(K).map(([d,c])=>`<option value="${d}" ${(t==null?void 0:t.tipoAgenda)===d?"selected":""}>${c.label}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Fecha del Evento *</label>
        <input id="ev-fecha" type="date" class="form-input" value="${t?Ae(new Date(t.fechaInicio)):x??Ae(new Date)}"/>
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
          ${lt.map(d=>`<option value="${d}" ${(t==null?void 0:t.diaSemana)===d?"selected":""}>${d.charAt(0)+d.slice(1).toLowerCase()}</option>`).join("")}
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label>Descripción</label>
        <textarea id="ev-descripcion" class="form-input" rows="3" placeholder="Descripción opcional…">${(t==null?void 0:t.descripcion)??""}</textarea>
      </div>
    </div>`;R({title:a,bodyHTML:l,onConfirm:async(d,c)=>{const u={profesorId:Number(document.getElementById("ev-profesorId").value),nombreProfesor:document.getElementById("ev-nombreProfesor").value.trim(),especialidad:document.getElementById("ev-especialidad").value.trim()||null,titulo:document.getElementById("ev-titulo").value.trim(),descripcion:document.getElementById("ev-descripcion").value.trim()||null,fechaInicio:document.getElementById("ev-inicio").value,fechaFin:document.getElementById("ev-fin").value,tipoAgenda:document.getElementById("ev-tipo").value,estado:document.getElementById("ev-estado").value,lugar:document.getElementById("ev-lugar").value.trim()||null,recurrente:document.getElementById("ev-recurrente").checked,diaSemana:document.getElementById("ev-recurrente").checked?document.getElementById("ev-diaSemana").value:null};if(!u.profesorId||!u.nombreProfesor||!u.titulo||!u.fechaInicio||!u.fechaFin){p("Completa los campos obligatorios (*)","error");return}try{r?(await N.actualizar(t.id,u),p("Evento actualizado correctamente","success")):(await N.crear(u),p("Evento creado correctamente","success"));const b=m.hasRole("PROFESOR")?m.id():null;await le(b),_(e),re(e),x&&Y(e,x),c()}catch(b){p(`Error: ${b.message}`,"error")}}}),setTimeout(()=>{var v,E,Q,P;const d=y=>{if(!y)return"";const[$,S,A]=y.split("-").map(Number),T=new Date($,S-1,A).getDay();return["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"][T]},c=y=>{const S={DOMINGO:0,LUNES:1,MARTES:2,MIERCOLES:3,JUEVES:4,VIERNES:5,SABADO:6}[y];if(S===void 0)return null;const A=new Date,k=A.getDay();let T=S-k;T<0&&(T+=7);const I=new Date(A.getFullYear(),A.getMonth(),A.getDate()+T),D=I.getFullYear(),V=String(I.getMonth()+1).padStart(2,"0"),M=String(I.getDate()).padStart(2,"0");return`${D}-${V}-${M}`},u=(y=!1)=>{const $=document.getElementById("ev-horario-select");if(!$)return;const S=$.options[$.selectedIndex],A=document.getElementById("ev-fecha"),k=document.getElementById("ev-inicio"),T=document.getElementById("ev-fin");if(S&&S.dataset.dia){const D=S.dataset.dia;if(!y&&A){const V=c(D);V&&(A.value=V)}}const I=A==null?void 0:A.value;if(I&&S&&S.dataset.inicio&&S.dataset.fin){const D=S.dataset.inicio,V=S.dataset.fin;k&&(k.value=`${I}T${D}`),T&&(T.value=`${I}T${V}`);const M=S.dataset.dia,J=document.getElementById("ev-diaSemana");M&&J&&(J.value=M);const f=S.dataset.materia,H=document.getElementById("ev-especialidad");f&&H&&(H.value=f);const L=document.getElementById("ev-fecha-warning");if(M){const q=d(I);if(q!==M){const ce={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},Le=ce[M]||M,Te=ce[q]||q;L&&(L.innerHTML=`<i class="fas fa-exclamation-triangle"></i> La fecha seleccionada es <strong>${Te}</strong>, pero el horario seleccionado es para los <strong>${Le}</strong>.`,L.style.display="block")}else L&&(L.style.display="none",L.innerHTML="")}else L&&(L.style.display="none",L.innerHTML="")}else{k&&(k.value=""),T&&(T.value="");const D=document.getElementById("ev-fecha-warning");D&&(D.style.display="none",D.innerHTML="")}},b=async y=>{var S,A,k;const $=document.getElementById("ev-horario-select");if($){$.innerHTML='<option value="">Cargando horarios...</option>';try{const I=(await N.listarHorariosPorProfesor(y)||[]).filter(f=>f.activo),D=((S=j.find(f=>f.profesorId==y&&f.especialidad))==null?void 0:S.especialidad)||((A=I.find(f=>f.materia))==null?void 0:A.materia)||((k=Z.find(f=>f.profesorId==y&&f.materia))==null?void 0:k.materia)||"",V=document.getElementById("ev-especialidad");if(V&&D&&(V.value=D),I.length===0){$.innerHTML='<option value="">El profesor no tiene horarios registrados</option>',u(!0);return}const M={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"};let J='<option value="">Seleccione un horario...</option>';if(I.forEach(f=>{const H=f.horaInicio.slice(0,5),L=f.horaFin.slice(0,5),q=M[f.diaSemana]||f.diaSemana;let ce=!1;if(t){const Le=n(t.fechaInicio).split("T")[1],Te=n(t.fechaFin).split("T")[1];Le===H&&Te===L&&f.diaSemana===t.diaSemana&&(ce=!0)}J+=`<option value="${f.id}" data-inicio="${H}" data-fin="${L}" data-dia="${f.diaSemana}" data-materia="${f.materia}" ${ce?"selected":""}>
            ${q}: ${H} - ${L} (${f.materia}${f.aula?" · "+f.aula:""})
          </option>`}),t){const f=n(t.fechaInicio).split("T")[1],H=n(t.fechaFin).split("T")[1];if(!I.some(q=>q.horaInicio.slice(0,5)===f&&q.horaFin.slice(0,5)===H&&q.diaSemana===t.diaSemana)){const q=M[t.diaSemana]||t.diaSemana||"";J=`<option value="original" data-inicio="${f}" data-fin="${H}" data-dia="${t.diaSemana}" selected>
              [Horario Original] ${q?q+": ":""}${f} - ${H}
            </option>`+J}}$.innerHTML=J,u(!0)}catch(T){$.innerHTML='<option value="">Error al cargar horarios</option>',console.error(T)}}};ut("ev-profesor-search","ev-profesor-dropdown","ev-profesorId","ev-nombreProfesor",async y=>{if(y)await b(y);else{const $=document.getElementById("ev-horario-select");$&&($.innerHTML='<option value="">Seleccione un profesor primero...</option>'),u(!0)}}),(v=document.getElementById("ev-recurrente"))==null||v.addEventListener("change",y=>{document.getElementById("dia-semana-group").style.display=y.target.checked?"":"none"}),(E=document.getElementById("ev-fecha"))==null||E.addEventListener("change",()=>u(!0)),(Q=document.getElementById("ev-horario-select"))==null||Q.addEventListener("change",()=>u(!1));const h=(P=document.getElementById("ev-profesorId"))==null?void 0:P.value;h&&b(h)},50)}function ct(e,t){var l,d;const r=!!t,a=r?"Editar Horario Semanal":"Nuevo Horario Semanal",o=m.hasRole("PROFESOR"),i=(t==null?void 0:t.profesorId)??(o?m.id():""),s=(t==null?void 0:t.nombreProfesor)??(o?m.nombre():""),n=`
    <div class="form-grid-2">
      <div class="form-group" style="grid-column:1/-1">
        <label>Profesor *</label>
        <div class="profesor-search-wrap" id="h-profesor-wrap">
          <div class="profesor-search-input-row">
            <i class="fas fa-search profesor-search-icon"></i>
            <input id="h-profesor-search" class="form-input profesor-search-input"
              placeholder="Escribe el nombre del profesor…"
              value="${s}" autocomplete="off" ${o?"disabled":""}/>
          </div>
          <div class="profesor-search-dropdown" id="h-profesor-dropdown"></div>
          <input type="hidden" id="h-profesorId" value="${i}"/>
          <input type="hidden" id="h-nombreProfesor" value="${s}"/>
        </div>
      </div>
      <div class="form-group">
        <label>Día de la semana *</label>
        <select id="h-dia" class="form-select">
          ${lt.map(c=>`<option value="${c}" ${(t==null?void 0:t.diaSemana)===c?"selected":""}>${c.charAt(0)+c.slice(1).toLowerCase()}</option>`).join("")}
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
    </div>`;R({title:a,bodyHTML:n,onConfirm:async(c,u)=>{const b={profesorId:Number(document.getElementById("h-profesorId").value),nombreProfesor:document.getElementById("h-nombreProfesor").value.trim(),diaSemana:document.getElementById("h-dia").value,horaInicio:document.getElementById("h-inicio").value,horaFin:document.getElementById("h-fin").value,materia:document.getElementById("h-materia").value.trim(),aula:document.getElementById("h-aula").value.trim()||null,activo:document.getElementById("h-activo").checked,observaciones:document.getElementById("h-obs").value.trim()||null};if(!b.profesorId||!b.nombreProfesor||!b.horaInicio||!b.horaFin||!b.materia){p("Completa los campos obligatorios (*)","error");return}try{r?(await N.actualizarHorario(t.id,b),p("Horario actualizado correctamente","success")):(await N.crearHorario(b),p("Horario creado correctamente","success"));const h=m.hasRole("PROFESOR")?m.id():null;await le(h),W(e),u()}catch(h){p(`Error: ${h.message}`,"error")}}}),setTimeout(()=>{var c,u;if(ut("h-profesor-search","h-profesor-dropdown","h-profesorId","h-nombreProfesor",b=>{var h,v;if(b){const E=((h=Z.find(P=>P.profesorId==b&&P.materia))==null?void 0:h.materia)||((v=j.find(P=>P.profesorId==b&&P.especialidad))==null?void 0:v.especialidad)||"",Q=document.getElementById("h-materia");Q&&E&&(Q.value=E)}}),o&&!t){const b=((c=Z.find(v=>v.profesorId==m.id()&&v.materia))==null?void 0:c.materia)||((u=j.find(v=>v.profesorId==m.id()&&v.especialidad))==null?void 0:u.especialidad)||"",h=document.getElementById("h-materia");h&&b&&(h.value=b)}},50)}async function ut(e,t,r,a,o){const i=document.getElementById(e),s=document.getElementById(t),n=document.getElementById(r),l=document.getElementById(a);if(!i||!s||m.hasRole("PROFESOR"))return;let d=[];try{d=(await ne.listar()||[]).filter(b=>b.rol==="PROFESOR")}catch{}function c(u){const b=u.trim().toLowerCase(),h=b?d.filter(v=>{var E;return(E=v.nombre)==null?void 0:E.toLowerCase().includes(b)}):d;if(!h.length){s.innerHTML='<div class="profesor-no-result"><i class="fas fa-user-slash"></i> Sin resultados</div>',s.classList.add("open");return}s.innerHTML=h.map(v=>`
      <div class="profesor-option" data-id="${v.id}" data-nombre="${v.nombre}">
        <span class="profesor-option-avatar">${v.nombre.charAt(0).toUpperCase()}</span>
        <div class="profesor-option-info">
          <span class="profesor-option-name">${v.nombre}</span>
          <span class="profesor-option-role">ID: ${v.id} · Profesor</span>
        </div>
      </div>`).join(""),s.classList.add("open"),s.querySelectorAll(".profesor-option").forEach(v=>{v.addEventListener("mousedown",E=>{E.preventDefault(),n.value=v.dataset.id,l.value=v.dataset.nombre,i.value=v.dataset.nombre,i.classList.add("profesor-selected"),s.classList.remove("open"),s.innerHTML="",typeof o=="function"&&o(v.dataset.id)})})}i.addEventListener("input",()=>{n.value="",l.value="",i.classList.remove("profesor-selected"),c(i.value),typeof o=="function"&&o(null)}),i.addEventListener("focus",()=>{c(i.value)}),i.addEventListener("blur",()=>{setTimeout(()=>{if(s.classList.remove("open"),s.innerHTML="",!n.value&&i.value.trim()){const u=d.find(b=>b.nombre.toLowerCase()===i.value.trim().toLowerCase());u&&(n.value=u.id,l.value=u.nombre,i.classList.add("profesor-selected"),typeof o=="function"&&o(u.id))}},200)})}function pt(e,t,r){R({title:r==="evento"?"Eliminar Evento":"Eliminar Horario",bodyHTML:`<p style="color:var(--text2);line-height:1.6">
    ¿Estás seguro que deseas eliminar este ${r==="evento"?"evento de agenda":"bloque de horario"}?
    <strong>Esta acción no se puede deshacer.</strong>
  </p>`,onConfirm:async(i,s)=>{try{r==="evento"?(await N.eliminar(t),p("Evento eliminado","success")):(await N.eliminarHorario(t),p("Horario eliminado","success"));const n=m.hasRole("PROFESOR")?m.id():null;await le(n),_(e),re(e),W(e),x&&Y(e,x),s()}catch(n){p(`Error: ${n.message}`,"error")}}})}const ta={listar:()=>g.get("/auditoria")};let be=[];const aa={ADMINISTRADOR:"badge-red",PORTERO:"badge-blue",SECRETARIA:"badge-green",DIRECTOR:"badge-yellow",PROFESOR:"badge-purple",SISTEMA:"badge-gray"},sa=e=>`<span class="badge ${aa[e]??"badge-gray"}">${e}</span>`;function oa(e){return e?new Date(e).toLocaleString("es-PE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}):""}async function ia(e){e.innerHTML=`
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
    </div>`,await ra(e);const t=e.querySelector("#aud-search"),r=e.querySelector("#aud-filter-rol"),a=()=>{const o=t.value.toLowerCase().trim(),i=r.value;let s=be;i&&(s=s.filter(n=>n.rol===i)),o&&(s=s.filter(n=>{var l,d,c;return((l=n.usuario)==null?void 0:l.toLowerCase().includes(o))||((d=n.accion)==null?void 0:d.toLowerCase().includes(o))||((c=n.detalles)==null?void 0:c.toLowerCase().includes(o))})),bt(e,s)};t.addEventListener("input",a),r.addEventListener("change",a)}async function ra(e){try{be=await ta.listar(),e.querySelector("#aud-total").textContent=`${be.length}`,e.querySelector("#aud-footer-lbl").textContent=`${be.length} transacciones registradas`,bt(e,be)}catch(t){p(t.message,"error")}}function bt(e,t){const r=e.querySelector("#aud-tbody");if(!t.length){r.innerHTML='<tr class="empty-row"><td colspan="5">Sin transacciones registradas que coincidan</td></tr>';return}r.innerHTML=t.map(a=>`
    <tr>
      <td class="td-muted">${oa(a.fecha)}</td>
      <td><strong>${a.usuario}</strong></td>
      <td>${sa(a.rol)}</td>
      <td><span class="badge badge-yellow" style="font-family:monospace">${a.accion}</span></td>
      <td style="color:var(--text2);font-size:0.92rem;max-width:400px;word-break:break-word">${a.detalles??""}</td>
    </tr>`).join("")}const de={listarAreas:()=>g.get("/inventario/areas"),registrarArea:e=>g.post("/inventario/areas",e),listarArticulos:e=>{const t=e?`?areaId=${e}`:"";return g.get(`/inventario/articulos${t}`)},registrarArticulo:e=>g.post("/inventario/articulos",e),actualizarArticulo:(e,t)=>g.put(`/inventario/articulos/${e}`,t),eliminarArticulo:e=>g.delete(`/inventario/articulos/${e}`),buscarPorCodigo:e=>g.get(`/inventario/articulos/codigo/${e}`)};let te=[],me=[],G=null,fe="";const Me=()=>m.hasRole("ADMINISTRADOR","DIRECTOR","SECRETARIA"),mt={EXCELENTE:"badge-green",BUENO:"badge-blue",REGULAR:"badge-yellow",DETERIORADO:"badge-red",EN_MANTENIMIENTO:"badge-purple"};async function na(e){var t,r;G=null,fe="",e.innerHTML=`
    <div class="page-topbar">
      <div>
        <h1><i class="fas fa-boxes" style="color:var(--primary)"></i> Inventario & Logística</h1>
        <div class="sub">Control de activos por aula e infraestructura</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Me()?`
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
                <th style="width:120px">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbody-articulos">
              <tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Selecciona un área para ver sus ítems</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-card-footer"><span id="footer-inventario">—</span></div>
      </div>

    </div>`,await vt(e),(t=e.querySelector("#btn-new-area"))==null||t.addEventListener("click",()=>da(e)),(r=e.querySelector("#btn-new-articulo"))==null||r.addEventListener("click",()=>gt(e)),e.querySelector("#search-articulos").addEventListener("input",a=>{fe=a.target.value.toLowerCase().trim(),ft(e)})}async function vt(e){try{te=await de.listarAreas();const t=e.querySelector("#areas-list-container");if(!te.length){t.innerHTML='<div style="text-align:center;color:var(--text3);padding:12px;font-size:0.85rem">Sin áreas registradas</div>';return}t.innerHTML=te.map(r=>`
      <button class="btn btn-outline area-selector-btn" data-id="${r.id}" 
        style="justify-content:flex-start;text-align:left;width:100%;border:none;background:transparent;padding:10px 12px;border-radius:8px;display:flex;align-items:center;gap:10px">
        <i class="${r.tipo==="AULA"?"fas fa-door-open":"fas fa-layer-group"}" style="color:var(--primary);opacity:0.8"></i>
        <div style="flex-grow:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          <div style="font-weight:600;font-size:0.88rem;color:var(--text)">${r.nombre}</div>
          <div style="font-size:0.75rem;color:var(--text3)">${r.tipo}</div>
        </div>
      </button>`).join(""),t.querySelectorAll(".area-selector-btn").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".area-selector-btn").forEach(o=>o.style.background="transparent"),r.style.background="rgba(99, 102, 241, 0.1)",G=Number(r.dataset.id);const a=te.find(o=>o.id===G);e.querySelector("#table-title").innerHTML=`📦 ${a.nombre} <span style="font-weight:400;font-size:0.8rem;color:var(--text3)">(${a.tipo})</span>`,He(e)})}),te.length>0&&!G&&t.querySelector(".area-selector-btn").click()}catch(t){p(t.message,"error")}}async function He(e){if(G)try{me=await de.listarArticulos(G),ft(e)}catch(t){p(t.message,"error")}}function ft(e){const t=e.querySelector("#tbody-articulos"),r=e.querySelector("#total-articulos"),a=e.querySelector("#footer-inventario"),o=me.filter(i=>{var s,n,l;return((s=i.nombre)==null?void 0:s.toLowerCase().includes(fe))||((n=i.codigoBarras)==null?void 0:n.toLowerCase().includes(fe))||((l=i.descripcion)==null?void 0:l.toLowerCase().includes(fe))});if(r.textContent=`${o.length}`,a.textContent=`${o.length} artículos en esta área`,!o.length){t.innerHTML='<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Sin artículos registrados en esta área que coincidan</td></tr>';return}t.innerHTML=o.map(i=>`
    <tr>
      <td>
        <span class="view-details-btn" data-id="${i.id}" style="cursor:pointer;font-family:monospace;font-weight:700;color:var(--text2);background:var(--border);padding:4px 8px;border-radius:4px;font-size:0.85rem;display:inline-flex;align-items:center;gap:4px">
          <i class="fas fa-barcode"></i>${i.codigoBarras}
        </span>
      </td>
      <td>
        <a href="#" class="view-details-btn" data-id="${i.id}" style="color:var(--text);font-weight:700;text-decoration:none;border-bottom:1px dashed var(--text3)">
          ${i.nombre}
        </a>
      </td>
      <td><span class="badge badge-blue" style="font-size:0.9rem">${i.cantidad}</span></td>
      <td><span class="badge ${mt[i.estado]??"badge-gray"}">${i.estado.replace("_"," ")}</span></td>
      <td class="td-muted" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${i.descripcion??""}">${i.descripcion??"—"}</td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-outline btn-sm view-details-btn" data-id="${i.id}" title="Ver detalles y fotos"><i class="fas fa-eye"></i></button>
        ${Me()?`
          <button class="btn btn-outline btn-sm edit-art-btn" data-id="${i.id}" title="Editar artículo">✏️</button>
          <button class="btn btn-danger btn-sm del-art-btn" data-id="${i.id}" title="Eliminar artículo">🗑</button>
        `:""}
      </td>
    </tr>`).join(""),t.querySelectorAll(".view-details-btn").forEach(i=>{i.addEventListener("click",s=>{s.preventDefault(),la(me.find(n=>n.id==i.dataset.id))})}),Me()&&(t.querySelectorAll(".edit-art-btn").forEach(i=>{i.addEventListener("click",()=>gt(e,me.find(s=>s.id==i.dataset.id)))}),t.querySelectorAll(".del-art-btn").forEach(i=>{i.addEventListener("click",()=>ca(e,me.find(s=>s.id==i.dataset.id)))}))}function la(e){const t=`${Re}/api/inventario/articulos/${e.id}/barcode`;let r="";e.fotos&&e.fotos.length>0?r=`
      <div style="margin-top:16px">
        <label style="font-weight:600;font-size:0.9rem;color:var(--text3);margin-bottom:8px;display:block">📷 Fotos del Artículo</label>
        <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory">
          ${e.fotos.map((a,o)=>`
            <img src="${a.fotoBase64}" alt="Foto ${o+1}" 
              style="width:160px;height:120px;object-fit:cover;border-radius:8px;border:1px solid var(--border);scroll-snap-align:start;cursor:zoom-in" 
              onclick="window.open(this.src, '_blank')"
              title="Click para ampliar" />
          `).join("")}
        </div>
      </div>`:r=`
      <div style="margin-top:16px;text-align:center;padding:24px;border:2px dashed var(--border);border-radius:12px;color:var(--text3)">
        <i class="fas fa-image" style="font-size:2rem;margin-bottom:8px;display:block;opacity:0.4"></i>
        Sin fotos registradas para este artículo.
      </div>`,R({title:`📦 Detalles de Artículo — ${e.nombre}`,bodyHTML:`
      <div style="display:flex;flex-direction:column;gap:16px;padding:8px 0">
        
        <!-- Tarjeta de Código de Barras -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;background:var(--bg2);padding:20px;border-radius:12px;border:1px solid var(--border)">
          <div style="font-weight:700;font-size:0.95rem;font-family:monospace;color:var(--text)">
            ${e.codigoBarras}
          </div>
          <!-- Imagen del código de barras -->
          <img src="${t}" alt="Código de barras ${e.codigoBarras}" 
            style="max-width:100%;height:68px;object-fit:contain;background:white;padding:6px;border-radius:6px;border:1.5px solid var(--border)" />
          
          <button class="btn btn-outline btn-sm" id="btn-print-barcode"><i class="fas fa-print"></i> Imprimir Etiqueta</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div>
            <span style="font-size:0.8rem;color:var(--text3)">Cantidad</span>
            <div style="font-size:1.1rem;font-weight:700;color:var(--text)">${e.cantidad} unidades</div>
          </div>
          <div>
            <span style="font-size:0.8rem;color:var(--text3)">Estado</span>
            <div><span class="badge ${mt[e.estado]??"badge-gray"}">${e.estado.replace("_"," ")}</span></div>
          </div>
          <div style="grid-column:1/-1">
            <span style="font-size:0.8rem;color:var(--text3)">Descripción / Nota</span>
            <div style="font-size:0.95rem;color:var(--text2)">${e.descripcion||"—"}</div>
          </div>
          <div style="grid-column:1/-1">
            <span style="font-size:0.8rem;color:var(--text3)">Ubicación</span>
            <div style="font-size:0.95rem;color:var(--text2)">🏫 ${e.area.nombre} (${e.area.tipo})</div>
          </div>
        </div>

        ${r}

      </div>`,confirmText:"Cerrar",hideCancelBtn:!0,onOpen:a=>{a.querySelector("#btn-print-barcode").addEventListener("click",()=>{const o=window.open("","_blank");o.document.write(`
          <html>
          <head>
            <title>Imprimir Etiqueta - ${e.nombre}</title>
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
              <h1>SchoolGuard - ${e.nombre}</h1>
              <img src="${t}" />
              <div class="code">${e.codigoBarras}</div>
            </div>
          </body>
          </html>
        `),o.document.close()})}})}function da(e){R({title:"+ Nueva Área o Aula",bodyHTML:`
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
      </div>`,confirmText:"Registrar",onConfirm:async(t,r)=>{const a={nombre:t.querySelector("#ma-nombre").value.trim(),tipo:t.querySelector("#ma-tipo").value,descripcion:t.querySelector("#ma-desc").value.trim()};if(!a.nombre){p("El nombre es obligatorio","warning");return}try{const o=await de.registrarArea(a);p("Área / Aula creada exitosamente","success"),G=o.id,r(),await vt(e)}catch(o){p(o.message,"error")}}})}function gt(e,t=null){const r=!!t,a=te.map(s=>`<option value="${s.id}" ${(t?t.area.id:G)===s.id?"selected":""}>${s.nombre}</option>`).join("");let o=[];r&&t.fotos&&(o=t.fotos.map(s=>s.fotoBase64));const i=s=>{if(!o.length){s.innerHTML='<span style="color:var(--text3);font-size:0.85rem">No se han seleccionado fotos.</span>';return}s.innerHTML=o.map((n,l)=>`
      <div style="position:relative;width:70px;height:70px;border-radius:6px;overflow:hidden;border:1.5px solid var(--border)">
        <img src="${n}" style="width:100%;height:100%;object-fit:cover" />
        <button type="button" class="remove-photo-btn" data-index="${l}" 
          style="position:absolute;top:2px;right:2px;background:rgba(239,68,68,0.85);color:white;border:none;width:18px;height:18px;border-radius:50%;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center">
          ✕
        </button>
      </div>`).join(""),s.querySelectorAll(".remove-photo-btn").forEach(n=>{n.addEventListener("click",()=>{o.splice(Number(n.dataset.index),1),i(s)})})};R({title:r?"✏️ Editar Artículo":"+ Nuevo Artículo de Inventario",bodyHTML:`
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

        <!-- Nueva sección de fotos -->
        <div class="form-group" style="grid-column:1/-1">
          <label>Cargar Fotos del Artículo</label>
          <input class="form-control" type="file" id="mar-photos-input" multiple accept="image/*" style="padding:4px" />
          <div id="mar-photos-preview" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"></div>
        </div>
      </div>`,confirmText:r?"Actualizar":"Registrar Ítem",onOpen:s=>{const n=s.querySelector("#barcode-auto"),l=s.querySelector("#barcode-manual"),d=s.querySelector("#mar-barcode"),c=s.querySelector("#mar-photos-input"),u=s.querySelector("#mar-photos-preview");r||(d.value="SG-XXXXXXXX (Se autogenerará)"),i(u),n==null||n.addEventListener("change",()=>{n.checked&&(d.disabled=!0,d.style.background="var(--border)",d.style.color="var(--text3)",d.value="SG-XXXXXXXX (Se autogenerará)")}),l==null||l.addEventListener("change",()=>{l.checked&&(d.disabled=!1,d.style.background="",d.style.color="",d.value=r?t.codigoBarras:"",d.focus())}),c==null||c.addEventListener("change",async b=>{const h=Array.from(b.target.files||[]);for(const v of h)try{const E=await new Promise((Q,P)=>{const y=new FileReader;y.onload=()=>Q(y.result),y.onerror=$=>P($),y.readAsDataURL(v)});o.push(E)}catch{p("Error al leer una de las imágenes","error")}i(u),c.value=""})},onConfirm:async(s,n)=>{var u;const l=((u=s.querySelector("#barcode-auto"))==null?void 0:u.checked)??!1,d=s.querySelector("#mar-barcode").value.trim(),c={nombre:s.querySelector("#mar-nombre").value.trim(),cantidad:Number(s.querySelector("#mar-cant").value),estado:s.querySelector("#mar-estado").value,areaId:Number(s.querySelector("#mar-area").value),codigoBarras:l?"":d,descripcion:s.querySelector("#mar-desc").value.trim(),fotos:o};if(!c.nombre||!c.cantidad){p("Completa los campos obligatorios","warning");return}if(!l&&!c.codigoBarras){p("Debes introducir un código de barras si seleccionas manual","warning");return}try{r?(l&&(c.codigoBarras=t.codigoBarras),await de.actualizarArticulo(t.id,c),p("Artículo actualizado exitosamente","success")):(await de.registrarArticulo(c),p("Artículo registrado exitosamente","success")),n(),await He(e)}catch(b){p(b.message,"error")}}})}function ca(e,t){R({title:"🗑 Eliminar Artículo del Inventario",bodyHTML:`<p style="color:var(--text2);line-height:1.7">¿Estás seguro de eliminar a <strong style="color:var(--text)">${t.nombre}</strong> (${t.codigoBarras}) del inventario?<br/>Esta acción no se puede deshacer y quedará registrada en auditoría.</p>`,confirmText:"Eliminar",danger:!0,onConfirm:async(r,a)=>{try{await de.eliminarArticulo(t.id),p("Artículo eliminado del inventario","success"),a(),await He(e)}catch(o){p(o.message,"error")}}})}const pe=document.getElementById("app"),ua={"#/login":{page:At,auth:!1},"#/dashboard":{page:Lt,auth:!0},"#/visitas":{page:Ct,auth:!0},"#/visitantes":{page:Mt,auth:!0},"#/alumnos":{page:Nt,auth:!0},"#/usuarios":{page:Vt,auth:!0,roles:["ADMINISTRADOR"]},"#/auditoria":{page:ia,auth:!0,roles:["ADMINISTRADOR"]},"#/asistencia":{page:Ut,auth:!0},"#/agenda":{page:Wt,auth:!0},"#/inventario":{page:na,auth:!0}};async function ht(){const e=window.location.hash||"#/dashboard",t=ua[e];if(!t){window.location.hash="#/dashboard";return}if(!t.auth){if(m.isLogged()){window.location.hash="#/dashboard";return}pe.innerHTML="",t.page(pe);return}if(!m.isLogged()){window.location.hash="#/login";return}if(t.roles&&!t.roles.includes(m.rol())){window.location.hash="#/dashboard";return}pe.innerHTML=`
    <div class="app-container">
      <div id="sidebar-wrap"></div>
      <div class="main-content" id="page-root"></div>
    </div>`,St(pe.querySelector("#sidebar-wrap"));const r=pe.querySelector("#page-root");try{await t.page(r)}catch(a){r.innerHTML=`
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;height:60vh;gap:10px;color:var(--text2)">
        <span style="font-size:2.5rem">⚠️</span>
        <p style="font-weight:600">Error al cargar la página</p>
        <small>${a.message}</small>
      </div>`}}window.addEventListener("hashchange",ht);window.addEventListener("load",()=>{window.location.hash||(window.location.hash="#/dashboard"),ht()});
