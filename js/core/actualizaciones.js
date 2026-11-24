// ======================================================
//  ACTUALIZACIONES + BOTÓN DE AYUDA (actualizaciones.js)
//  Se carga en TODAS las páginas. Hace tres cosas:
//   1. Botón flotante «Ayuda» que lleva al manual y a las versiones.
//   2. Comprueba /version.json al abrir, al volver a la pestaña y cada
//      hora. Si hay una versión publicada más nueva que la cargada,
//      muestra la píldora «Nueva versión disponible · Actualizar».
//   3. La primera vez que se abre una versión nueva, muestra sus novedades.
//  No depende del servidor: funciona igual en GitHub Pages o en el SAS.
// ======================================================

import { VERSION, HISTORIAL } from "./version.js";
import { iniciarAccesibilidad } from "./accesibilidad.js";

const RAIZ = new URL("../../", import.meta.url);           // carpeta App/
const URL_VERSION = new URL("version.json", RAIZ);
const URL_AYUDA = new URL("ayuda/ayuda.html", RAIZ);
const CLAVE_VISTA = "sp:versionVista";
const CADA_HORA = 60 * 60 * 1000;
const MINIMO_ENTRE_COMPROBACIONES = 10 * 60 * 1000;
let ultimaComprobacion = 0;

const numero = (v) => String(v).split(".").map(Number).reduce((t, n) => t * 1000 + (n || 0), 0);

/* ── Estilos (se inyectan para no tocar cada página) ── */
function estilos() {
    if (document.getElementById("sp-estilos-actualizacion")) return;
    const css = document.createElement("style");
    css.id = "sp-estilos-actualizacion";
    css.textContent = `
    .sp-boton-ayuda{position:fixed;left:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:8px;
      padding:9px 16px;border-radius:999px;background:#0b7a3e;color:#fff;font:600 14px/1.2 system-ui,sans-serif;
      text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.22)}
    .sp-boton-ayuda:hover,.sp-boton-ayuda:focus-visible{background:#095f30;outline:3px solid #FFC341;outline-offset:2px}
    .aviso-version{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:70;display:flex;gap:12px;
      align-items:center;max-width:calc(100vw - 32px);padding:8px 8px 8px 18px;border-radius:999px;background:#2E7D8C;
      color:#fff;font:700 14.5px/1.2 system-ui,sans-serif;box-shadow:0 8px 24px rgba(13,24,40,.3);white-space:nowrap}
    .aviso-version button{border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.2);color:inherit;
      border-radius:999px;padding:6px 14px;font:inherit;font-weight:800;cursor:pointer}
    .aviso-version button:hover{background:rgba(255,255,255,.32)}
    .sp-novedades{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;
      background:rgba(13,24,40,.45);padding:16px}
    .sp-novedades__caja{background:#fff;color:#222;max-width:560px;width:100%;border-radius:14px;padding:22px 24px;
      box-shadow:0 18px 48px rgba(0,0,0,.3);font:15px/1.5 system-ui,sans-serif;max-height:85vh;display:flex;flex-direction:column}
    .sp-novedades__caja h2{margin:0 0 6px;font-size:1.25rem;color:#0b7a3e}
    .sp-novedades__lista{overflow:auto;margin:8px 0 16px}
    .sp-novedades__lista h3{margin:10px 0 4px;font-size:1rem}
    .sp-novedades__lista ul{margin:4px 0 0;padding-left:20px}
    .sp-novedades__lista li+li{margin-top:5px}
    .sp-novedades__caja button{align-self:flex-end;border:0;background:#0b7a3e;color:#fff;border-radius:8px;
      padding:9px 18px;font:600 15px system-ui,sans-serif;cursor:pointer}
    @media (max-width:600px){.aviso-version{bottom:68px}.sp-boton-ayuda{padding:9px 13px}}
    .sp-saltar{position:fixed;left:8px;top:-60px;z-index:100;background:#0b3d20;color:#fff;padding:10px 16px;
      border-radius:0 0 8px 8px;font:600 15px system-ui,sans-serif;text-decoration:none}
    .sp-saltar:focus{top:0}
    :where(a,button,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #0b5fa5;outline-offset:2px}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
    @media print{.sp-saltar,.sp-boton-ayuda,.aviso-version{display:none!important}}`;
    document.head.append(css);
}

/* ── 1. Botón de ayuda ── */
function botonAyuda() {
    if (location.pathname.endsWith("/ayuda/ayuda.html") || document.querySelector(".sp-boton-ayuda")) return;
    const a = document.createElement("a");
    a.className = "sp-boton-ayuda";
    a.href = URL_AYUDA.href;
    a.innerHTML = '<span aria-hidden="true">?</span> Ayuda';
    a.title = "Manual de uso y versiones";
    document.body.append(a);
}

/* ── 2. Aviso de versión nueva ── */
function mostrarAviso(publicada) {
    if (document.getElementById("aviso-version")) return;
    const aviso = document.createElement("div");
    aviso.id = "aviso-version";
    aviso.className = "aviso-version";
    aviso.setAttribute("role", "status");
    aviso.innerHTML = `<span>Nueva versión disponible (${publicada})</span><button type="button">Actualizar</button>`;
    aviso.querySelector("button").addEventListener("click", () => {
        const u = new URL(location.href);
        u.searchParams.set("v", publicada);
        location.replace(u.href);
    });
    document.body.append(aviso);
}

/** Consulta la versión publicada. Devuelve 'nueva', 'ultima' o 'sin-conexion'. */
export async function buscarActualizaciones() {
    ultimaComprobacion = Date.now();
    try {
        const r = await fetch(`${URL_VERSION.href}?t=${Date.now()}`, { cache: "no-store" });
        if (!r.ok) return "sin-conexion";
        const { version } = await r.json();
        if (numero(version) > numero(VERSION)) { mostrarAviso(version); return "nueva"; }
        return "ultima";
    } catch (e) {
        return "sin-conexion";   // abierto desde el disco (file://) o sin red
    }
}

function comprobarSiToca() {
    if (Date.now() - ultimaComprobacion >= MINIMO_ENTRE_COMPROBACIONES) buscarActualizaciones();
}

/* ── 3. Novedades tras actualizar ── */
function mostrarNovedades() {
    let vista = null;
    try {
        vista = localStorage.getItem(CLAVE_VISTA);
        localStorage.setItem(CLAVE_VISTA, VERSION);
    } catch (e) { return; }
    if (!vista || numero(vista) >= numero(VERSION)) return;   // primera visita o misma versión
    const nuevas = HISTORIAL.filter((v) => numero(v.version) > numero(vista));
    if (!nuevas.length) return;

    const capa = document.createElement("div");
    capa.className = "sp-novedades";
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    capa.setAttribute("aria-labelledby", "sp-novedades-titulo");
    const lista = nuevas.map((v) => `${nuevas.length > 1 ? `<h3>Versión ${v.version}</h3>` : ""}<ul>${v.cambios.map((c) => `<li>${c}</li>`).join("")}</ul>`).join("");
    capa.innerHTML = `<div class="sp-novedades__caja">
        <h2 id="sp-novedades-titulo">La plataforma se ha actualizado</h2>
        <p style="margin:0">Ya tiene la versión ${VERSION}. Esto es lo nuevo:</p>
        <div class="sp-novedades__lista">${lista}</div>
        <button type="button">Entendido</button></div>`;
    const cerrar = () => capa.remove();
    capa.querySelector("button").addEventListener("click", cerrar);
    capa.addEventListener("click", (e) => { if (e.target === capa) cerrar(); });
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { cerrar(); document.removeEventListener("keydown", esc); } });
    document.body.append(capa);
    capa.querySelector("button").focus();
}

function iniciar() {
    estilos();
    iniciarAccesibilidad();
    botonAyuda();
    mostrarNovedades();
    buscarActualizaciones();
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") comprobarSiToca(); });
    setInterval(comprobarSiToca, CADA_HORA);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();
