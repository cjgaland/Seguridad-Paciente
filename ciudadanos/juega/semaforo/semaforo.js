import { CASOS } from './data.js';
// CORRECCIÓN: Solo 3 niveles de subida para llegar a la raíz (juega -> ciudadanos -> raiz)
import { saveScore } from '../../../js/core/scores.js';

// Variables globales
window.checkAnswer = checkAnswer;

let currentRound = 0;
let score = 0;
let currentCase = null;
let gameCases = []; 
let gameHistory = []; // AQUÍ GUARDAMOS EL RESUMEN

const MAX_ROUNDS = 5; 

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    document.getElementById('btn-next').addEventListener('click', nextRound);
});

function initGame() {
    // Resetear variables
    currentRound = 0;
    score = 0;
    gameHistory = []; // Limpiar historial
    
    // Barajar y coger 5
    const shuffled = shuffleArray([...CASOS]);
    gameCases = shuffled.slice(0, MAX_ROUNDS);
    
    loadRound();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadRound() {
    if (currentRound >= MAX_ROUNDS) {
        endGame();
        return;
    }

    currentCase = gameCases[currentRound];
    
    // UI
    document.getElementById('case-text').textContent = currentCase.texto;
    document.getElementById('round').textContent = currentRound + 1;
    document.getElementById('score').textContent = score;
}

function checkAnswer(colorElegido) {
    const modal = document.getElementById('feedback-modal');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');
    
    const esCorrecto = (colorElegido === currentCase.respuesta);

    // GUARDAR EN HISTORIAL PARA EL FINAL
    gameHistory.push({
        pregunta: currentCase.texto,
        respuestaUsuario: colorElegido,
        respuestaCorrecta: currentCase.respuesta,
        explicacion: currentCase.explicacion,
        acierto: esCorrecto
    });

    if (esCorrecto) {
        score += 100;
        modal.className = "modal correct";
        icon.className = "fa-solid fa-circle-check";
        title.textContent = "¡Correcto!";
    } else {
        modal.className = "modal wrong";
        icon.className = "fa-solid fa-circle-xmark";
        title.textContent = "Incorrecto";
    }

    msg.textContent = currentCase.explicacion;
    modal.classList.remove('hidden');
}

function nextRound() {
    document.getElementById('feedback-modal').classList.add('hidden');
    currentRound++;
    loadRound();
}

function endGame() {
    const container = document.querySelector('.game-container');
    
    // Guardar en Firebase (Nivel "ciudadanos")
    saveScore("semaforo", "ciudadanos", "Usuario", score);

    // Generar HTML del Resumen
    let summaryHTML = '<div class="summary-container">';
    
    gameHistory.forEach((item, index) => {
        const cssClass = item.acierto ? 'correct' : 'wrong';
        const icon = item.acierto ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
        
        // Traducir códigos de color a texto legible
        const mapColor = { 'rojo': 'URGENCIAS (Rojo)', 'ambar': 'CENTRO SALUD (Ámbar)', 'verde': 'CASA (Verde)' };
        
        summaryHTML += `
            <div class="summary-item ${cssClass}">
                <div class="summary-q">${index + 1}. ${item.pregunta}</div>
                ${!item.acierto ? `<div class="summary-ans bad">Tu respuesta: ${mapColor[item.respuestaUsuario]}</div>` : ''}
                <div class="summary-ans good">${icon} Correcto: ${mapColor[item.respuestaCorrecta]}</div>
                <div class="summary-exp">${item.explicacion}</div>
            </div>
        `;
    });
    summaryHTML += '</div>';

    // Renderizar Pantalla Final
    container.innerHTML = `
        <div class="case-card" style="text-align:center; border-top-color:#10b981; max-width:800px;">
            <i class="fa-solid fa-clipboard-check" style="font-size:3rem; color:#3b82f6; margin-bottom:10px;"></i>
            <h3>Resumen de la Partida</h3>
            <p>Puntuación: <strong>${score}</strong> / 500</p>
            
            ${summaryHTML}

            <div style="margin-top:30px; display:flex; gap:10px; justify-content:center;">
                <button onclick="location.reload()" class="btn-next" style="font-size:0.9rem;">
                    <i class="fa-solid fa-rotate-right"></i> Repetir
                </button>
                
                <button onclick="location.href='../ranking.html?juego=semaforo&nivel=ciudadanos'" class="btn-next" style="background:#F5A623;">
                    <i class="fa-solid fa-trophy"></i> Ver Ranking
                </button>
            </div>
        </div>
    `;
}
