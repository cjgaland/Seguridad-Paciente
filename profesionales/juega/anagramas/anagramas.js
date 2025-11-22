import { bancoPalabras } from "./palabras.js";

export async function initAnagrams({ root, saveScoreFirebase }) {

    // --- ESTADO ---
    const st = {
        nivel: null,
        poolPalabras: [],
        palabraActual: null,
        idx: 0,
        
        // Mecánica
        letrasOriginales: [],
        letrasDesordenadas: [],
        letrasRespuesta: [],
        
        // Estado Pista
        pistaUsada: false,
        
        // Marcadores
        tiempoTotal: 60,
        puntos: 0,
        aciertos: 0,
        fallos: 0,
        
        // Control
        timerInterval: null,
        enPausa: false,
        historial: [],
        keyHandler: null
    };

    // --- UTILIDADES ---
    function $(sel) { return root.querySelector(sel); }
    function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

    // --- 1. MENÚ PRINCIPAL ---
    function renderMenu() {
        const ultimoJugador = localStorage.getItem("jugador-sp") || "";
        if (st.keyHandler) document.removeEventListener('keydown', st.keyHandler);

        root.innerHTML = `
            <div class="mt-panel text-center">
                <h2 style="color:#F5A623; margin-bottom:10px;">
                    <i class="fa-solid fa-shuffle"></i> Anagramas Sanitarios
                </h2>
                <p style="color:#666;">Ordena las letras. <strong>¡Sin pista ganas más puntos!</strong></p>
                
                <div style="margin: 15px auto; max-width: 300px;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#555;">JUGADOR</label><br>
                    <input type="text" id="menuPlayerName" class="player-input" style="width:100%" value="${ultimoJugador}" placeholder="Tu nombre...">
                </div>

                <div class="level-grid">
                    <button class="btn-level" data-lvl="nivel1">
                        <span class="lvl-badge">Nivel 1</span>
                        <strong>Palabras Cortas</strong>
                        <small>Menos de 6 letras</small>
                    </button>
                    <button class="btn-level" data-lvl="nivel2">
                        <span class="lvl-badge adv">Nivel 2</span>
                        <strong>Palabras Largas</strong>
                        <small>6 letras o más</small>
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

    // --- 2. INICIAR JUEGO ---
    function comenzarJuego(nivel) {
        st.nivel = nivel;
        st.tiempoTotal = 60;
        st.puntos = 0;
        st.aciertos = 0;
        st.fallos = 0;
        st.historial = [];
        st.idx = 0;
        st.enPausa = false;

        // Eventos Teclado
        st.keyHandler = (e) => handleTeclado(e);
        document.addEventListener('keydown', st.keyHandler);

        // Filtrar palabras por nivel
        const esLargo = (nivel === 'nivel2');
        const filtradas = bancoPalabras.filter(p => {
            const len = p.palabra.length;
            return esLargo ? len >= 6 : len < 6;
        });

        st.poolPalabras = shuffle([...filtradas]);

        if (st.poolPalabras.length === 0) {
            alert("No hay palabras disponibles para este nivel.");
            return;
        }

        renderEstructuraJuego();
        st.timerInterval = setInterval(gameLoop, 1000);
        cargarPalabra();
    }

    function renderEstructuraJuego() {
        const nombre = localStorage.getItem("jugador-sp");
        root.innerHTML = `
            <div class="mt-panel">
                <!-- HUD -->
                <div class="kpi">
                    <div class="box">
                        <div class="muted">TIEMPO</div>
                        <div id="hud-time" class="value" style="color:#d97706">${st.tiempoTotal}</div>
                    </div>
                    <div class="box">
                        <div class="muted">PUNTOS</div>
                        <div id="hud-score" class="value">0</div>
                    </div>
                    <div class="box" id="box-hits" style="border-color:#86efac; background:#f0fdf4">
                        <div class="muted" style="color:#166534">ACIERTOS</div>
                        <div id="hud-hits" class="value" style="color:#166534">0</div>
                    </div>
                    <div class="box" id="box-miss" style="border-color:#fca5a5; background:#fef2f2">
                        <div class="muted" style="color:#991b1b">FALLOS</div>
                        <div id="hud-miss" class="value" style="color:#991b1b">0</div>
                    </div>
                    <div class="box" style="min-width:120px">
                        <div class="muted">JUGADOR</div>
                        <div style="font-weight:bold; font-size:0.9rem; margin-top:5px;">${nombre}</div>
                    </div>
                </div>

                <div class="game-area" id="game-area"></div>
            </div>
        `;
    }

    function gameLoop() {
        if (st.enPausa) return;
        st.tiempoTotal--;
        $("#hud-time").textContent = st.tiempoTotal;
        if (st.tiempoTotal <= 0) finalizarJuego(false);
    }

    // --- 3. MECÁNICA ---
    function cargarPalabra() {
        if (st.idx >= st.poolPalabras.length) {
            finalizarJuego(true);
            return;
        }

        const obj = st.poolPalabras[st.idx];
        st.palabraActual = obj;
        st.pistaUsada = false; // Resetear pista para la nueva palabra
        
        st.letrasOriginales = obj.palabra.split('');
        st.letrasRespuesta = [];
        
        let mezcladas = [...st.letrasOriginales];
        do { mezcladas = shuffle(mezcladas); } while (mezcladas.join('') === obj.palabra);
        
        st.letrasDesordenadas = mezcladas.map((l, i) => ({ id: i, char: l }));

        renderTablero();
    }

    function renderTablero() {
        const area = $("#game-area");
        const p = st.palabraActual;

        // Renderizamos: PISTA (Botón o Texto) + ZONA RESPUESTA + ZONA FICHAS + BOTÓN SALTAR
        area.innerHTML = `
            <!-- ZONA PISTA -->
            <div class="clue-section">
                ${!st.pistaUsada ? 
                    `<button id="btnHint" class="btn-hint">
                        <i class="fa-solid fa-lightbulb"></i> Mostrar Pista (Menos puntos)
                     </button>` 
                    : 
                    `<div class="clue-text visible">
                        <i class="fa-solid fa-lightbulb" style="color:#F5A623"></i> ${p.pista}
                     </div>`
                }
            </div>

            <!-- RESPUESTA -->
            <div class="tiles-container answer-zone" id="answer-zone" title="Clic para borrar última">
                ${st.letrasRespuesta.length === 0 ? '<span style="color:#ccc; font-size:0.9rem; margin:auto">Escribe o pulsa las letras</span>' : ''}
            </div>

            <!-- POOL -->
            <div class="tiles-container" id="pool-zone"></div>

            <!-- SALTAR -->
            <div style="margin-top:20px">
                <button id="btnSkip" class="btn-skip">
                    Saltar palabra <i class="fa-solid fa-forward"></i>
                </button>
            </div>
        `;

        // Eventos
        const btnHint = $("#btnHint");
        if(btnHint) btnHint.onclick = activarPista;

        $("#btnSkip").onclick = saltarPalabra;
        $("#answer-zone").onclick = () => { if(st.letrasRespuesta.length > 0) moverLetra('back'); };

        // Render Fichas
        const poolDiv = area.querySelector("#pool-zone");
        st.letrasDesordenadas.forEach(l => poolDiv.appendChild(crearFicha(l, 'pool')));

        const ansDiv = area.querySelector("#answer-zone");
        st.letrasRespuesta.forEach(l => ansDiv.appendChild(crearFicha(l, 'answer')));

        // Comprobar si ha terminado de poner letras
        if (st.letrasDesordenadas.length === 0) checkSolucion();
    }

    function activarPista() {
        st.pistaUsada = true;
        renderTablero(); 
    }

    function crearFicha(letraObj, origen) {
        const div = document.createElement("div");
        div.className = "letter-tile";
        div.textContent = letraObj.char;
        div.onclick = (e) => {
            e.stopPropagation();
            if (st.enPausa) return;
            
            // CORRECCIÓN AQUÍ: Usar if/else en lugar de ternario para evitar JSHint W030
            if (origen === 'pool') {
                moverLetra('forward', letraObj);
            } else {
                moverLetra('back', letraObj);
            }
        };
        return div;
    }

    function moverLetra(direccion, letraObj = null) {
        if (st.enPausa) return;

        if (direccion === 'forward') {
            if (!letraObj) return; 
            st.letrasDesordenadas = st.letrasDesordenadas.filter(l => l.id !== letraObj.id);
            st.letrasRespuesta.push(letraObj);
        } else {
            const target = letraObj || st.letrasRespuesta[st.letrasRespuesta.length - 1];
            if (target) {
                st.letrasRespuesta = st.letrasRespuesta.filter(l => l.id !== target.id);
                st.letrasDesordenadas.push(target);
            }
        }
        renderTablero();
    }

    function handleTeclado(e) {
        if (st.enPausa) return;
        const key = e.key.toUpperCase();

        if (e.key === "Backspace") { moverLetra('back'); return; }
        if (e.key === "Enter") { return; } // Opcional: saltarPalabra con enter

        const match = st.letrasDesordenadas.find(l => l.char === key);
        if (match) moverLetra('forward', match);
    }

    function checkSolucion() {
        const palabraUsuario = st.letrasRespuesta.map(l => l.char).join('');
        const correcta = st.palabraActual.palabra;

        if (palabraUsuario === correcta) {
            // ACIERTO
            st.enPausa = true;
            st.aciertos++;
            
            // --- PUNTUACIÓN ---
            // Sin Pista: 150 pts
            // Con Pista: 50 pts
            // Tiempo: +1 pto por cada 2s restantes
            const basePoints = st.pistaUsada ? 50 : 150;
            const timeBonus = Math.ceil(st.tiempoTotal / 2);
            const totalGanado = basePoints + timeBonus;

            st.puntos += totalGanado;

            $("#hud-score").textContent = st.puntos;
            $("#hud-hits").textContent = st.aciertos;
            
            const msg = st.pistaUsada ? `¡Bien! (+${totalGanado})` : `¡GENIAL! (+${totalGanado})`;
            mostrarFeedback(true, msg);
            
            st.historial.push({ 
                palabra: correcta, 
                resultado: "ok", 
                info: st.palabraActual.explicacion,
                sinPista: !st.pistaUsada
            });

        } else {
            // ERROR (Solo visual, deja corregir)
            const ansZone = $("#answer-zone");
            ansZone.style.borderColor = "#dc2626";
            setTimeout(() => ansZone.style.borderColor = "#ccc", 500);
        }
    }

    function saltarPalabra() {
        if (st.enPausa) return;
        st.enPausa = true;
        st.fallos++;
        $("#hud-miss").textContent = st.fallos;

        st.historial.push({ 
            palabra: st.palabraActual.palabra, 
            resultado: "bad", 
            info: st.palabraActual.explicacion 
        });

        mostrarFeedback(false, `Solución: ${st.palabraActual.palabra}`);
    }

    function mostrarFeedback(esAcierto, msg) {
        const area = $("#game-area");
        const overlay = document.createElement("div");
        overlay.className = "feedback-overlay";
        
        const color = esAcierto ? "#16a34a" : "#dc2626";
        const icono = esAcierto ? "check" : "xmark";

        overlay.innerHTML = `
            <div style="font-size:3rem; color:${color}"><i class="fa-solid fa-circle-${icono}"></i></div>
            <h2 style="color:${color}; margin:10px 0">${msg}</h2>
            <p style="color:#555; max-width:80%">${st.palabraActual.explicacion}</p>
        `;
        
        area.style.position = "relative";
        area.appendChild(overlay);

        setTimeout(() => {
            st.idx++;
            st.enPausa = false;
            cargarPalabra();
        }, 2500);
    }

    // --- 4. FIN DEL JUEGO ---
    async function finalizarJuego(completo) {
        clearInterval(st.timerInterval);
        st.enPausa = true;
        document.removeEventListener('keydown', st.keyHandler);

        if (typeof saveScoreFirebase === "function") {
            try {
                await saveScoreFirebase(st.nivel, st.puntos, (60 - st.tiempoTotal));
            } catch (e) { console.error(e); }
        }

        // --- GENERACIÓN DE LISTA RESUMEN ---
        let listaHTML = `<ul class="review-list">`;
        
        st.historial.forEach(h => {
            const isOk = (h.resultado === "ok");
            
            // Estilo verde (ok) o rojo (bad)
            const bgStyle = isOk ? "background:#f0fdf4; border-left:4px solid #16a34a;" : "background:#fef2f2; border-left:4px solid #dc2626;";
            const icon = isOk ? '<i class="fa-solid fa-check" style="color:#16a34a"></i>' : '<i class="fa-solid fa-xmark" style="color:#dc2626"></i>';
            
            // Badge "Sin Pista"
            const badge = (isOk && h.sinPista) ? '<span style="background:#dbeafe; color:#1e40af; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:5px; border:1px solid #bfdbfe">Sin Pista</span>' : '';
            
            // Título: Si acertó -> Palabra. Si falló -> "Fallada (Era: X)"
            const textoPrincipal = isOk ? h.palabra : `<span style="color:#991b1b">Fallada (Solución: <strong>${h.palabra}</strong>)</span>`;

            listaHTML += `
                <li class="review-item" style="${bgStyle}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${textoPrincipal} ${badge}</span>
                        <span>${icon}</span>
                    </div>
                    <small style="color:#555; display:block; margin-top:4px; font-style:italic;">
                        ${h.info}
                    </small>
                </li>`;
        });
        listaHTML += `</ul>`;

        root.innerHTML = `
            <div class="mt-panel text-center">
                <h2>${st.tiempoTotal <= 0 ? "¡Tiempo Agotado!" : "¡Completado!"}</h2>
                <div style="font-size:3rem; font-weight:800; color:#F5A623">${st.puntos} pts</div>
                
                <div style="display:flex; justify-content:center; gap:20px; margin-bottom:20px; color:#666;">
                    <span><i class="fa-solid fa-check" style="color:#16a34a"></i> ${st.aciertos}</span>
                    <span><i class="fa-solid fa-xmark" style="color:#dc2626"></i> ${st.fallos}</span>
                </div>
                
                <div style="text-align:left; margin-top:10px;">
                    <h4 style="color:#8A5B00; border-bottom:1px solid #ccc; padding-bottom:5px; margin-bottom:10px;">
                        Resultados y Soluciones:
                    </h4>
                    ${listaHTML}
                </div>

                <button id="btnReplay" class="btn-action">
                    <i class="fa-solid fa-rotate-right"></i> Jugar de Nuevo
                </button>
                <br><br>
                <a href="../../juega/ranking.html?juego=anagramas&nivel=${st.nivel}" style="color:#8A5B00; font-weight:bold; text-decoration:none">
                    Ver Ranking Global
                </a>
            </div>
        `;

        $("#btnReplay").onclick = renderMenu;
    }

    renderMenu();
}