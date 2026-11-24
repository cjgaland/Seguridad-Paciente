import { REPOSITORIO_CASOS } from './data/repo.js';

document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTOS DOM
    const menuSection = document.getElementById("menu-section");
    const gameSection = document.getElementById("game-section");
    const caseGrid = document.getElementById("case-grid");
    const btnTopExit = document.getElementById("btn-top-exit"); // --- NUEVO: Referencia al botón superior

    // Elementos del Juego
    const caseBadge = document.getElementById("case-badge");
    const sceneIcon = document.getElementById("scene-icon");
    const storyText = document.getElementById("story-text");
    const optionsContainer = document.getElementById("options-container");
    const feedbackPanel = document.getElementById("feedback-panel");
    const feedbackTitle = document.getElementById("feedback-title");
    const feedbackText = document.getElementById("feedback-text");
    const btnContinue = document.getElementById("btn-continue");
    const healthFill = document.getElementById("health-fill");
    const btnBackMenu = document.getElementById("btn-back-menu");

    let currentCase = null;

    // ==========================================
    // 1. INICIALIZACIÓN: CARGAR MENÚ
    // ==========================================
    initMenu();

    function initMenu() {
        gameSection.classList.add("hidden");
        menuSection.classList.remove("hidden");
        caseGrid.innerHTML = "";

        // --- NUEVO: Configurar botón superior para SALIR A APRENDE ---
        btnTopExit.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Volver a Aprende';
        btnTopExit.onclick = () => {
            window.location.href = "../aprende.html";
        };

        REPOSITORIO_CASOS.forEach(caso => {
            const card = document.createElement("div");
            card.className = "case-card-menu";
            
            let badgeClass = "easy";
            if(caso.difficulty === "Medio") badgeClass = "medium";
            if(caso.difficulty === "Difícil") badgeClass = "hard";

            card.innerHTML = `
                <div class="card-icon"><i class="fa-solid ${caso.icon}"></i></div>
                <div class="card-content">
                    <h3>${caso.title}</h3>
                    <span class="badge ${badgeClass}">${caso.difficulty}</span>
                    <p>${caso.description}</p>
                    <button class="btn-start-case">Iniciar Caso</button>
                </div>
            `;

            card.querySelector(".btn-start-case").addEventListener("click", () => {
                startGame(caso);
            });

            caseGrid.appendChild(card);
        });
    }

    // ==========================================
    // 2. MOTOR DEL JUEGO
    // ==========================================
    function startGame(casoData) {
        currentCase = casoData;
        
        menuSection.classList.add("hidden");
        gameSection.classList.remove("hidden");
        
        // --- NUEVO: Configurar botón superior para VOLVER AL MENÚ ---
        btnTopExit.innerHTML = '<i class="fa-solid fa-list"></i> Menú de Casos';
        btnTopExit.onclick = () => {
            initMenu(); // Recarga el menú sin salir de la página
        };

        // Configuración inicial
        caseBadge.textContent = casoData.title;
        healthFill.style.width = "100%";
        healthFill.style.backgroundColor = "#22c55e";
        
        loadStep("start");
    }

    function loadStep(stepId) {
        const step = currentCase.steps[stepId];
        if (!step) return;

        storyText.textContent = step.text;
        sceneIcon.className = "scene-visual"; 
        sceneIcon.innerHTML = `<i class="fa-solid ${step.icon || 'fa-circle-question'}"></i>`;

        if (step.health !== undefined) {
            updateHealth(step.health);
        }

        optionsContainer.innerHTML = "";

        if (step.ending) {
            handleEnding(step);
            return;
        }

        step.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.innerHTML = `<i class="fa-solid ${opt.icon}"></i> ${opt.text}`;
            
            btn.addEventListener("click", () => {
                if (opt.risk && opt.risk !== "none") {
                    showFeedback(opt);
                } else {
                    loadStep(opt.next);
                }
            });
            optionsContainer.appendChild(btn);
        });
    }

    function showFeedback(option) {
        feedbackPanel.classList.remove("hidden");
        
        if (option.risk === "high" || option.risk === "critical") {
            feedbackPanel.className = "feedback-panel bad";
            feedbackTitle.textContent = "¡Cuidado!";
            feedbackText.textContent = "Esa decisión introduce un riesgo latente.";
            sceneIcon.classList.add("danger");
        } else {
            feedbackPanel.className = "feedback-panel"; 
            feedbackTitle.textContent = "Decisión";
            feedbackText.textContent = "Continuando...";
        }

        btnContinue.textContent = "Continuar";
        btnContinue.onclick = () => {
            feedbackPanel.classList.add("hidden");
            sceneIcon.classList.remove("danger");
            loadStep(option.next);
        };
    }

    function handleEnding(step) {
    // 1. PRIMERO manejar el feedback panel (ANÁLISIS)
    feedbackPanel.classList.remove("hidden");
    
    if (step.ending === "bad") {
        feedbackPanel.className = "feedback-panel bad";
        feedbackTitle.textContent = "❌ Incidente de Seguridad";
        sceneIcon.classList.add("danger");
    } else if (step.ending === "good") {
        feedbackPanel.className = "feedback-panel good";
        feedbackTitle.textContent = "✅ ¡Caso Resuelto!";
        sceneIcon.classList.add("success");
    } else {
        feedbackPanel.className = "feedback-panel";
        feedbackTitle.textContent = "⚠️ Resultado Parcial";
    }

    feedbackText.innerHTML = `
        <strong>${step.text}</strong>
        <br><br>
        <em>${step.reason}</em>
    `;
    
    btnContinue.textContent = "Ver análisis completo";
    btnContinue.onclick = () => {
        feedbackPanel.classList.add("hidden");
        // NO llamamos initMenu() aquí, dejamos que el botón del options-container lo haga
    };

    // 2. LUEGO manejar las opciones (para compatibilidad con casos existentes)
    optionsContainer.innerHTML = "";
    
    if (!step.options) {
        // Si el paso final NO tiene opciones definidas, mostramos el botón por defecto
        optionsContainer.innerHTML = `
            <button class="choice-btn" id="btn-finish">
                <i class="fa-solid fa-list"></i> Volver al Menú de Casos
            </button>
        `;
        
        document.getElementById("btn-finish").addEventListener("click", initMenu);
    } else {
        // Si el paso final SÍ tiene opciones (para casos que lo necesiten)
        step.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.innerHTML = `<i class="fa-solid ${opt.icon}"></i> ${opt.text}`;
            btn.addEventListener("click", () => {
                if (opt.next === "menu") {
                    initMenu();
                } else {
                    loadStep(opt.next);
                }
            });
            optionsContainer.appendChild(btn);
        });
    }
}

    function updateHealth(val) {
        healthFill.style.width = val + "%";
        if(val < 50) healthFill.style.backgroundColor = "#ef4444";
        else if(val < 80) healthFill.style.backgroundColor = "#f59e0b";
        else healthFill.style.backgroundColor = "#22c55e";
    }

    if(btnBackMenu) {
        btnBackMenu.addEventListener("click", initMenu);
    }
});