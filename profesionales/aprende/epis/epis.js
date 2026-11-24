// ======================================================
//   BASE DE DATOS DE ESCENARIOS Y EPIS
// ======================================================
const DATA_EPIS = {
    standard: {
        title: "Precauciones Estándar",
        desc: "Medidas básicas aplicables a <strong>todos</strong> los pacientes. El objetivo es reducir el riesgo de transmisión por fluidos corporales o piel no intacta.",
        color: "#10b981", // Verde Esmeralda
        list: [
            "Higiene de manos: Antes y después.",
            "Guantes: Solo si hay riesgo de contacto con fluidos.",
            "Mascarilla/Gafas: Solo si hay riesgo de salpicaduras."
        ],
        items: [
            { icon: "fa-hands-bubbles", label: "Higiene Manos", type: "gown" },
            { icon: "fa-mitten", label: "Guantes (Condicional)", type: "gloves" }
        ]
    },
    contact: {
        title: "Precauciones de Contacto",
        desc: "Para pacientes con infecciones transmisibles por contacto directo (piel-piel) o indirecto (fómites). Ej: <i>Clostridioides difficile</i>, Multirresistentes, Escabiosis.",
        color: "#f59e0b", // Naranja
        list: [
            "Ubicación: Habitación individual (preferible).",
            "EPI: Guantes y Bata al entrar.",
            "Equipo de cuidado: De uso exclusivo o desinfección tras uso."
        ],
        items: [
            { icon: "fa-hands-bubbles", label: "Higiene Manos", type: "gown" },
            { icon: "fa-mitten", label: "Guantes", type: "gloves" },
            { icon: "fa-user-nurse", label: "Bata Desechable", type: "gown" }
        ]
    },
    droplet: {
        title: "Precauciones por Gotas",
        desc: "Para infecciones transmitidas por gotas grandes (>5 micras) que viajan corta distancia (<1m). Ej: Gripe, Meningitis bacteriana, Parotiditis.",
        color: "#3b82f6", // Azul
        list: [
            "Mascarilla Quirúrgica: Al estar a menos de 1m.",
            "Paciente: Debe usar mascarilla quirúrgica en traslados.",
            "Protección ocular: Si hay riesgo de salpicadura."
        ],
        items: [
            { icon: "fa-hands-bubbles", label: "Higiene Manos", type: "gown" },
            { icon: "fa-head-side-mask", label: "Masc. Quirúrgica", type: "mask" },
            { icon: "fa-glasses", label: "Protección Ocular", type: "goggles" }
        ]
    },
    airborne: {
        title: "Precauciones Vía Aérea",
        desc: "Para partículas pequeñas (<5 micras) que quedan suspendidas en el aire. Ej: Tuberculosis, Sarampión, Varicela, COVID-19 (procedimientos generadores de aerosoles).",
        color: "#ef4444", // Rojo
        list: [
            "Habitación: Presión negativa (si disponible) y puerta cerrada.",
            "Respirador: FFP2 o FFP3 antes de entrar.",
            "Restricción: Limitar entradas al mínimo imprescindible."
        ],
        items: [
            { icon: "fa-hands-bubbles", label: "Higiene Manos", type: "gown" },
            { icon: "fa-mask-ventilator", label: "Respirador FFP2/3", type: "ffp2" },
            { icon: "fa-glasses", label: "Gafas/Pantalla", type: "goggles" },
            { icon: "fa-mitten", label: "Guantes", type: "gloves" },
            { icon: "fa-user-nurse", label: "Bata Impermeable", type: "gown" }
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".scenario-btn");
    const titleEl = document.getElementById("scenario-title");
    const descEl = document.getElementById("scenario-desc");
    const listEl = document.getElementById("scenario-list");
    const gridEl = document.getElementById("kit-grid");
    const infoBox = document.querySelector(".key-indications");

    // Cargar escenario inicial
    loadScenario("standard");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Quitar active de todos
            buttons.forEach(b => b.classList.remove("active"));
            buttons.forEach(b => b.style.backgroundColor = ""); 
            buttons.forEach(b => b.style.color = ""); 

            // Activar el actual
            btn.classList.add("active");
            const key = btn.dataset.scenario;
            loadScenario(key, btn);
        });
    });

    function loadScenario(key, btnElement = null) {
        const data = DATA_EPIS[key];
        if(!data) return;

        // 1. Actualizar Textos
        titleEl.textContent = data.title;
        titleEl.style.color = data.color;
        descEl.innerHTML = data.desc;
        infoBox.style.borderLeftColor = data.color;

        // 2. Estilo del botón activo
        if(btnElement) {
            btnElement.style.backgroundColor = data.color;
            btnElement.style.borderColor = data.color;
            btnElement.style.color = "white";
        } else {
            // Si es carga inicial, buscar el botón standard
            const initialBtn = document.querySelector('.scenario-btn[data-scenario="standard"]');
            if(initialBtn) {
                initialBtn.style.backgroundColor = data.color;
                initialBtn.style.borderColor = data.color;
                initialBtn.style.color = "white";
            }
        }

        // 3. Generar Lista
        listEl.innerHTML = "";
        data.list.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            listEl.appendChild(li);
        });

        // 4. Generar Iconos (Grid) con animación
        gridEl.innerHTML = "";
        data.items.forEach(item => {
            const card = document.createElement("div");
            card.className = `epi-card ${item.type}`;
            
            const icon = document.createElement("i");
            icon.className = `fa-solid ${item.icon}`;
            
            const text = document.createElement("h5");
            text.textContent = item.label;

            card.appendChild(icon);
            card.appendChild(text);
            gridEl.appendChild(card);
        });
    }
});