document.addEventListener('DOMContentLoaded', () => {
    
    // ESTADO DE LA CALCULADORA
    const scores = {
        sensorial: 0,
        humedad: 0,
        actividad: 0,
        movilidad: 0,
        nutricion: 0,
        roce: 0
    };

    // REFERENCIAS DOM
    const totalScoreEl = document.getElementById('total-score');
    const riskTextEl = document.getElementById('risk-text');
    const modal = document.getElementById('recommendations-modal');
    const modalBody = document.getElementById('modal-body');
    const options = document.querySelectorAll('.opt-btn');

    // EVENT LISTENERS
    options.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            const val = parseInt(btn.dataset.val);

            // 1. Guardar valor
            scores[cat] = val;

            // 2. Actualizar UI (clase 'selected')
            // Quitar de hermanos
            const parent = btn.parentElement;
            parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
            // Poner al actual
            btn.classList.add('selected');
            
            // Marcar tarjeta como completada
            const card = document.getElementById(`card-${cat}`);
            card.classList.add('completed');

            // 3. Recalcular
            calculateTotal();
        });
    });

    // FUNCIONES
    function calculateTotal() {
        let total = 0;
        let completedItems = 0;

        for (let key in scores) {
            if (scores[key] > 0) {
                total += scores[key];
                completedItems++;
            }
        }

        // Mostrar guion si no ha empezado
        if (total === 0) {
            totalScoreEl.textContent = "0";
            riskTextEl.textContent = "--";
            return;
        }

        totalScoreEl.textContent = total;

        // Si están todos los campos, dar veredicto final
        if (completedItems === 6) {
            updateRiskLevel(total);
        } else {
            riskTextEl.textContent = "Calculando...";
            riskTextEl.style.color = "#999";
        }
    }

    function updateRiskLevel(score) {
        let text = "";
        let cls = "";
        let recommendations = "";

        // BAREMOS BRADEN
        if (score <= 12) {
            text = "ALTO RIESGO";
            cls = "alto";
            recommendations = getHighRiskRecs();
        } else if (score <= 14) {
            text = "RIESGO MODERADO";
            cls = "moderado";
            recommendations = getModerateRiskRecs();
        } else {
            text = "BAJO RIESGO / SIN RIESGO";
            cls = "bajo";
            recommendations = getLowRiskRecs();
        }

        riskTextEl.textContent = text;
        riskTextEl.className = `risk-text ${cls}`;
        
        // Preparar modal
        modalBody.innerHTML = recommendations;
    }

    // RECOMENDACIONES (HTML)
    function getHighRiskRecs() {
        return `
            <h4 style="color:#dc2626"><i class="fa-solid fa-circle-exclamation"></i> Actuación Inmediata (Alto Riesgo)</h4>
            <ul>
                <li><strong>Superficie:</strong> Usar colchón de aire alternante o viscoelástico de alta especificación.</li>
                <li><strong>Cambios Posturales:</strong> Estrictos cada 2-3 horas (reloj de cambios).</li>
                <li><strong>Hidratación:</strong> Aplicar ácidos grasos hiperoxigenados (AGHO) en zonas de presión 2 veces/día.</li>
                <li><strong>Protección:</strong> Taloneras y protección local en codos/sacro.</li>
                <li><strong>Nutrición:</strong> Valorar suplementos proteicos.</li>
            </ul>
        `;
    }

    function getModerateRiskRecs() {
        return `
            <h4 style="color:#ea580c"><i class="fa-solid fa-triangle-exclamation"></i> Actuación Preventiva (Riesgo Moderado)</h4>
            <ul>
                <li><strong>Cambios Posturales:</strong> Fomentar movilidad activa o cambios cada 4 horas.</li>
                <li><strong>Piel:</strong> Mantener piel limpia y seca. Controlar humedad (pañales).</li>
                <li><strong>Hidratación:</strong> AGHO en zonas de riesgo 1 vez/día.</li>
                <li><strong>Superficie:</strong> Colchón preventivo estático o dinámico básico.</li>
            </ul>
        `;
    }

    function getLowRiskRecs() {
        return `
            <h4 style="color:#16a34a"><i class="fa-solid fa-check-circle"></i> Cuidados Básicos (Bajo Riesgo)</h4>
            <ul>
                <li><strong>Observación:</strong> Revisar piel diariamente en el aseo.</li>
                <li><strong>Movilidad:</strong> Fomentar deambulación y sedestación.</li>
                <li><strong>Nutrición:</strong> Dieta equilibrada e hidratación oral adecuada.</li>
                <li><strong>Hidratación Piel:</strong> Crema hidratante estándar tras el aseo.</li>
            </ul>
        `;
    }

    // CONTROL DEL MODAL
    window.toggleInfo = function() {
        // Verificar si ha terminado
        const completed = document.querySelectorAll('.calc-card.completed').length;
        if (completed < 6) {
            alert("Por favor, completa todos los campos para ver las recomendaciones específicas.");
            return;
        }
        
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
    };
});