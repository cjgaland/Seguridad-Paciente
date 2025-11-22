import { CASOS_NOTIFICA } from './data/repo_notifica.js';

document.addEventListener('DOMContentLoaded', () => {
    const caseSelect = document.getElementById('case-select');
    const titleDisplay = document.getElementById('case-title-display');
    const descDisplay = document.getElementById('case-description-display');
    
    const form = document.getElementById('notifica-form');
    const finalMessage = document.getElementById('final-message');
    const learningPoint = document.querySelector('.learning-point');
    
    // Inputs
    const elTipo = document.getElementById('tipo');
    const elFreq = document.getElementById('frecuencia');
    const elDesc = document.getElementById('descripcion');
    
    // Visuales Matriz
    const gravityDisplay = document.getElementById('gravity-display');
    const riskBadge = document.getElementById('risk-result-badge');
    const riskLabel = document.getElementById('risk-label');
    const riskAction = document.getElementById('risk-action');

    // Feedback
    const msgTipo = document.getElementById('msg-tipo');
    const msgImpacto = document.getElementById('msg-impacto');
    const msgRiesgo = document.getElementById('msg-riesgo');
    const msgDesc = document.getElementById('msg-desc');

    let currentCase = null;

    init();

    function init() {
        CASOS_NOTIFICA.forEach((caso, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `Caso ${index+1}: ${caso.titulo}`;
            caseSelect.appendChild(opt);
        });
        loadCase(0);
        caseSelect.addEventListener('change', (e) => loadCase(e.target.value));

        // LISTENERS DE FEEDBACK INMEDIATO
        elTipo.addEventListener('change', validateType);
        
        document.querySelectorAll('input[name="impacto"]').forEach(r => {
            r.addEventListener('change', () => {
                updateRiskMatrix();
                validateImpacto();
            });
        });

        elFreq.addEventListener('change', () => {
            updateRiskMatrix();
            validateFrecuencia();
        });
    }

    function loadCase(index) {
        currentCase = CASOS_NOTIFICA[index];
        titleDisplay.textContent = currentCase.titulo;
        descDisplay.textContent = `"${currentCase.descripcion}"`;
        
        // Restaurar estado inicial
        form.reset();
        form.classList.remove('hidden');
        finalMessage.classList.add('hidden');
        
        resetUI();
        updateRiskMatrix();
    }

    function resetUI() {
        [msgTipo, msgImpacto, msgRiesgo, msgDesc].forEach(el => el.innerHTML = "");
        elTipo.style.borderColor = "#cbd5e1";
        elFreq.style.borderColor = "#cbd5e1";
        gravityDisplay.textContent = "--";
        gravityDisplay.style.color = "#94a3b8";
        riskBadge.className = "risk-result";
        riskLabel.textContent = "--";
        riskAction.textContent = "Completa los campos";
    }

    // --- VALIDACIONES INMEDIATAS ---

    function validateType() {
        if (!currentCase) return;
        if (elTipo.value === currentCase.solucion.tipo) {
            msgTipo.innerHTML = `<i class="fa-solid fa-check-circle"></i> ¡Correcto!`;
            msgTipo.className = "feedback-msg ok";
            elTipo.style.borderColor = "#16a34a";
            return true;
        } else {
            msgTipo.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrecto. Revisa la causa principal.`;
            msgTipo.className = "feedback-msg error";
            elTipo.style.borderColor = "#dc2626";
            return false;
        }
    }

    function validateImpacto() {
        if (!currentCase) return;
        const input = document.querySelector('input[name="impacto"]:checked');
        if (!input) return false;

        if (input.value === currentCase.solucion.impacto) {
            msgImpacto.innerHTML = `<i class="fa-solid fa-check-circle"></i> Clasificación correcta.`;
            msgImpacto.className = "feedback-msg ok";
            return true;
        } else {
            msgImpacto.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrecto. ¿Llegó al paciente? ¿Hubo daño?`;
            msgImpacto.className = "feedback-msg error";
            return false;
        }
    }

    function validateFrecuencia() {
        if (!currentCase) return;
        if (elFreq.value === currentCase.solucion.frecuencia) {
            msgRiesgo.innerHTML = `<i class="fa-solid fa-check-circle"></i> Estimación correcta.`;
            msgRiesgo.className = "feedback-msg ok";
            elFreq.style.borderColor = "#16a34a";
            return true;
        } else {
            msgRiesgo.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Frecuencia errónea (lee el texto).`;
            msgRiesgo.className = "feedback-msg error";
            elFreq.style.borderColor = "#dc2626";
            return false;
        }
    }

    function updateRiskMatrix() {
        const gravedadInput = document.querySelector('input[name="impacto"]:checked');
        const freq = elFreq.value;
        
        if (gravedadInput) {
            const val = gravedadInput.value;
            let text = "", color = "#333";
            if(val === 'cuasi') { text = "Cuasi-Incidente"; color = "#16a34a"; }
            if(val === 'leve') { text = "Incidente Leve"; color = "#d97706"; }
            if(val === 'adverso') { text = "Evento Adverso"; color = "#ea580c"; }
            if(val === 'centinela') { text = "Evento Centinela"; color = "#dc2626"; }
            gravityDisplay.textContent = text;
            gravityDisplay.style.color = color;
        } else {
            gravityDisplay.textContent = "--";
            gravityDisplay.style.color = "#94a3b8";
        }

        if(!gravedadInput || !freq) {
            riskBadge.className = "risk-result";
            riskLabel.textContent = "--";
            return;
        }

        const g = gravedadInput.value;
        let nivel = 'bajo', accion = 'Gestión < 30 días';

        if (g === 'centinela') { nivel = 'muy-alto'; accion = 'ACR Inmediato (<48h)'; }
        else if (g === 'adverso') {
            if (freq === 'frecuente') { nivel = 'muy-alto'; accion = 'Actuación (<72h)'; }
            else { nivel = 'moderado'; accion = 'ACR (<14 días)'; }
        } else {
            if (freq === 'frecuente') { nivel = 'moderado'; accion = 'Análisis tendencias'; }
            else { nivel = 'bajo'; accion = 'Seguimiento'; }
        }

        riskBadge.className = `risk-result ${nivel}`;
        riskLabel.textContent = nivel.replace('-', ' ').toUpperCase();
        riskAction.textContent = accion;
    }

    // ENVÍO FINAL
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Verificar todo de nuevo
        const v1 = validateType();
        const v2 = validateImpacto();
        const v3 = validateFrecuencia();
        
        // Descripción opcional pero recomendable
        const v4 = elDesc.value.trim().length > 0;
        if(!v4) msgDesc.innerHTML = `<small style="color:#ea580c">Nota: Descripción vacía</small>`;

        if (v1 && v2 && v3) {
            // TODO CORRECTO
            learningPoint.textContent = currentCase.solucion.consejo;
            
            form.classList.add('hidden'); // Ocultar formulario
            finalMessage.classList.remove('hidden'); // Mostrar éxito
        } else {
            // Si hay errores, scroll al primero
            if(!v1) elTipo.scrollIntoView({behavior:"smooth", block:"center"});
            else if(!v2) document.querySelector('.radio-grid').scrollIntoView({behavior:"smooth", block:"center"});
            else if(!v3) elFreq.scrollIntoView({behavior:"smooth", block:"center"});
        }
    });
});