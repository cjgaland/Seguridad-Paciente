import { PREGUNTAS } from './adivina_data.js';
import { saveScore } from '../../../../js/core/scores.js';

let currentRound = 0;
let score = 0;
let gameQuestions = [];
let gameHistory = []; // Historial detallado

const MAX_ROUNDS = 5;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    document.getElementById('btn-next').addEventListener('click', nextQuestion);
});

function initGame() {
    currentRound = 0;
    score = 0;
    gameHistory = [];
    
    // Barajar y coger 5
    gameQuestions = [...PREGUNTAS].sort(() => 0.5 - Math.random()).slice(0, MAX_ROUNDS);
    
    loadQuestion();
}

function loadQuestion() {
    if (currentRound >= MAX_ROUNDS) {
        endGame();
        return;
    }

    const q = gameQuestions[currentRound];
    
    // UI
    document.getElementById('question-text').innerHTML = q.pregunta.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
    document.getElementById('current-round').textContent = currentRound + 1;
    document.getElementById('score').textContent = score;

    const container = document.getElementById('options-container');
    container.innerHTML = "";

    // Barajar opciones
    const shuffledOptions = [...q.opciones].sort(() => 0.5 - Math.random());

    shuffledOptions.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'option-card';
        btn.style.borderBottom = `4px solid ${opt.color}`;
        
        btn.innerHTML = `
            <div class="opt-icon" style="color:${opt.color}; background:${opt.color}20">
                <i class="fa-solid ${opt.icon}"></i>
            </div>
            <strong>${opt.texto}</strong>
        `;
        
        btn.addEventListener('click', () => checkAnswer(opt, q));
        container.appendChild(btn);
    });
}

function checkAnswer(selectedOpt, questionData) {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');
    const icon = document.getElementById('feedback-icon');

    const isCorrect = selectedOpt.correcta === true;
    
    // Buscar la opción correcta para guardarla en el historial
    const correctOption = questionData.opciones.find(o => o.correcta === true);

    // Guardar historial COMPLETO
    gameHistory.push({
        pregunta: questionData.pregunta.replace(/\*\*/g, ''), // Limpiar markdown para historial
        seleccionUsuario: selectedOpt.texto,
        respuestaCorrecta: correctOption.texto,
        explicacion: questionData.explicacion,
        acierto: isCorrect
    });

    if (isCorrect) {
        score += 100;
        modal.className = "modal correct";
        icon.className = "fa-solid fa-circle-check";
        title.textContent = "¡Correcto!";
    } else {
        modal.className = "modal wrong";
        icon.className = "fa-solid fa-circle-xmark";
        title.textContent = "Incorrecto";
    }

    msg.textContent = questionData.explicacion;
    modal.classList.remove('hidden');
}

function nextQuestion() {
    document.getElementById('feedback-modal').classList.add('hidden');
    currentRound++;
    loadQuestion();
}

function endGame() {
    // Guardar Firebase
    saveScore("adivina", "nivel1", "Usuario", score);

    const finalScreen = document.getElementById('final-screen');
    document.getElementById('final-score').textContent = score;
    
    // GENERAR RESUMEN DETALLADO
    const summaryDiv = document.getElementById('game-summary');
    let html = '';

    gameHistory.forEach((h, i) => {
        const cssClass = h.acierto ? 'correct' : 'wrong';
        
        html += `
            <div class="sum-card ${cssClass}">
                <div class="sum-q">${i+1}. ${h.pregunta}</div>
                
                ${!h.acierto ? `
                    <div class="sum-detail user-ans">
                        <i class="fa-solid fa-xmark"></i> Tu respuesta: ${h.seleccionUsuario}
                    </div>
                ` : ''}
                
                <div class="sum-detail correct-ans">
                    <i class="fa-solid fa-check"></i> Correcto: ${h.respuestaCorrecta}
                </div>
                
                <div class="sum-why">
                    <strong>¿Por qué?</strong> ${h.explicacion}
                </div>
            </div>
        `;
    });

    summaryDiv.innerHTML = html;
    finalScreen.classList.remove('hidden');
}