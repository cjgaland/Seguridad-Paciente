import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// TU CONFIGURACIÓN DE FIREBASE
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

// PREGUNTAS CIUDADANÍA
const QUESTIONS = [
    {
        category: "Comunicación y Claridad",
        items: [
            "Los profesionales sanitarios se presentaron (me dijeron su nombre y qué hacían).",
            "Me explicaron mi diagnóstico y tratamiento con palabras que pude entender.",
            "Sentí que escuchaban mis preocupaciones sin prisas."
        ]
    },
    {
        category: "Entorno Seguro e Higiene",
        items: [
            "Observé que el personal se lavaba las manos (o usaba gel) antes de atenderme.",
            "La habitación/consulta estaba limpia y ordenada.",
            "Me comprobaron la identidad (nombre/pulsera) antes de darme medicación o hacerme pruebas."
        ]
    },
    {
        category: "Participación",
        items: [
            "Me animaron a hacer preguntas si tenía dudas.",
            "Me explicaron los signos de alarma por los que debería volver a consultar.",
            "Me sentí parte activa en la toma de decisiones sobre mi salud."
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

    // 1. RENDERIZAR
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
                            ${renderLikertOption(qIndex, 1, "Nunca")}
                            ${renderLikertOption(qIndex, 2, "Pocas veces")}
                            ${renderLikertOption(qIndex, 3, "A veces")}
                            ${renderLikertOption(qIndex, 4, "Casi siempre")}
                            ${renderLikertOption(qIndex, 5, "Siempre")}
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
            errorDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Selecciona tus datos para continuar.';
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

    // 3. ENVIAR A FIREBASE (Colección ciudadanos)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        const formData = new FormData(form);
        let answers = {};
        let totalScore = 0;
        let count = 0;

        for (let [key, value] of formData.entries()) {
            const val = parseInt(value);
            answers[key] = val;
            totalScore += val;
            count++;
        }

        const avg = (totalScore / count).toFixed(2);

        const surveyData = {
            fecha: new Date().toISOString(),
            perfil: { categoria: selCat.value, ambito: selAmb.value },
            respuestas: answers, 
            score_total: totalScore,
            promedio: avg
        };

        try {
            // CAMBIO CLAVE: Colección "encuestas_ciudadanos"
            await addDoc(collection(db, "encuestas_ciudadanos"), surveyData);
            console.log("Encuesta ciudadana enviada");
            
            form.classList.add('hidden');
            finalScreen.classList.remove('hidden');
            showResults(avg);
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión.");
            btn.disabled = false;
            btn.innerHTML = "Reintentar";
        }
    });

    function showResults(avg) {
        const barFill = document.getElementById('score-bar-fill');
        const scoreText = document.getElementById('score-text');
        const percent = ((avg - 1) / 4) * 100; 
        
        setTimeout(() => barFill.style.width = `${percent}%`, 100);

        let msg = "";
        if(avg >= 4) {
            msg = "¡Experiencia de Seguridad Excelente!";
            scoreText.style.color = "#10b981";
        } else if (avg >= 3) {
            msg = "Experiencia Aceptable. Gracias por ayudarnos a mejorar.";
            scoreText.style.color = "#f59e0b";
        } else {
            msg = "Hemos detectado áreas de mejora. Gracias por tu sinceridad.";
            scoreText.style.color = "#ef4444";
        }

        scoreText.textContent = msg;
        window.scrollTo(0, 0);
    }
});