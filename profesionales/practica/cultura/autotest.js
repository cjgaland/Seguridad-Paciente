import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// CONFIGURACIÓN
const firebaseConfig = {
    apiKey: "AIzaSyA3QGjEZuBySF_UFhAT1c51FGOMTnnQ49Q",
    authDomain: "seguridadpaciente-f0860.firebaseapp.com",
    projectId: "seguridadpaciente-f0860",
    storageBucket: "seguridadpaciente-f0860.firebasestorage.app",
    messagingSenderId: "394227294182",
    appId: "1:394227294182:web:5bd4cc318ea4d9cf9ac027"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const QUESTIONS = [
    {
        category: "Conocimiento y Uso de NotificaSP",
        items: [
            "Conozco la existencia del sistema oficial de notificación (NotificaSP).",
            "Sabría acceder y rellenar un formulario ahora mismo sin ayuda.",
            "He notificado algún incidente o cuasi-incidente en los últimos 12 meses.",
            "Conozco alguna herramienta de gestión de riesgos en mi unidad."
        ]
    },
    {
        category: "Respuesta al Error",
        items: [
            "En mi unidad, el error se trata como oportunidad de aprender, no de culpar.",
            "Recibimos feedback sobre los cambios realizados tras notificar.",
            "Me siento cómodo/a hablando sobre riesgos con mis compañeros."
        ]
    },
    {
        category: "Clima de Equipo",
        items: [
            "Nos ayudamos mutuamente cuando hay mucha carga de trabajo.",
            "La dirección prioriza la seguridad sobre la rapidez.",
            "Existe suficiente personal para garantizar una atención segura."
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const form = document.getElementById('survey-form');
    const container = document.getElementById('questions-container');
    const finalScreen = document.getElementById('final-screen');
    const btnStart = document.getElementById('btn-start');
    
    const selCat = document.getElementById('categoria');
    const selAmb = document.getElementById('ambito');
    const errorDiv = document.getElementById('intro-feedback');

    // 1. RENDERIZAR FORMULARIO
    function renderForm() {
        let html = '';
        let qIndex = 0;

        QUESTIONS.forEach(section => {
            html += `<div class="survey-section"><h4 class="section-title">${section.category}</h4>`;
            section.items.forEach(text => {
                html += `
                    <div class="question-card">
                        <label class="question-text">${text}</label>
                        <div class="likert-scale">
                            ${renderLikertOption(qIndex, 1, "Muy en desacuerdo / Nunca")}
                            ${renderLikertOption(qIndex, 2, "En desacuerdo / No")}
                            ${renderLikertOption(qIndex, 3, "Neutro / A veces")}
                            ${renderLikertOption(qIndex, 4, "De acuerdo / Sí")}
                            ${renderLikertOption(qIndex, 5, "Muy de acuerdo / Habitualmente")}
                        </div>
                    </div>`;
                qIndex++;
            });
            html += `</div>`;
        });
        container.innerHTML = html;
    }

    function renderLikertOption(nameIdx, value, label) {
        return `<label class="likert-opt"><input type="radio" name="q${nameIdx}" value="${value}" required><span class="likert-label">${label}</span></label>`;
    }

    // 2. INICIAR
    btnStart.addEventListener('click', () => {
        selCat.classList.remove('input-error');
        selAmb.classList.remove('input-error');
        errorDiv.classList.add('hidden');
        
        let isValid = true;
        if (selCat.value === "ns") { selCat.classList.add('input-error'); isValid = false; }
        if (selAmb.value === "ns") { selAmb.classList.add('input-error'); isValid = false; }

        if (!isValid) {
            errorDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Selecciona Categoría y Ámbito para continuar.';
            errorDiv.classList.remove('hidden');
            return;
        }

        renderForm();
        introScreen.classList.add('hidden');
        form.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    selCat.addEventListener('change', () => selCat.classList.remove('input-error'));
    selAmb.addEventListener('change', () => selAmb.classList.remove('input-error'));

    // 3. ENVIAR DATOS (SOLO ESCRITURA)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        const formData = new FormData(form);
        let answers = {}, totalScore = 0, count = 0, notificaKnowledge = 0;

        for (let [key, value] of formData.entries()) {
            const val = parseInt(value);
            answers[key] = val;
            totalScore += val;
            if (parseInt(key.replace('q', '')) < 4) notificaKnowledge += val;
            count++;
        }

        const avg = (totalScore / count).toFixed(2);
        const notificaAvg = (notificaKnowledge / 4);

        const surveyData = {
            fecha: new Date().toISOString(),
            perfil: { categoria: selCat.value, ambito: selAmb.value },
            respuestas: answers, 
            score_total: totalScore,
            promedio: avg,
            bloque_notifica_avg: notificaAvg
        };

        try {
            await addDoc(collection(db, "encuestas_cultura"), surveyData);
            // console.log("Encuesta enviada");
            
            form.classList.add('hidden');
            finalScreen.classList.remove('hidden');
            showResultsLocal(avg, notificaAvg); // Solo muestra el resultado de ESTA encuesta
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión.");
            btn.disabled = false;
            btn.innerHTML = "Reintentar";
        }
    });

    function showResultsLocal(avg, notificaAvg) {
        const barFill = document.getElementById('score-bar-fill');
        const scoreText = document.getElementById('score-text');
        const percent = ((avg - 1) / 4) * 100; 
        
        setTimeout(() => barFill.style.width = `${percent}%`, 100);

        if (notificaAvg < 3) {
            scoreText.innerHTML = `Diagnóstico: Reforzar uso de NotificaSP.<br>Promedio: ${avg}/5`;
            scoreText.style.color = "#e11d48";
        } else if(avg >= 4) {
            scoreText.innerHTML = `¡Excelente Cultura de Seguridad!<br>Promedio: ${avg}/5`;
            scoreText.style.color = "#10b981";
        } else {
            scoreText.innerHTML = `Cultura Aceptable. Sigamos mejorando.<br>Promedio: ${avg}/5`;
            scoreText.style.color = "#f59e0b";
        }
        window.scrollTo(0, 0);
    }
});
