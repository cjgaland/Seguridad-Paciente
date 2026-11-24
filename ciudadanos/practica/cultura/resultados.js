import { listar, descripcionModo } from "../../../js/core/almacen.js";
document.addEventListener("DOMContentLoaded", () => {
    const aviso = document.getElementById("avisoAlmacen");
    if (aviso) aviso.textContent = descripcionModo();
});


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

});

async function loadData() {
    try {
        const querySnapshot = await listar("encuestas_ciudadanos");
        
        if (querySnapshot.length === 0) {
            updateKPIs(0, 0);
            return;
        }

        allData = [];
        querySnapshot.forEach(doc => {
            const d = doc;
            // Validación básica de datos
            if (d.respuestas && d.perfil) {
                allData.push(d);
            }
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
