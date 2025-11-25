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

// CONFIGURACIÓN DE BLOQUES
const BLOQUES_INFO = [
    {
        labels: ["1. Se presentaron", "2. Explicación clara", "3. Escucha activa"],
        indices: [0, 1, 2]
    },
    {
        labels: ["4. Higiene manos", "5. Limpieza entorno", "6. Identificación"],
        indices: [3, 4, 5]
    },
    {
        labels: ["7. Animar preguntas", "8. Signos alarma", "9. Participación"],
        indices: [6, 7, 8]
    }
];

// VARIABLES GLOBALES
let allData = [];
let currentAvgQ = [0,0,0,0,0,0,0,0,0]; // Inicializado a ceros
let chartDetalleInstance = null;
let chartBloquesInstance = null;
let chartPerfilInstance = null;
let activeBlockIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Eventos de Filtros
    document.getElementById('filter-role').addEventListener('change', applyFilters);
    document.getElementById('filter-scope').addEventListener('change', applyFilters);
    document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);

    // Eventos de Pestañas (Gráfico Detalle)
    document.querySelectorAll('.chart-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 1. Visual
            document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // 2. Lógica
            activeBlockIndex = parseInt(e.target.dataset.block);
            renderDetalleChart(); 
        });
    });
});

async function loadData() {
    try {
        const querySnapshot = await getDocs(collection(db, "encuestas_ciudadanos"));
        
        if (querySnapshot.empty) {
            updateKPIs(0, 0);
            return;
        }

        allData = [];
        querySnapshot.forEach(doc => {
            const d = doc.data();
            // Validación básica de datos
            if (d.respuestas && d.perfil) {
                allData.push(d);
            }
        });
        
        applyFilters(); // Cargar gráficos con todos los datos

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar datos. Revisa tu conexión.");
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
    
    // Si no hay datos tras filtrar, limpiamos y salimos
    if (total === 0) {
        updateKPIs(0, 0);
        if(chartBloquesInstance) chartBloquesInstance.destroy();
        if(chartDetalleInstance) chartDetalleInstance.destroy();
        if(chartPerfilInstance) chartPerfilInstance.destroy();
        return;
    }

    let sumGlobal = 0;
    const perfilCount = {};
    
    // Acumuladores Bloques
    let sumB1 = 0, sumB2 = 0, sumB3 = 0;
    
    // Acumuladores Preguntas Individuales (q0-q8)
    const sumQ = new Array(9).fill(0);

    data.forEach(d => {
        sumGlobal += parseFloat(d.promedio || 0);
        
        // Perfil
        let label = d.perfil.categoria === 'paciente' ? 'Pacientes' : 'Familiares';
        perfilCount[label] = (perfilCount[label] || 0) + 1;

        const r = d.respuestas;
        
        // Sumas Bloques (Aseguramos que sean números)
        sumB1 += ((r.q0||0) + (r.q1||0) + (r.q2||0)) / 3;
        sumB2 += ((r.q3||0) + (r.q4||0) + (r.q5||0)) / 3;
        sumB3 += ((r.q6||0) + (r.q7||0) + (r.q8||0)) / 3;

        // Sumas Preguntas
        for(let i=0; i<9; i++) {
            sumQ[i] += parseFloat(r[`q${i}`] || 0);
        }
    });

    // Medias Finales
    const avgGlobal = (sumGlobal / total).toFixed(2);
    const avgB1 = (sumB1 / total).toFixed(2);
    const avgB2 = (sumB2 / total).toFixed(2);
    const avgB3 = (sumB3 / total).toFixed(2);
    
    // --- CORRECCIÓN CRÍTICA: Actualizar la variable GLOBAL ---
    currentAvgQ = sumQ.map(s => (s / total).toFixed(2));

    // Renderizar todo
    updateKPIs(total, avgGlobal);
    renderPieChart(perfilCount);
    renderBloquesChart(avgB1, avgB2, avgB3);
    renderDetalleChart(); // Ahora sí tiene datos en currentAvgQ
}

function updateKPIs(total, avg) {
    document.getElementById('total-responses').textContent = total;
    const s = document.getElementById('global-score');
    s.textContent = avg;
    
    if(avg >= 4) s.style.color = "#10b981";
    else if(avg >= 3) s.style.color = "#f59e0b";
    else s.style.color = "#ef4444";
}

// --- GRÁFICO 1: PERFIL (PIE) ---
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
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });
}

// --- GRÁFICO 2: BLOQUES ---
function renderBloquesChart(v1, v2, v3) {
    const ctx = document.getElementById('chart-bloques');
    if (!ctx) return;

    if (chartBloquesInstance) chartBloquesInstance.destroy();

    chartBloquesInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Comunicación', 'Higiene', 'Participación'],
            datasets: [{
                label: 'Satisfacción (1-5)',
                data: [v1, v2, v3],
                backgroundColor: [
                    v1>=3 ? '#3b82f6':'#ef4444',
                    v2>=3 ? '#3b82f6':'#ef4444',
                    v3>=3 ? '#3b82f6':'#ef4444'
                ],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 5 } },
            plugins: { legend: { display: false } }
        }
    });
}

// --- GRÁFICO 3: DETALLE DINÁMICO ---
function renderDetalleChart() {
    const ctx = document.getElementById('chart-detalle');
    if (!ctx) return;
    
    if (chartDetalleInstance) chartDetalleInstance.destroy();

    // 1. Coger configuración del bloque actual
    const config = BLOQUES_INFO[activeBlockIndex];
    
    // 2. Coger datos (CORREGIDO: ahora currentAvgQ ya tiene datos)
    const dataValues = config.indices.map(idx => currentAvgQ[idx]);
    
    // 3. Colores dinámicos
    const colors = dataValues.map(v => v >= 4 ? '#10b981' : (v >= 3 ? '#f59e0b' : '#ef4444'));

    chartDetalleInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: config.labels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors,
                borderRadius: 5,
                barPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true, max: 5, grid: { color: '#f3f4f6' } },
                y: { grid: { display: false } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: (ctx) => `Media: ${ctx.raw}/5` }
                }
            },
            animation: { duration: 500 }
        }
    });
}