import { OBJETOS } from './mochila_data.js';
import { saveScore } from '../../../../js/core/scores.js';

document.addEventListener('DOMContentLoaded', () => {
    const shelf = document.getElementById('shelf');
    const backpackZone = document.getElementById('backpack-zone');
    const backpackContents = document.getElementById('backpack-contents');
    const scoreEl = document.getElementById('score');
    const remainingEl = document.getElementById('remaining');
    
    // Modal Feedback (Durante el juego)
    const modal = document.getElementById('feedback-modal');
    const modalIcon = document.getElementById('feedback-icon');
    const modalTitle = document.getElementById('feedback-title');
    const modalMsg = document.getElementById('feedback-msg');

    // Final Screen
    const finalScreen = document.getElementById('final-screen');
    const finalScoreEl = document.getElementById('final-score');

    let score = 0;
    let itemsNeeded = OBJETOS.filter(o => o.tipo === 'necesario').length;
    
    // Registro de errores para el informe final
    let mistakesSet = new Set(); 
    
    let draggedItemData = null;

    // 1. INICIALIZAR
    initGame();

    function initGame() {
        // Barajar
        const shuffled = [...OBJETOS].sort(() => 0.5 - Math.random());
        
        shuffled.forEach(obj => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.draggable = true;
            card.dataset.id = obj.id;
            card.innerHTML = `
                <i class="fa-solid ${obj.icono}"></i>
                <span>${obj.nombre}</span>
            `;

            // Eventos Drag (Desktop)
            card.addEventListener('dragstart', (e) => {
                draggedItemData = obj;
                card.classList.add('dragging');
                e.dataTransfer.setData('text/plain', JSON.stringify(obj));
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                draggedItemData = null;
            });

            // Evento Click (Móvil)
            card.addEventListener('click', () => checkItem(obj, card));

            shelf.appendChild(card);
        });

        updateUI();
    }

    // 2. ZONA DROP
    backpackZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        backpackZone.classList.add('drag-over');
    });
    backpackZone.addEventListener('dragleave', () => {
        backpackZone.classList.remove('drag-over');
    });
    backpackZone.addEventListener('drop', (e) => {
        e.preventDefault();
        backpackZone.classList.remove('drag-over');
        let obj = draggedItemData;
        if(!obj) {
            const raw = e.dataTransfer.getData('text/plain');
            if(raw) obj = JSON.parse(raw);
        }
        if(obj) {
            const card = shelf.querySelector(`.item-card[data-id="${obj.id}"]`);
            checkItem(obj, card);
        }
    });

    // 3. VALIDACIÓN
    function checkItem(obj, cardElement) {
        if (obj.tipo === 'necesario') {
            // ACIERTO
            score += 100;
            itemsNeeded--;
            
            if(cardElement) {
                cardElement.parentNode.removeChild(cardElement);
                backpackContents.appendChild(cardElement);
                cardElement.draggable = false;
                cardElement.style.cursor = "default";
                // Animación entrada
                cardElement.animate([
                    { transform: 'scale(0.5)', opacity: 0 },
                    { transform: 'scale(1)', opacity: 1 }
                ], 300);
            }
        } else {
            // ERROR
            score -= 20;
            if (score < 0) score = 0;
            
            // Guardar error para el informe final
            mistakesSet.add(obj.id);

            // Animación rebote
            if(cardElement) {
                cardElement.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)', backgroundColor: '#fee2e2' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)', backgroundColor: 'white' }
                ], 400);
            }

            showFeedback(false, "Mejor déjalo en casa", obj.msg);
        }

        updateUI();

        if (itemsNeeded === 0) {
            setTimeout(endGame, 800);
        }
    }

    function showFeedback(success, title, msg) {
        modal.classList.remove('hidden', 'error', 'success');
        if (success) {
            modal.classList.add('success');
            modalIcon.className = "fa-solid fa-check";
        } else {
            modal.classList.add('error');
            modalIcon.className = "fa-solid fa-hand-paper";
        }
        modalTitle.textContent = title;
        modalMsg.textContent = msg;
    }

    window.closeModal = function() { modal.classList.add('hidden'); };

    function updateUI() {
        scoreEl.textContent = score;
        remainingEl.textContent = itemsNeeded;
    }

    // 4. FIN DEL JUEGO (INFORME)
    function endGame() {
        saveScore("mochila", "ciudadanos", "Usuario", score);
        
        // Generar HTML del informe
        let summaryHTML = '<div class="summary-container">';
        
        // Recorremos todos los objetos originales para ver qué pasó con cada uno
        OBJETOS.forEach(obj => {
            let statusClass = '';
            let icon = '';
            let textPrefix = '';

            if (obj.tipo === 'necesario') {
                // Si es necesario, seguro que lo metió (porque el juego no acaba hasta que están todos)
                statusClass = 'packed';
                icon = '<i class="fa-solid fa-check"></i>';
                textPrefix = 'Guardado:';
            } else {
                // Si es innecesario, vemos si falló intentando meterlo
                if (mistakesSet.has(obj.id)) {
                    statusClass = 'mistake';
                    icon = '<i class="fa-solid fa-xmark"></i>';
                    textPrefix = 'Intentaste llevar (Error):';
                } else {
                    // O si lo ignoró correctamente (Opcional mostrarlo, pero es educativo)
                    return; // Saltamos los que ignoró bien para no llenar la lista, o quita esta línea para mostrarlos
                }
            }

            summaryHTML += `
                <div class="summary-item ${statusClass}">
                    <div class="s-icon">${icon}</div>
                    <div class="s-content">
                        <strong>${textPrefix} ${obj.nombre}</strong>
                        <p>${obj.msg}</p>
                    </div>
                </div>
            `;
        });
        summaryHTML += '</div>';

        // Inyectar en pantalla final (Reemplazamos contenido)
        const contentDiv = finalScreen.querySelector('.final-content');
        contentDiv.innerHTML = `
            <i class="fa-solid fa-trophy trophy-icon"></i>
            <h3>¡Mochila Lista!</h3>
            <p>Has preparado todo lo necesario para un ingreso seguro.</p>
            <p>Puntuación Final: <strong style="font-size:1.5rem; color:#9333ea;">${score}</strong></p>
            
            ${summaryHTML}

            <div class="final-actions">
                <button onclick="location.reload()" class="btn-restart">
                    <i class="fa-solid fa-rotate-right"></i> Repetir
                </button>
                <button onclick="location.href='../ranking.html?juego=mochila&nivel=ciudadanos'" class="btn-ranking">
                    <i class="fa-solid fa-trophy"></i> Ver Ranking
                </button>
            </div>
        `;

        finalScreen.classList.remove('hidden');
    }
});