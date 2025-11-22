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

document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando Dashboard...");
    loadData();
});

async function loadData() {
    try {
        const querySnapshot = await getDocs(collection(db, "encuestas_cultura"));
        
        if (querySnapshot.empty) {
            document.getElementById('total-responses').textContent = "0";
            return;
        }

        const data = [];
        querySnapshot.forEach(doc => {
            // Validación básica para evitar errores si hay datos corruptos
            const d = doc.data();
            if (d.respuestas && d.perfil) data.push(d);
        });
        
        processData(data);

    } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Error leyendo datos. Verifica las Reglas de Firebase.");
    }
}

function processData(data) {
    const total = data.length;
    let sumGlobal = 0;
    let sumNotifica = 0;
    const perfilesCount = {};
    let sumBloque1 = 0, sumBloque2 = 0, sumBloque3 = 0;

    data.forEach(d => {
        // KPIs
        sumGlobal += parseFloat(d.promedio || 0);
        sumNotifica += parseFloat(d.bloque_notifica_avg || 0);

        // Perfiles
        const cat = d.perfil.categoria || 'ns';
        const labels = { 'medico': 'Facultativo', 'enfermeria': 'Enfermería', 'tcae': 'TCAE', 'celador': 'Celador', 'admin': 'Admin', 'ns': 'NS/NC', 'otro': 'Otro' };
        const label = labels[cat] || cat;
        perfilesCount[label] = (perfilesCount[label] || 0) + 1;

        // Bloques
        const r = d.respuestas;
        sumBloque1 += ((r.q0||0)+(r.q1||0)+(r.q2||0)+(r.q3||0))/4;
        sumBloque2 += ((r.q4||0)+(r.q5||0)+(r.q6||0))/3;
        sumBloque3 += ((r.q7||0)+(r.q8||0)+(r.q9||0))/3;
    });

    const avgGlobal = (sumGlobal / total).toFixed(2);
    const avgNotifica = (sumNotifica / total).toFixed(2);
    
    const avgB1 = (sumBloque1 / total).toFixed(2);
    const avgB2 = (sumBloque2 / total).toFixed(2);
    const avgB3 = (sumBloque3 / total).toFixed(2);

    // PINTAR KPIs
    document.getElementById('total-responses').textContent = total;
    document.getElementById('global-score').textContent = avgGlobal;
    document.getElementById('notifica-score').textContent = avgNotifica;
    
    document.getElementById('global-score').style.color = avgGlobal >= 4 ? '#16a34a' : (avgGlobal >= 3 ? '#ea580c' : '#dc2626');
    document.getElementById('notifica-score').style.color = avgNotifica >= 3 ? '#16a34a' : '#dc2626';

    // PINTAR GRÁFICOS
    renderChartPerfil(perfilesCount);
    renderChartDimensiones(avgB1, avgB2, avgB3);
}

function renderChartPerfil(counts) {
    const ctx = document.getElementById('chart-perfil');
    if(!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
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

function renderChartDimensiones(b1, b2, b3) {
    const ctx = document.getElementById('chart-dimensiones');
    if(!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Conocimiento NotificaSP', 'Aprendizaje', 'Clima Equipo'],
            datasets: [{
                label: 'Puntuación Media (1-5)',
                data: [b1, b2, b3],
                backgroundColor: [
                    b1 >= 3 ? '#3b82f6' : '#ef4444',
                    b2 >= 3 ? '#3b82f6' : '#ef4444',
                    b3 >= 3 ? '#3b82f6' : '#ef4444'
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