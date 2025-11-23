import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// CONFIGURACIÓN DE BLOQUES (Profesionales)
// Mapeo exacto de las 8 preguntas del autotest.js de profesionales
const BLOQUES_INFO = [
    {
        labels: ["1. Apoyo mutuo", "2. Hablar sin miedo", "3. Respeto profesional"],
        indices: [0, 1, 2] // Trabajo en Equipo
    },
    {
        labels: ["4. Prioridad Gerencia", "5. Supervisión escucha"],
        indices: [3, 4] // Gerencia
    },
    {
        labels: ["6. Aprender errores", "7. Medidas tras incidente"],
        indices: [5, 6] // Aprendizaje
    },
    {
        labels: ["8. Dotación personal"],
        indices: [7] // Dotación
    }
];

let allData = [];
let currentAvgQ = new Array(8).fill(0); // 8 Preguntas
let chartDetalleInstance = null;
let chartBloquesInstance = null;
let chartPerfilInstance = null;
let activeBlockIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('filter-role').addEventListener('change', applyFilters);
    document.getElementById('filter-scope').addEventListener('change', applyFilters);
    document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);

    document.querySelectorAll('.chart-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeBlockIndex = parseInt(e.target.dataset.block);
            renderDetalleChart();
        });
    });
});

async function loadData() {
    try {
        // IMPORTANTE: Colección 'encuestas_cultura' (Profesionales)
        const querySnapshot = await getDocs(collection(db, "encuestas_cultura"));
        
        if (querySnapshot.empty) { updateKPIs(0, 0); return; }

        allData = [];
        querySnapshot.forEach(doc => {
            const d = doc.data();
            if (d.respuestas && d.perfil) allData.push(d);
        });
        
        applyFilters();

    } catch (error) {
        console.error("Error:", error);
        alert("Error cargando datos. Verifica permisos Firebase.");
    }
}

function resetFilters() {
    document.getElementById('filter-role').value = "all";
    document.getElementById('filter-scope').value = "all";
    applyFilters();
}

function applyFilters() {
    const roleFilter = document.getElementById('filter-role').value;
    const scopeFilter = document.getElementById('filter-scope').value;

    const filteredData = allData.filter(d => {
        const roleMatch = (roleFilter === 'all') || (d.perfil.categoria === roleFilter);
        const scopeMatch = (scopeFilter === 'all') || (d.perfil.ambito === scopeFilter);
        return roleMatch && scopeMatch;
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
    
    // Acumuladores para los 4 Bloques
    let sumB1=0, sumB2=0, sumB3=0, sumB4=0;
    
    // Acumuladores para las 8 preguntas
    const sumQ = new Array(8).fill(0);

    data.forEach(d => {
        sumGlobal += parseFloat(d.promedio || 0);
        
        // Perfil (Simplificar nombres para gráfico)
        const cat = d.perfil.categoria;
        const mapCat = {'medico':'Facul', 'enfermeria':'Enfer', 'tcae':'TCAE', 'celador':'Celad', 'admin':'Admin'};
        let label = mapCat[cat] || 'Otro';
        perfilCount[label] = (perfilCount[label] || 0) + 1;

        const r = d.respuestas;

        // Bloque 1 (3 items)
        sumB1 += ((r.q0||0) + (r.q1||0) + (r.q2||0)) / 3;
        // Bloque 2 (2 items)
        sumB2 += ((r.q3||0) + (r.q4||0)) / 2;
        // Bloque 3 (2 items)
        sumB3 += ((r.q5||0) + (r.q6||0)) / 2;
        // Bloque 4 (1 item)
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
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
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
            labels: ['Equipo', 'Gerencia', 'Aprendizaje', 'Dotación'],
            datasets: [{
                label: 'Puntuación (1-5)',
                data: [v1, v2, v3, v4],
                backgroundColor: [
                    v1>=3?'#3b82f6':'#ef4444', 
                    v2>=3?'#3b82f6':'#ef4444', 
                    v3>=3?'#3b82f6':'#ef4444',
                    v4>=3?'#3b82f6':'#ef4444'
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