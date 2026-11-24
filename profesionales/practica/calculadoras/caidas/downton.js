document.addEventListener('DOMContentLoaded', () => {
    
    // CONTADORES INTERNOS
    let totalPoints = 0;

    // REFERENCIAS DOM
    const totalScoreEl = document.getElementById('total-score');
    const riskTextEl = document.getElementById('risk-text');
    const modal = document.getElementById('recommendations-modal');
    const modalBody = document.getElementById('modal-body');

    // 1. CONFIGURAR SELECCIÓN ÚNICA (Single Select)
    const singleCards = document.querySelectorAll('.calc-card.single-select');
    singleCards.forEach(card => {
        const btns = card.querySelectorAll('.opt-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Desmarcar hermanos
                btns.forEach(b => b.classList.remove('selected'));
                // Marcar actual
                btn.classList.add('selected');
                calculateTotal();
            });
        });
    });

    // 2. CONFIGURAR SELECCIÓN MÚLTIPLE (Multi Select)
    const multiCards = document.querySelectorAll('.calc-card.multi-select');
    multiCards.forEach(card => {
        const btns = card.querySelectorAll('.opt-btn.multi');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isNone = btn.textContent === "Ninguno";
                
                if (isNone) {
                    // Si pulsas "Ninguno", desmarca todo lo demás
                    const wasSelected = btn.classList.contains('selected');
                    card.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
                    if (!wasSelected) btn.classList.add('selected');
                } else {
                    // Si pulsas un riesgo, desmarca "Ninguno" y togglea el actual
                    const noneBtn = card.querySelector('.opt-btn[data-val="0"]');
                    if (noneBtn) noneBtn.classList.remove('selected');
                    btn.classList.toggle('selected');
                }
                calculateTotal();
            });
        });
    });

    // CÁLCULO
    function calculateTotal() {
        let sum = 0;

        // Sumar todos los botones 'selected' que tengan valor > 0
        const selectedBtns = document.querySelectorAll('.opt-btn.selected');
        selectedBtns.forEach(btn => {
            sum += parseInt(btn.dataset.val);
        });

        totalScoreEl.textContent = sum;
        updateRiskLevel(sum);
    }

    function updateRiskLevel(score) {
        let text = "";
        let cls = "";
        let html = "";

        // BAREMO DOWNTON: > 2 Puntos = Alto Riesgo
        if (score > 2) {
            text = "ALTO RIESGO DE CAÍDAS";
            cls = "alto";
            html = getHighRiskHtml();
        } else {
            text = "BAJO RIESGO";
            cls = "bajo";
            html = getLowRiskHtml();
        }

        riskTextEl.textContent = text;
        riskTextEl.className = `risk-text ${cls}`;
        modalBody.innerHTML = html;
    }

    // CONTENIDO DEL MODAL
    function getHighRiskHtml() {
        return `
            <h4 style="color:#dc2626"><i class="fa-solid fa-bell"></i> Protocolo de Prevención de Caídas (Activar)</h4>
            <ul>
                <li><strong>Identificación:</strong> Colocar distintivo de riesgo (pulsera/cama).</li>
                <li><strong>Entorno:</strong> Barandillas arriba (valorar sujeción si agitación), cama frenada y en posición baja.</li>
                <li><strong>Iluminación:</strong> Luz nocturna adecuada. Timbre a mano.</li>
                <li><strong>Acompañamiento:</strong> No dejar solo en aseo/movilización.</li>
                <li><strong>Revisión:</strong> Reevaluar medicación sedante con facultativo.</li>
            </ul>
        `;
    }

    function getLowRiskHtml() {
        return `
            <h4 style="color:#16a34a"><i class="fa-solid fa-shield-halved"></i> Medidas Estándar</h4>
            <ul>
                <li>Mantener entorno ordenado y libre de obstáculos.</li>
                <li>Calzado adecuado y cerrado (antideslizante).</li>
                <li>Timbre accesible.</li>
                <li>Reevaluar si cambia la condición clínica o medicación.</li>
            </ul>
        `;
    }

    // TOGGLE MODAL
    window.toggleInfo = function() {
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
    };
});