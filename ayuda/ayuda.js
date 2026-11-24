import { VERSION, HISTORIAL } from "../js/core/version.js";
import { buscarActualizaciones } from "../js/core/actualizaciones.js";

const $ = (s) => document.querySelector(s);

$("#versionActual").textContent = VERSION;

const fecha = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

$("#listaVersiones").innerHTML = HISTORIAL.map((v) => `
    <article class="ayuda-versionitem">
        <h4>Versión ${v.version} <small>${fecha(v.fecha)}</small></h4>
        <ul>${v.cambios.map((c) => `<li>${c}</li>`).join("")}</ul>
    </article>`).join("");

/* Pestañas del manual (accesibles con teclado) */
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activar(tab) {
    tabs.forEach((t) => {
        const sel = t === tab;
        t.setAttribute("aria-selected", sel);
        t.tabIndex = sel ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !sel;
    });
    tab.focus();
}
tabs.forEach((t, i) => {
    t.addEventListener("click", () => activar(t));
    t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") activar(tabs[(i + 1) % tabs.length]);
        if (e.key === "ArrowLeft") activar(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
});

/* Buscar actualizaciones a petición */
$("#btnBuscar").addEventListener("click", async () => {
    const estado = $("#estadoBusqueda");
    estado.textContent = "Comprobando…";
    const r = await buscarActualizaciones();
    estado.textContent = {
        nueva: "Hay una versión nueva: pulse «Actualizar» en el aviso de abajo.",
        ultima: "Tiene la última versión.",
        "sin-conexion": "No se ha podido comprobar (sin conexión o abierto desde el disco)."
    }[r];
});

/* Borrar datos locales de la plataforma */
$("#btnBorrar").addEventListener("click", () => {
    if (!confirm("Se borrarán sus puntuaciones, encuestas y nombre de jugador guardados en este dispositivo. ¿Continuar?")) return;
    try {
        Object.keys(localStorage)
            .filter((k) => k.startsWith("sp-datos:") || k === "jugador-sp" || k.startsWith("sp-borrador:"))
            .forEach((k) => localStorage.removeItem(k));
        $("#estadoBorrar").textContent = " Datos borrados.";
    } catch (e) {
        $("#estadoBorrar").textContent = " No se ha podido acceder al almacenamiento del navegador.";
    }
});
