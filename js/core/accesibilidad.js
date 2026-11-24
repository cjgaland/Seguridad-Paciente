// ======================================================
//  ACCESIBILIDAD COMÚN (accesibilidad.js) — lo carga actualizaciones.js
//  en todas las páginas. Mejora el uso con teclado y lector de pantalla
//  sin tener que tocar cada página:
//   · Enlace «Saltar al contenido».
//   · Tarjetas con onclick: enfocables y activables con Intro / Espacio.
//   · Botón de menú y submenús con su estado (abierto / cerrado).
//   · Iconos decorativos ocultos al lector de pantalla.
// ======================================================

function saltarAlContenido() {
    const destino = document.querySelector("main, .main-content, .sp-main");
    if (!destino || document.querySelector(".sp-saltar")) return;
    if (!destino.id) destino.id = "contenido-principal";
    destino.setAttribute("tabindex", "-1");
    const a = document.createElement("a");
    a.className = "sp-saltar";
    a.href = "#" + destino.id;
    a.textContent = "Saltar al contenido";
    document.body.prepend(a);
}

function tarjetasConTeclado(raiz = document) {
    raiz.querySelectorAll("[onclick]").forEach((el) => {
        if (el.matches("a, button, input, select, textarea, summary") || el.dataset.spTeclado) return;
        el.dataset.spTeclado = "1";
        if (!el.hasAttribute("tabindex")) el.tabIndex = 0;
        if (!el.hasAttribute("role")) el.setAttribute("role", /location/.test(el.getAttribute("onclick")) ? "link" : "button");
        el.addEventListener("keydown", (e) => {
            if (e.target !== el) return;
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
        });
    });
}

function menus() {
    const toggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    if (toggle) {
        toggle.setAttribute("aria-label", "Abrir o cerrar el menú");
        const estado = () => toggle.setAttribute("aria-expanded", sidebar?.classList.contains("active") ? "true" : "false");
        estado();
        toggle.addEventListener("click", () => setTimeout(estado, 0));
        document.getElementById("sidebar-overlay")?.addEventListener("click", () => setTimeout(estado, 0));
    }
    document.querySelectorAll(".sidebar-btn[data-toggle]").forEach((btn) => {
        const sub = document.getElementById(btn.dataset.toggle);
        if (!sub) return;
        btn.setAttribute("aria-controls", sub.id);
        const estado = () => btn.setAttribute("aria-expanded", sub.style.display === "block" ? "true" : "false");
        estado();
        btn.addEventListener("click", () => setTimeout(estado, 0));
    });
    document.querySelector(".sidebar")?.setAttribute("aria-label", "Menú de secciones");
}

function iconosDecorativos(raiz = document) {
    raiz.querySelectorAll("i.fa-solid, i.fa-regular, i.fa-brands, i.fas, i.far").forEach((i) => {
        if (!i.hasAttribute("aria-hidden") && !i.hasAttribute("aria-label")) i.setAttribute("aria-hidden", "true");
    });
}

export function iniciarAccesibilidad() {
    saltarAlContenido();
    tarjetasConTeclado();
    menus();
    iconosDecorativos();
    // Contenido que los juegos pintan después (tarjetas, iconos)
    let pendiente = false;
    new MutationObserver(() => {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => { pendiente = false; tarjetasConTeclado(); iconosDecorativos(); });
    }).observe(document.body, { childList: true, subtree: true });
}
