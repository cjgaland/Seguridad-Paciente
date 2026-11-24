// ======================================================
//  MÓDULO CENTRAL DE PUNTUACIONES (scores.js)
//  Misma interfaz que antes (saveScore, getRanking...), pero
//  ahora apoyado en almacen.js: sin servicios externos.
// ======================================================

import { guardar, listar, descripcionModo } from "./almacen.js";

const COLECCION = "scores";

export { descripcionModo };

/** saveScore(juego, nivel, jugador, puntuacion, tiempo) */
export async function saveScore(juego, nivel, jugador, puntuacion, tiempo = null) {
    return guardar(COLECCION, { juego, nivel, jugador, puntuacion, tiempo });
}

function ordenar(lista, maxResultados) {
    return lista
        .sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0))
        .slice(0, maxResultados);
}

/** Ranking de un juego y nivel: getRanking("riesgos", "nivel1") */
export async function getRanking(juego, nivel, maxResultados = 20) {
    const todos = await listar(COLECCION);
    return ordenar(todos.filter(s => s.juego === juego && s.nivel === nivel), maxResultados);
}

/** Ranking de un juego (todos los niveles) */
export async function getGlobalRanking(juego, maxResultados = 20) {
    const todos = await listar(COLECCION);
    return ordenar(todos.filter(s => s.juego === juego), maxResultados);
}

/** Historial de un jugador, del más reciente al más antiguo */
export async function getPlayerStats(jugador) {
    const todos = await listar(COLECCION);
    return todos
        .filter(s => s.jugador === jugador)
        .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}

