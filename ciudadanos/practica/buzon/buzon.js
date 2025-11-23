import { CASOS_BUZON } from './data/repo_buzon.js';

document.addEventListener('DOMContentLoaded', () => {
    const caseSelect = document.getElementById('case-select');
    const titleDisplay = document.getElementById('case-title-display');
    const descDisplay = document.getElementById('case-description-display');
    const form = document.getElementById('notifica-form');
    const successScreen = document.getElementById('success-screen');
    const learningPoint = document.querySelector('.learning-point');
    
    const elTipo = document.getElementById('tipo');
    const elDesc = document.getElementById('descripcion');
    
    const msgTipo = document.getElementById('msg-tipo');
    const msgImpacto = document.getElementById('msg-impacto');
    const msgDesc = document.getElementById('msg-desc');

    let currentCase = null;

    init();

    function init() {
        CASOS_BUZON.forEach((caso, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `Situación ${index+1}: ${caso.titulo}`;
            caseSelect.appendChild(opt);
        });
        loadCase(0);
        caseSelect.addEventListener('change', (e) => loadCase(e.target.value));
    }

    function loadCase(index) {
        currentCase = CASOS_BUZON[index];
        titleDisplay.textContent = currentCase.titulo;
        descDisplay.textContent = `"${currentCase.descripcion}"`;
        
        form.reset();
        successScreen.classList.add('hidden');
        [msgTipo, msgImpacto, msgDesc].forEach(el => el.innerHTML = "");
        elTipo.style.borderColor = "#cbd5e1";
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if(!currentCase) return;
        
        let isValid = true;
        let firstError = null;
        const sol = currentCase.solucion;

        // 1. TIPO
        if(elTipo.value !== sol.tipo) {
            msgTipo.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Por favor, debes seleccionar el problema principal`;
            msgTipo.className = "feedback-msg error";
            elTipo.style.borderColor = "#dc2626";
            isValid = false;
            if(!firstError) firstError = elTipo;
        } else {
            msgTipo.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Correcto!`;
            msgTipo.className = "feedback-msg ok";
            elTipo.style.borderColor = "#10b981";
        }

        // 2. GRAVEDAD (RIESGO vs DAÑO)
        const gInput = document.querySelector('input[name="impacto"]:checked');
        if(!gInput || gInput.value !== sol.impacto) {
            msgImpacto.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Piénsalo bien: ¿Hubo daño real o solo riesgo?`;
            msgImpacto.className = "feedback-msg error";
            isValid = false;
            if(!firstError) firstError = document.querySelector('.radio-grid');
        } else {
            msgImpacto.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Bien identificado!`;
            msgImpacto.className = "feedback-msg ok";
        }

        // 3. DESCRIPCION (Opcional pero avisamos)
        if(elDesc.value.trim().length === 0) {
             msgDesc.innerHTML = `<small style="color:#f59e0b">Nota: Intenta dar algún detalle más.</small>`;
        } else {
             msgDesc.innerHTML = "";
        }

        if(isValid) {
            learningPoint.textContent = sol.consejo;
            const btn = form.querySelector('.btn-submit');
            const txt = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            setTimeout(() => {
                successScreen.classList.remove('hidden');
                btn.innerHTML = txt;
            }, 800);
        } else {
            if(firstError) firstError.scrollIntoView({behavior:"smooth", block:"center"});
        }
    });
});