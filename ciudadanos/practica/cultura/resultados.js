import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { GEMINI_API_KEY } from "../../../../js/config.js";

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

// CONFIGURACIÓN DE BLOQUES (CIUDADANOS)
// Asumiendo 8 preguntas en bloques: Info(3), Trato(2), Medicacion(2), Entorno(1)
const BLOQUES_INFO = [
    { labels: ["1. Info Clara", "2. Entendí riesgos", "3. Pude preguntar"], indices: [0, 1, 2] },
    { labels: ["4. Amabilidad", "5. Escucha activa"], indices: [3, 4] },
    { labels: ["6. Info Medicación", "7. Cambios Tratamiento"], indices: [5, 6] },
    { labels: ["8. Limpieza/Entorno"], indices: [7] }
];

let allData = [];
let currentAvgQ = new Array(8).fill(0); 
let chartDetalleInstance = null;
let chartBloquesInstance = null;
let chartPerfilInstance = null;
let activeBlockIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('filter-gender').addEventListener('change', applyFilters);
    document.getElementById('filter-age').addEventListener('change', applyFilters);
    document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);

    document.querySelectorAll('.chart-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeBlockIndex = parseInt(e.target.dataset.block);
            renderDetalleChart();
        });
    });

    // LISTENER IA
    const btnIA = document.getElementById('btn-analizar-ia');
    if(btnIA) btnIA.addEventListener('click', generarAnalisisIA);
});

async function loadData() {
    try {
        // COLECCIÓN CIUDADANOS
        const querySnapshot = await getDocs(collection(db, "encuestas_ciudadanos"));
        
        if (querySnapshot.empty) { updateKPIs(0, 0); return; }

        allData = [];
        querySnapshot.forEach(doc => {
            const d = doc.data();
            if (d.respuestas && d.perfil) allData.push(d);
        });
        
        applyFilters();

    } catch (error) {
        console.error("Error:", error);
        alert("Error cargando datos.");
    }
}

function resetFilters() {
    document.getElementById('filter-gender').value = "all";
    document.getElementById('filter-age').value = "all";
    applyFilters();
}

function applyFilters() {
    const genderFilter = document.getElementById('filter-gender').value;
    const ageFilter = document.getElementById('filter-age').value;

    const filteredData = allData.filter(d => {
        const genderMatch = (genderFilter === 'all') || (d.perfil.genero === genderFilter);
        const ageMatch = (ageFilter === 'all') || (d.perfil.edad === ageFilter);
        return genderMatch && ageMatch;
    });

    processMetrics(filteredData);
}

function processMetrics(data) {
    const total = data.length;
    
    if (total === 0) {
        updateKPIs(0, 0);
        if(chartBloquesInstance) chartBloquesInstance.destroy();
        if(chartDetalleInstance) chartDetalleInstance.destroy();
        if(chartPerfilInstance) chartPerfilInstance.destroy();
        return;
    }

    let sumGlobal = 0;
    const perfilCount = {};
    
    let sumB1=0, sumB2=0, sumB3=0, sumB4=0;
    const sumQ = new Array(8).fill(0);

    data.forEach(d => {
        sumGlobal += parseFloat(d.promedio || 0);
        
        // Gráfico de Perfil (Edad)
        const edad = d.perfil.edad || 'NS/NC';
        perfilCount[edad] = (perfilCount[edad] || 0) + 1;

        const r = d.respuestas;
        sumB1 += ((r.q0||0) + (r.q1||0) + (r.q2||0)) / 3;
        sumB2 += ((r.q3||0) + (r.q4||0)) / 2;
        sumB3 += ((r.q5||0) + (r.q6||0)) / 2;
        sumB4 += (r.q7||0);

        for(let i=0; i<8; i++) sumQ[i] += (r[`q${i}`] || 0);
    });

    const avgGlobal = (sumGlobal / total).toFixed(2);
    const avgB1 = (sumB1 / total).toFixed(2);
    const avgB2 = (sumB2 / total).toFixed(2);
    const avgB3 = (sumB3 / total).toFixed(2);
    const avgB4 = (sumB4 / total).toFixed(2);
    
    currentAvgQ = sumQ.map(s => (s / total).toFixed(2));

    updateKPIs(total, avgGlobal);
    renderPieChart(perfilCount);
    renderBloquesChart(avgB1, avgB2, avgB3, avgB4);
    renderDetalleChart();
}

function updateKPIs(total, avg) {
    document.getElementById('total-responses').textContent = total;
    const s = document.getElementById('global-score');
    s.textContent = avg;
    s.style.color = avg >= 4 ? '#10b981' : (avg >= 3 ? '#f59e0b' : '#ef4444');
}

function renderPieChart(counts) {
    const ctx = document.getElementById('chart-perfil');
    if(!ctx) return;
    if(chartPerfilInstance) chartPerfilInstance.destroy();

    chartPerfilInstance = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    });
}

function renderBloquesChart(v1, v2, v3, v4) {
    const ctx = document.getElementById('chart-bloques');
    if (!ctx) return;
    if (chartBloquesInstance) chartBloquesInstance.destroy();

    chartBloquesInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Información', 'Trato', 'Medicación', 'Entorno'],
            datasets: [{
                label: 'Satisfacción (1-5)',
                data: [v1, v2, v3, v4],
                backgroundColor: [
                    v1>=3?'#0ea5e9':'#ef4444', 
                    v2>=3?'#0ea5e9':'#ef4444', 
                    v3>=3?'#0ea5e9':'#ef4444',
                    v4>=3?'#0ea5e9':'#ef4444'
                ],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 5 } },
            plugins: { legend: { display: false } }
        }
    });
}

function renderDetalleChart() {
    const ctx = document.getElementById('chart-detalle');
    if (!ctx) return;
    if (chartDetalleInstance) chartDetalleInstance.destroy();

    const config = BLOQUES_INFO[activeBlockIndex];
    const blockData = config.indices.map(idx => currentAvgQ[idx]);
    const colors = blockData.map(v => v >= 4 ? '#10b981' : (v >= 3 ? '#f59e0b' : '#ef4444'));

    chartDetalleInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: config.labels,
            datasets: [{
                label: 'Media',
                data: blockData,
                backgroundColor: colors,
                borderRadius: 5,
                barPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            scales: { x: { beginAtZero: true, max: 5 }, y: { grid: { display: false } } },
            plugins: { legend: { display: false } },
            animation: { duration: 500 }
        }
    });
}

// ==========================================
//  IA ANALISTA DE EXPERIENCIA (CIUDADANOS)
// ==========================================

async function generarAnalisisIA() {
    const totalEncuestas = document.getElementById('total-responses').textContent;
    const notaGlobal = document.getElementById('global-score').textContent;
    const filtroGen = document.getElementById('filter-gender').selectedOptions[0].text;
    const filtroEdad = document.getElementById('filter-age').selectedOptions[0].text;
    
    const datosContexto = `
        DATOS DE LA ENCUESTA PREMS (Experiencia Paciente):
        - Total participantes: ${totalEncuestas}
        - Filtro: Género [${filtroGen}] - Edad [${filtroEdad}]
        - Satisfacción Global: ${notaGlobal}/5.0
        - Dimensiones: Información, Trato, Medicación, Entorno.
    `;

    // PROMPT CIUDADANO (HTML VISUAL)
    const prompt = `
        Actúa como un Experto en Experiencia del Paciente (Patient Experience).
        Analiza estos datos: ${datosContexto}
        
        IMPORTANTE: NO RESPONDAS EN MARKDOWN. RESPONDE SOLO CON CÓDIGO HTML.
        Usa esta estructura para el informe DAFO visual:

        <div class="dafo-grid">
            <div class="dafo-box fortalezas">
                <h3>LO MEJOR VALORADO</h3>
                <ul>
                    <li>(Aspecto positivo destacado 1)</li>
                    <li>(Aspecto positivo destacado 2)</li>
                </ul>
            </div>

            <div class="dafo-box debilidades">
                <h3>A MEJORAR</h3>
                <ul>
                    <li>(Punto de dolor detectado 1)</li>
                    <li>(Punto de dolor detectado 2)</li>
                </ul>
            </div>

            <div class="dafo-box oportunidades">
                <h3>OPORTUNIDADES</h3>
                <ul>
                    <li>(Idea para mejorar la experiencia 1)</li>
                    <li>(Idea para mejorar la experiencia 2)</li>
                </ul>
            </div>

            <div class="dafo-box amenazas">
                <h3>RIESGOS PERCIBIDOS</h3>
                <ul>
                    <li>(Posible riesgo de seguridad 1)</li>
                    <li>(Posible riesgo de seguridad 2)</li>
                </ul>
            </div>
        </div>

        <div class="mejora-box">
            <h3>ACCIONES PARA MEJORAR LA EXPERIENCIA</h3>
            <ul>
                <li><strong>Acción 1:</strong> Propuesta concreta.</li>
                <li><strong>Acción 2:</strong> Propuesta concreta.</li>
                <li><strong>Acción 3:</strong> Propuesta concreta.</li>
            </ul>
        </div>

        <div class="conclusion-box">
            (Frase final empática resumiendo el sentir de la ciudadanía).
        </div>
    `;

    // UI Loading
    document.getElementById('ia-loading').style.display = 'block';
    document.getElementById('ia-result').style.display = 'none';
    document.getElementById('ia-disclaimer').style.display = 'none';
    const btn = document.getElementById('btn-analizar-ia');
    btn.disabled = true;

    try {
        const respuestaHTML = await consultarGeminiAPI(prompt);
        
        const resultDiv = document.getElementById('ia-result');
        const htmlLimpio = respuestaHTML.replace(/```html/g, '').replace(/```/g, '');
        resultDiv.innerHTML = htmlLimpio;
        
        document.getElementById('ia-loading').style.display = 'none';
        resultDiv.style.display = 'block';
        document.getElementById('ia-disclaimer').style.display = 'block';
        
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
        document.getElementById('ia-loading').style.display = 'none';
    } finally {
        btn.disabled = false;
    }
}

async function consultarGeminiAPI(promptTexto) {
    const MODEL_NAME = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptTexto }] }] })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || response.statusText);
    }

    const json = await response.json();
    return json.candidates[0].content.parts[0].text;
}
