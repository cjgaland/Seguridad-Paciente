import { bancoPreguntas } from "./questions.js";

export async function initQuiz({ root, saveScoreFirebase }) {

    // --- ESTADO DEL JUEGO ---
    const st = {
        nivel: null,
        poolPreguntas: [], // Preguntas del nivel barajadas
        idx: 0,            // Índice actual
        
        // Marcadores
        tiempoTotal: 60,   // Segundos globales para todo el test
        puntos: 0,
        aciertos: 0,
        fallos: 0,
        
        // Control
        timerInterval: null,
        enPausa: false,
        inicioPregunta: 0, // Timestamp para calcular velocidad de respuesta
        
        // Historial para resumen final
        historial: [] 
    };

    // --- UTILIDADES ---
    function $(sel) { return root.querySelector(sel); }
    
    // Algoritmo Fisher-Yates para barajar arrays
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // --- 1. RENDER: MENÚ PRINCIPAL ---
    function renderMenu() {
        const ultimoJugador = localStorage.getItem("jugador-sp") || "";
        
        root.innerHTML = `
            <div class="mt-panel text-center">
                <h2 style="color:#F5A623; margin-bottom:10px;">
                    <i class="fa-solid fa-stopwatch"></i> Time Attack Quiz
                </h2>
                <p style="color:#666;">Tienes <strong>60 segundos</strong> para responder. ¡La velocidad da puntos extra!</p>
                
                <div class="player-input-area" style="margin: 15px auto; max-width: 300px;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#555;">NOMBRE DEL JUGADOR</label>
                    <input type="text" id="menuPlayerName" class="player-input" value="${ultimoJugador}" placeholder="Escribe tu nombre...">
                </div>

                <div class="level-grid">
                    <button class="btn-level" data-lvl="nivel1">
                        <span class="lvl-badge">Básico</span>
                        <strong>Fundamentos</strong>
                    </button>
                    <button class="btn-level" data-lvl="nivel2">
                        <span class="lvl-badge adv">Avanzado</span>
                        <strong>Clínico</strong>
                    </button>
                </div>
            </div>
        `;

        root.querySelectorAll(".btn-level").forEach(btn => {
            btn.onclick = () => {
                const nombre = $("#menuPlayerName").value.trim() || "Anónimo";
                localStorage.setItem("jugador-sp", nombre);
                comenzarJuego(btn.dataset.lvl);
            };
        });
    }

    // --- 2. INICIO DE PARTIDA ---
    function comenzarJuego(nivel) {
        st.nivel = nivel;
        st.tiempoTotal = 60; // Tiempo global
        st.puntos = 0;
        st.aciertos = 0;
        st.fallos = 0;
        st.historial = [];
        st.idx = 0;
        st.enPausa = false;

        // 1. Filtramos por nivel
        const preguntasNivel = bancoPreguntas.filter(p => p.nivel === nivel);
        // 2. Barajamos las preguntas (Orden aleatorio cada vez)
        st.poolPreguntas = shuffle([...preguntasNivel]);

        if (st.poolPreguntas.length === 0) {
            alert("No hay preguntas cargadas para este nivel aún.");
            return;
        }

        // Montamos la estructura visual
        renderEstructuraJuego();
        
        // Arrancamos reloj global
        st.timerInterval = setInterval(gameLoop, 1000);
        
        // Cargamos la primera pregunta
        cargarPregunta();
    }

    function renderEstructuraJuego() {
        const nombre = localStorage.getItem("jugador-sp");
        root.innerHTML = `
            <div class="mt-panel">
                <!-- HUD (Marcadores) -->
                <div class="kpi">
                    <div class="box">
                        <div class="muted">TIEMPO</div>
                        <div id="hud-time" class="value" style="color:#d97706">${st.tiempoTotal}</div>
                    </div>
                    <div class="box">
                        <div class="muted">PUNTOS</div>
                        <div id="hud-score" class="value">0</div>
                    </div>
                    <div class="box" id="box-hits">
                        <div class="muted">ACIERTOS</div>
                        <div id="hud-hits" class="value">0</div>
                    </div>
                    <div class="box" id="box-miss">
                        <div class="muted">FALLOS</div>
                        <div id="hud-miss" class="value">0</div>
                    </div>
                    <div class="box player-box">
                        <div class="muted">JUGADOR</div>
                        <div style="font-weight:bold; font-size:0.9rem; margin-top:5px;">${nombre}</div>
                    </div>
                </div>

                <!-- ÁREA DE PREGUNTA -->
                <div class="question-area" id="question-container">
                    <!-- Se inyecta dinámicamente -->
                </div>
            </div>
        `;
    }

    // --- 3. LOOP PRINCIPAL (TIMER) ---
    function gameLoop() {
        if (st.enPausa) return; // Si estamos mostrando feedback, el tiempo no corre

        st.tiempoTotal--;
        $("#hud-time").textContent = st.tiempoTotal;

        if (st.tiempoTotal <= 0) {
            finalizarJuego(false); // false = Se acabó el tiempo
        }
    }

    // --- 4. CARGAR PREGUNTA ---
    function cargarPregunta() {
        // Si hemos completado todas las preguntas disponibles
        if (st.idx >= st.poolPreguntas.length) {
            finalizarJuego(true); // true = Completó el set
            return;
        }

        const datosP = st.poolPreguntas[st.idx];
        const contenedor = $("#question-container");

        // PREPARAR OPCIONES ALEATORIAS
        // Mapeamos opciones originales a objetos { texto, esCorrecta }
        let opcionesObj = datosP.opciones.map((texto, index) => ({
            texto: texto,
            esCorrecta: index === datosP.correcta
        }));

        // Barajamos las opciones para que la posición cambie siempre
        opcionesObj = shuffle(opcionesObj);

        // Renderizamos
        contenedor.innerHTML = `
            <div class="q-text">${datosP.pregunta}</div>
            <div class="options-grid">
                ${opcionesObj.map((opt, i) => `
                    <button class="btn-opt" data-idx="${i}">
                        ${opt.texto}
                    </button>
                `).join('')}
            </div>
        `;

        // Asignar eventos a los botones recién creados
        contenedor.querySelectorAll(".btn-opt").forEach((btn, i) => {
            btn.onclick = () => verificarRespuesta(opcionesObj[i], btn, datosP);
        });

        st.inicioPregunta = Date.now(); // Marca de tiempo para calcular bonus de velocidad
    }

    // --- 5. VERIFICAR RESPUESTA ---
    function verificarRespuesta(opcionElegida, btnDOM, datosPregunta) {
        if (st.enPausa) return; // Evitar doble click
        
        st.enPausa = true; // Pausar Timer Global mientras mostramos feedback

        const tiempoReaccion = (Date.now() - st.inicioPregunta) / 1000; // Segundos que tardó
        let puntosGanados = 0;
        let esAcierto = opcionElegida.esCorrecta;

        // ACTUALIZAR ESTADO
        if (esAcierto) {
            st.aciertos++;
            // FÓRMULA PUNTUACIÓN: Base 100 + Bonus Velocidad
            let bonus = 0;
            if (tiempoReaccion < 3) bonus = 50;      // Respuesta "flash"
            else if (tiempoReaccion < 6) bonus = 20; // Respuesta rápida
            
            puntosGanados = 100 + bonus;
            st.puntos += puntosGanados;

            btnDOM.classList.add("correct");
            mostrarFeedback(true, puntosGanados, datosPregunta.explicacion);
        } else {
            st.fallos++;
            btnDOM.classList.add("wrong");
            // Mostramos feedback de error
            mostrarFeedback(false, 0, datosPregunta.explicacion);
        }

        // ACTUALIZAR HUD
        $("#hud-score").textContent = st.puntos;
        $("#hud-hits").textContent = st.aciertos;
        $("#hud-miss").textContent = st.fallos;

        // GUARDAR HISTORIAL (Para el resumen final)
        st.historial.push({
            pregunta: datosPregunta.pregunta,
            resultado: esAcierto ? "ok" : "bad",
            explicacion: datosPregunta.explicacion
        });
    }

    // --- 6. FEEDBACK INMEDIATO (Toast Overlay) ---
    function mostrarFeedback(esCorrecto, puntos, explicacion) {
        const contenedor = $("#question-container");
        
        const overlay = document.createElement("div");
        overlay.className = "feedback-overlay";
        
        const icono = esCorrecto ? '<i class="fa-solid fa-circle-check" style="color:#16a34a"></i>' : '<i class="fa-solid fa-circle-xmark" style="color:#dc2626"></i>';
        const titulo = esCorrecto ? `¡Correcto! (+${puntos})` : "¡Incorrecto!";
        const estiloTitulo = esCorrecto ? "color:#16a34a" : "color:#dc2626";

        overlay.innerHTML = `
            <div class="fb-icon">${icono}</div>
            <div class="fb-title" style="${estiloTitulo}">${titulo}</div>
            <div class="fb-desc">${esCorrecto ? "¡Sigue así!" : "Revisa la explicación al final del juego."}</div>
        `;

        contenedor.appendChild(overlay);

        // Esperar 1.5 segundos y pasar a la siguiente
        setTimeout(() => {
            st.idx++;
            st.enPausa = false; // Reanudar reloj
            cargarPregunta(); 
        }, 1500);
    }

    // --- 7. FIN DEL JUEGO Y RESUMEN ---
    async function finalizarJuego(completo) {
        clearInterval(st.timerInterval);
        st.enPausa = true;

        // Guardar en Firebase (si la función existe)
        if (typeof saveScoreFirebase === "function") {
            try {
                // Guardamos el nivel exacto y el tiempo empleado (60 - restante)
                await saveScoreFirebase(st.nivel, st.puntos, (60 - st.tiempoTotal)); 
            } catch (e) { console.error(e); }
        }

        // GENERAR LISTA DE REVISIÓN EDUCATIVA
        let listaHTML = `<ul class="review-list">`;
        st.historial.forEach((h, i) => {
            const icon = h.resultado === 'ok' ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            // Mostramos explicación principalmente en los fallos para reforzar el aprendizaje
            const detalle = h.resultado === 'bad' ? `<span class="review-exp">💡 ${h.explicacion}</span>` : '';
            
            listaHTML += `
                <li class="review-item ${h.resultado}">
                    <span class="review-q">${i+1}. ${h.pregunta}</span>
                    <div style="display:flex; justify-content:space-between; align-items:center">
                        <span>${icon} ${h.resultado === 'ok' ? 'Acertada' : 'Fallada'}</span>
                    </div>
                    ${detalle}
                </li>
            `;
        });
        listaHTML += `</ul>`;

        // Renderizar pantalla final
        root.innerHTML = `
            <div class="mt-panel">
                <div style="text-align:center; margin-bottom:10px;">
                    <h2 style="color:#333;">${st.tiempoTotal <= 0 ? "¡Tiempo Agotado!" : "¡Prueba Completada!"}</h2>
                    <div style="font-size:2.5rem; font-weight:800; color:#F5A623;">${st.puntos} pts</div>
                    <p style="color:#666;">Aciertos: <strong>${st.aciertos}</strong> | Fallos: <strong>${st.fallos}</strong></p>
                </div>

                <h3 style="font-size:1rem; color:#8A5B00; margin-bottom:5px; border-bottom:2px solid #F2C273; padding-bottom:5px;">
                    Revisión de Respuestas
                </h3>
                
                ${listaHTML}

                <div class="action-row">
                    <button id="btnReplay" class="btn-primary">
                        <i class="fa-solid fa-rotate-right"></i> Jugar de Nuevo
                    </button>
                    
                    <!-- ENLACE AL RANKING CON PARÁMETROS -->
                    <div style="margin-top:15px;">
                        <a href="../../juega/ranking.html?juego=quiz&nivel=${st.nivel}" style="color:#8A5B00; text-decoration:none; font-weight:600;">
                            <i class="fa-solid fa-chart-simple"></i> Ver Clasificación Global
                        </a>
                    </div>
                </div>
            </div>
        `;

        $("#btnReplay").onclick = renderMenu;
    }

    // ARRANCAR
    renderMenu();
}