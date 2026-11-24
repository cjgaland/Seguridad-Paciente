// ======================================================
//  DATOS: LISTA DE VERIFICACIÓN (Basado en OMS)
// ======================================================
const FASES = [
    {
        id: 1,
        titulo: "Entrada (Sign In)",
        desc: "Antes de la inducción de anestesia. (Con Enfermero/a y Anestesista)",
        items: [
            "Se ha confirmado la <strong>identidad</strong> del paciente.",
            "Se ha confirmado el <strong>sitio quirúrgico</strong>.",
            "Se ha confirmado el <strong>procedimiento</strong>.",
            "Se ha confirmado el <strong>consentimiento informado</strong>.",
            "Demarcación del sitio quirúrgico (si procede).",
            "Control de la seguridad de la anestesia completado.",
            "Pulsioxímetro colocado y funcionando.",
            "¿Tiene el paciente <strong>alergias</strong> conocidas?",
            "¿Vía aérea difícil o riesgo de aspiración?",
            "¿Riesgo de hemorragia > 500ml?"
        ]
    },
    {
        id: 2,
        titulo: "Pausa Quirúrgica (Time Out)",
        desc: "Antes de la incisión cutánea. (Todo el equipo presente)",
        items: [
            "Confirmación de que <strong>todos</strong> los miembros del equipo se han presentado.",
            "Cirujano, anestesista y enfermero confirman verbalmente la <strong>identidad</strong>, <strong>sitio</strong> y <strong>procedimiento</strong>.",
            "¿Se ha administrado profilaxis antibiótica en los últimos 60 min?",
            "<strong>Cirujano:</strong> ¿Pasos críticos o inesperados? ¿Duración?",
            "<strong>Anestesista:</strong> ¿Algún problema específico del paciente?",
            "<strong>Enfermería:</strong> ¿Esterilidad confirmada? ¿Dudas con el instrumental?",
            "¿Pueden visualizarse las imágenes diagnósticas esenciales?"
        ]
    },
    {
        id: 3,
        titulo: "Salida (Sign Out)",
        desc: "Antes de que el paciente salga del quirófano. (Con Enfermero/a)",
        items: [
            "El enfermero/a confirma verbalmente el nombre del procedimiento.",
            "Recuento de instrumentos, gasas y agujas <strong>correcto</strong>.",
            "Etiquetado de muestras (nombre del paciente correcto).",
            "¿Ha habido problemas con el instrumental o los equipos?",
            "Cirujano, anestesista y enfermero revisan aspectos clave para la <strong>recuperación</strong> y tratamiento."
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    let currentPhaseIndex = 0;
    
    // Referencias DOM
    const itemsContainer = document.getElementById('items-container');
    const phaseTitle = document.getElementById('phase-title');
    const phaseDesc = document.getElementById('phase-desc');
    const btnNext = document.getElementById('btn-next');
    const errorMsg = document.getElementById('error-msg');
    
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    const checklistCard = document.querySelector('.checklist-card');
    const finalScreen = document.getElementById('final-screen');

    // INICIAR
    renderPhase(0);

    function renderPhase(index) {
        const fase = FASES[index];
        
        // 1. Actualizar textos
        phaseTitle.textContent = `Fase ${index + 1}: ${fase.titulo}`;
        phaseDesc.textContent = fase.desc;

        // 2. Generar Checkboxes
        itemsContainer.innerHTML = "";
        fase.items.forEach((itemText, i) => {
            const div = document.createElement('div');
            div.className = 'check-item';
            div.innerHTML = `
                <input type="checkbox" class="check-input" id="chk-${i}">
                <label for="chk-${i}" class="check-text">${itemText}</label>
            `;
            
            // Evento click en toda la fila para facilitar marcado
            div.addEventListener('click', (e) => {
                // Si el click no fue directo en el checkbox, lo marcamos nosotros
                if (e.target.type !== 'checkbox') {
                    const checkbox = div.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                }
                // Estilo visual
                if (div.querySelector('input').checked) {
                    div.classList.add('checked');
                } else {
                    div.classList.remove('checked');
                }
                errorMsg.classList.add('hidden'); // Ocultar error si marca algo
            });

            itemsContainer.appendChild(div);
        });

        // 3. Actualizar Stepper visual
        steps.forEach((step, i) => {
            step.classList.remove('active');
            if (i === index) step.classList.add('active');
            if (i < index) step.classList.add('completed');
        });

        // 4. Texto del Botón (Corregido para evitar warning JSHint)
        if (index === FASES.length - 1) {
            btnNext.innerHTML = 'Finalizar Cirugía <i class="fa-solid fa-flag-checkered"></i>';
        } else {
            btnNext.innerHTML = 'Confirmar y Avanzar <i class="fa-solid fa-arrow-right"></i>';
        }
    }

    // BOTÓN SIGUIENTE
    btnNext.addEventListener('click', () => {
        // Validar si todo está marcado
        const allChecks = document.querySelectorAll('.check-input');
        let allChecked = true;
        
        allChecks.forEach(chk => {
            if (!chk.checked) allChecked = false;
        });

        if (!allChecked) {
            errorMsg.classList.remove('hidden');
            // Pequeña animación de "sacudida"
            btnNext.classList.add('shake');
            setTimeout(() => btnNext.classList.remove('shake'), 500);
            return;
        }

        // Si todo OK
        if (currentPhaseIndex < FASES.length - 1) {
            currentPhaseIndex++;
            renderPhase(currentPhaseIndex);
            // Scroll arriba suave
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // FIN DEL JUEGO
            checklistCard.style.display = 'none';
            finalScreen.classList.remove('hidden');
            document.querySelector('.steps-container').style.display = 'none';
        }
    });
});