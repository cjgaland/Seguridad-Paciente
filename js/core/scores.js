// ======================================================
//  MÓDULO CENTRAL DE PUNTUACIONES (scores.js)
//  Guarda y recupera puntuaciones en una sola colección
//  /scores  (un documento por partida)
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    getDocs, 
    where,
    limit
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA3QGjEZuBySF_UFhAT1c51FGOMTnnQ49Q",
    authDomain: "seguridadpaciente-f0860.firebaseapp.com",
    projectId: "seguridadpaciente-f0860",
    storageBucket: "seguridadpaciente-f0860.firebasestorage.app",
    messagingSenderId: "394227294182",
    appId: "1:394227294182:web:5bd4cc318ea4d9cf9ac027"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ======================================================
//  GUARDAR UNA PUNTUACIÓN
//  saveScore(juego, nivel, jugador, puntuacion, tiempo)
// ======================================================
export async function saveScore(juego, nivel, jugador, puntuacion, tiempo = null) {
    try {
        const fecha = new Date().toISOString();

        await addDoc(collection(db, "scores"), {
            juego,
            nivel,
            jugador,
            puntuacion,
            fecha,
            tiempo
        });

        console.log("Puntuación guardada correctamente");
        return true;

    } catch (error) {
        console.error("Error guardando puntuación:", error);
        return false;
    }
}

// ======================================================
//  OBTENER RANKING POR JUEGO Y NIVEL
//  getRanking("riesgos", "nivel1")
// ======================================================
export async function getRanking(juego, nivel, maxResultados = 20) {
    try {
        const q = query(
            collection(db, "scores"),
            where("juego", "==", juego),
            where("nivel", "==", nivel),
            orderBy("puntuacion", "desc"),
            limit(maxResultados)
        );

        const snap = await getDocs(q);
        const ranking = [];

        snap.forEach(doc => ranking.push(doc.data()));

        return ranking;

    } catch (error) {
        console.error("Error obteniendo ranking:", error);
        return [];
    }
}

// ======================================================
//  RANKING GLOBAL DE UN JUEGO (todos los niveles)
// ======================================================
export async function getGlobalRanking(juego, maxResultados = 20) {
    try {
        const q = query(
            collection(db, "scores"),
            where("juego", "==", juego),
            orderBy("puntuacion", "desc"),
            limit(maxResultados)
        );

        const snap = await getDocs(q);
        const ranking = [];

        snap.forEach(doc => ranking.push(doc.data()));

        return ranking;

    } catch (error) {
        console.error("Error obteniendo ranking global:", error);
        return [];
    }
}

// ======================================================
//  HISTORIAL COMPLETO DE UN JUGADOR
// ======================================================
export async function getPlayerStats(jugador) {
    try {
        const q = query(
            collection(db, "scores"),
            where("jugador", "==", jugador),
            orderBy("fecha", "desc")
        );

        const snap = await getDocs(q);
        const historial = [];

        snap.forEach(doc => historial.push(doc.data()));

        return historial;

    } catch (error) {
        console.error("Error obteniendo historial del jugador:", error);
        return [];
    }
}
