// ======================================================
//  ALMACÉN DE DATOS (almacen.js)
//  Capa única de guardado para puntuaciones y encuestas.
//
//  MODO "local"  (por defecto): los datos se guardan SOLO en el
//      navegador de cada persona (localStorage). No sale nada del
//      dispositivo y no se recogen datos personales.
//
//  MODO "remoto": preparado para conectarse a un servidor del SAS
//      / Junta de Andalucía cuando se autorice. Basta con rellenar
//      CONFIG_ALMACEN.urlRemota. Contrato esperado del servidor:
//        POST {urlRemota}/{coleccion}   cuerpo JSON  → 201
//        GET  {urlRemota}/{coleccion}   → 200 [ {..}, {..} ]
//      Si el servidor no responde, se guarda en local igualmente.
// ======================================================

export const CONFIG_ALMACEN = {
    modo: "local",          // "local" | "remoto"
    urlRemota: null,        // p. ej. "https://servidor.sas.junta-andalucia.es/api/sp"
    maxRegistros: 500       // límite por colección en modo local
};

const PREFIJO = "sp-datos:";

function leerLocal(coleccion) {
    try {
        const crudo = localStorage.getItem(PREFIJO + coleccion);
        const lista = crudo ? JSON.parse(crudo) : [];
        return Array.isArray(lista) ? lista : [];
    } catch (e) {
        return [];
    }
}

function escribirLocal(coleccion, lista) {
    try {
        localStorage.setItem(PREFIJO + coleccion, JSON.stringify(lista.slice(-CONFIG_ALMACEN.maxRegistros)));
        return true;
    } catch (e) {
        return false;
    }
}

function remotoActivo() {
    return CONFIG_ALMACEN.modo === "remoto" && typeof CONFIG_ALMACEN.urlRemota === "string" && CONFIG_ALMACEN.urlRemota.length > 0;
}

/** Guarda un registro en la colección indicada. Devuelve true si se guardó. */
export async function guardar(coleccion, datos) {
    const registro = { ...datos, fecha: datos.fecha || new Date().toISOString() };

    if (remotoActivo()) {
        try {
            const r = await fetch(`${CONFIG_ALMACEN.urlRemota}/${encodeURIComponent(coleccion)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registro)
            });
            if (r.ok) return true;
        } catch (e) { /* sin conexión: seguimos en local */ }
    }

    const lista = leerLocal(coleccion);
    lista.push(registro);
    return escribirLocal(coleccion, lista);
}

/** Devuelve todos los registros de una colección (array de objetos). */
export async function listar(coleccion) {
    if (remotoActivo()) {
        try {
            const r = await fetch(`${CONFIG_ALMACEN.urlRemota}/${encodeURIComponent(coleccion)}`);
            if (r.ok) {
                const datos = await r.json();
                if (Array.isArray(datos)) return datos;
            }
        } catch (e) { /* sin conexión: devolvemos lo local */ }
    }
    return leerLocal(coleccion);
}

/** Texto para explicar al usuario de dónde salen los datos. */
export function descripcionModo() {
    return remotoActivo()
        ? "Datos compartidos de todos los participantes."
        : "Datos guardados solo en este dispositivo. No se envía ninguna información fuera de su navegador.";
}
