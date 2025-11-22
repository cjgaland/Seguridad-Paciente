import { bancoPalabrasSopa } from "./palabras_sopa.js";

export async function initSopa({ root, saveScoreFirebase }) {

    // --- ESTADO ---
    const st = {
        nivel: null,
        gridSize: 10,
        palabrasMision: [],
        grid: [],
        seleccionando: false,
        celdaInicio: null,
        seleccionActual: [],
        encontradas: [],
        ubicaciones: {},
        tiempoTotal: 0,
        tiempoMax: 0,
        puntos: 0,
        timerInterval: null,
        enPausa: false
    };

    const $ = (sel) => root.querySelector(sel);

    // --- UTILIDAD: Shuffle ---
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // --- 1. MENÚ PRINCIPAL ---
    function renderMenu() {
        const ultimoJugador = localStorage.getItem("jugador-sp") || "";

        root.innerHTML = `
            <div class="mt-panel text-center">
                <h2 style="color:#F5A623; margin-bottom:10px;">
                    <i class="fa-solid fa-table-cells"></i> Sopa de Letras
                </h2>
                <p style="color:#666;">
                    Encuentra los conceptos de seguridad ocultos.
                </p>
                
                <div style="margin: 15px auto; max-width: 300px;">
                    <label style="font-size:0.8rem; font-weight:bold; color:#555;">JUGADOR</label><br>
                    <input type="text" id="menuPlayerName" class="player-input" style="width:100%" value="${ultimoJugador}" placeholder="Tu nombre...">
                </div>

                <div class="level-grid">
                    <button class="btn-level" data-lvl="nivel1">
                        <span class="lvl-badge">Nivel 1</span>
                        <strong>Básico (10x10)</strong>
                        <small>Busca 5 palabras (90s)</small>
                    </button>
                    <button class="btn-level" data-lvl="nivel2">
                        <span class="lvl-badge adv">Nivel 2</span>
                        <strong>Avanzado (15x15)</strong>
                        <small>Busca 7 palabras (120s)</small>
                    </button>
                </div>
            </div>
        `;

        root.querySelectorAll(".btn-level").forEach(btn => {
            btn.onclick = () => {
                const nombre = $("#menuPlayerName").value.trim() || "Anónimo";
                localStorage.setItem("jugador-sp", nombre);
                iniciarJuego(btn.dataset.lvl);
            };
        });
    }

    // --- 2. INICIO ---
    function iniciarJuego(nivel) {
        st.nivel = nivel;
        st.encontradas = [];
        st.ubicaciones = {};
        st.puntos = 0;
        st.enPausa = false;

        let numPalabrasMision = 0;

        if (nivel === "nivel1") {
            st.gridSize = 10;
            st.tiempoMax = 90;
            numPalabrasMision = 5;
        } else {
            st.gridSize = 15;
            st.tiempoMax = 120;
            numPalabrasMision = 7;
        }
        st.tiempoTotal = st.tiempoMax;

        const pool = bancoPalabrasSopa.filter(p => p.nivel === nivel);
        st.palabrasMision = shuffle([...pool]).slice(0, numPalabrasMision);

        generarGrid();
        renderTablero();

        st.timerInterval = setInterval(gameLoop, 1000);
    }

    // --- GENERADOR ---
    function generarGrid() {
        const size = st.gridSize;
        let grid = Array(size).fill(null).map(() => Array(size).fill(''));
        const direcciones = [[0, 1], [1, 0], [1, 1], [-1, 1]];

        st.palabrasMision.forEach(item => {
            let colocado = false;
            let intentos = 0;
            const palabra = item.palabra.toUpperCase();

            while (!colocado && intentos < 100) {
                const dir = direcciones[Math.floor(Math.random() * direcciones.length)];
                const r = Math.floor(Math.random() * size);
                const c = Math.floor(Math.random() * size);

                if (puedeColocarse(grid, palabra, r, c, dir)) {
                    colocarPalabra(grid, palabra, r, c, dir);
                    guardarUbicacionReal(palabra, r, c, dir);
                    colocado = true;
                }
                intentos++;
            }
        });

        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = letras[Math.floor(Math.random() * letras.length)];
                }
            }
        }
        st.grid = grid;
    }

    function puedeColocarse(grid, palabra, r, c, dir) {
        const size = st.gridSize;
        for (let i = 0; i < palabra.length; i++) {
            const nr = r + dir[0] * i;
            const nc = c + dir[1] * i;
            if (nr < 0 || nr >= size || nc < 0 || nc >= size) return false;
            if (grid[nr][nc] !== '' && grid[nr][nc] !== palabra[i]) return false;
        }
        return true;
    }

    function colocarPalabra(grid, palabra, r, c, dir) {
        for (let i = 0; i < palabra.length; i++) {
            grid[r + dir[0] * i][c + dir[1] * i] = palabra[i];
        }
    }

    function guardarUbicacionReal(palabra, r, c, dir) {
        const celdas = [];
        for (let i = 0; i < palabra.length; i++) {
            celdas.push({ r: r + dir[0] * i, c: c + dir[1] * i });
        }
        st.ubicaciones[palabra] = celdas;
    }

    // --- 3. RENDER TABLERO ---
    function renderTablero() {
        const nombre = localStorage.getItem("jugador-sp");
        const gridStyle = `grid-template-columns: repeat(${st.gridSize}, 1fr);`;

        // Renderizamos la lista LIMPIA, solo texto
        root.innerHTML = `
            <div class="mt-panel">
                <div class="kpi">
                    <div class="box">
                        <div class="muted">TIEMPO</div>
                        <div id="hud-time" class="value" style="color:#d97706">${st.tiempoTotal}</div>
                    </div>
                    <div class="box">
                        <div class="muted">PUNTOS</div>
                        <div id="hud-score" class="value">0</div>
                    </div>
                    <div class="box">
                        <div class="muted">ENCONTRADAS</div>
                        <div id="hud-found" class="value">0 / ${st.palabrasMision.length}</div>
                    </div>
                    <div class="box player-box">
                        <div class="muted">JUGADOR</div>
                        <div style="font-weight:bold; font-size:0.9rem;">${nombre}</div>
                    </div>
                </div>

                <div class="game-container">
                    <!-- ZONA REJILLA -->
                    <div class="word-grid" id="grid-area" style="${gridStyle}">
                        ${st.grid.flat().map((letra, i) => {
            const r = Math.floor(i / st.gridSize);
            const c = i % st.gridSize;
            return `<div class="cell" data-r="${r}" data-c="${c}">${letra}</div>`;
        }).join('')}
                    </div>

                    <!-- LISTA DE PALABRAS -->
                    <div class="word-list-panel">
                        <h3>Palabras a buscar:</h3>
                        <ul class="word-list">
                            ${st.palabrasMision.map(p => `
                                <li class="word-item" id="w-${p.palabra}">
                                    ${p.palabra}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        const gridDiv = $("#grid-area");

        gridDiv.onmousedown = (e) => iniciarSeleccion(e, 'mouse');
        gridDiv.onmouseover = (e) => actualizarSeleccion(e, 'mouse');
        document.onmouseup = () => finalizarSeleccion();

        gridDiv.ontouchstart = (e) => iniciarSeleccion(e, 'touch');
        gridDiv.ontouchmove = (e) => actualizarSeleccion(e, 'touch');
        gridDiv.ontouchend = () => finalizarSeleccion();
    }

    // --- 4. INTERACCIÓN ---
    function iniciarSeleccion(e, tipo) {
        if (st.enPausa) return;
        const target = obtenerCeldaTarget(e, tipo);
        if (!target) return;

        st.seleccionando = true;
        st.celdaInicio = { r: parseInt(target.dataset.r), c: parseInt(target.dataset.c) };
        st.seleccionActual = [st.celdaInicio];
        resaltarCeldas();
    }

    function actualizarSeleccion(e, tipo) {
        if (!st.seleccionando) return;
        const target = obtenerCeldaTarget(e, tipo);
        if (!target) return;

        const rFin = parseInt(target.dataset.r);
        const cFin = parseInt(target.dataset.c);
        st.seleccionActual = calcularLinea(st.celdaInicio.r, st.celdaInicio.c, rFin, cFin);
        resaltarCeldas();
    }

    function finalizarSeleccion() {
        if (!st.seleccionando) return;
        st.seleccionando = false;

        const palabraFormada = st.seleccionActual.map(pos => st.grid[pos.r][pos.c]).join('');

        // CORRECCIÓN W030: Usamos variable y if en vez de OR
        const encontradaNormal = checkPalabra(palabraFormada);
        if (!encontradaNormal) {
            checkPalabra(palabraFormada.split('').reverse().join(''));
        }

        document.querySelectorAll('.cell.selected').forEach(c => c.classList.remove('selected'));
        st.seleccionActual = [];
    }

    function obtenerCeldaTarget(e, tipo) {
        if (tipo === 'mouse') return e.target.closest('.cell');
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        return element ? element.closest('.cell') : null;
    }

    function calcularLinea(r1, c1, r2, c2) {
        const puntos = [];
        const dr = r2 - r1;
        const dc = c2 - c1;

        if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
            const steps = Math.max(Math.abs(dr), Math.abs(dc));
            const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
            const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

            for (let i = 0; i <= steps; i++) {
                puntos.push({ r: r1 + stepR * i, c: c1 + stepC * i });
            }
        }
        return puntos;
    }

    function resaltarCeldas() {
        document.querySelectorAll('.cell.selected').forEach(c => c.classList.remove('selected'));
        st.seleccionActual.forEach(pos => {
            const celda = document.querySelector(`.cell[data-r="${pos.r}"][data-c="${pos.c}"]`);
            if (celda) celda.classList.add('selected');
        });
    }

    // --- 5. LÓGICA JUEGO ---
    function checkPalabra(palabra) {
        const obj = st.palabrasMision.find(p => p.palabra === palabra);

        if (obj && !st.encontradas.includes(palabra)) {
            st.encontradas.push(palabra);
            st.puntos += 100 + Math.ceil(st.tiempoTotal / 5);

            st.seleccionActual.forEach(pos => {
                const celda = document.querySelector(`.cell[data-r="${pos.r}"][data-c="${pos.c}"]`);
                celda.classList.add('found');
            });

            // Actualizar Lista: Solo cambio de color (sin iconos)
            const li = document.getElementById(`w-${palabra}`);
            if (li) {
                li.classList.add('found');
            }

            $("#hud-score").textContent = st.puntos;
            $("#hud-found").textContent = `${st.encontradas.length} / ${st.palabrasMision.length}`;

            mostrarToast(obj.descripcion);

            if (st.encontradas.length === st.palabrasMision.length) {
                setTimeout(() => finalizarJuego(true), 1000);
            }
            return true;
        }
        return false;
    }

    function mostrarToast(texto) {
        const toast = document.getElementById("edu-toast");
        const txt = document.getElementById("edu-text");
        txt.textContent = texto;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function gameLoop() {
        if (st.enPausa) return;
        st.tiempoTotal--;
        $("#hud-time").textContent = st.tiempoTotal;
        if (st.tiempoTotal <= 0) finalizarJuego(false);
    }

    async function finalizarJuego(victoria) {
        clearInterval(st.timerInterval);
        st.enPausa = true;
        document.onmouseup = null;

        if (typeof saveScoreFirebase === "function") {
            try {
                await saveScoreFirebase(st.nivel, st.puntos, (st.tiempoMax - st.tiempoTotal));
            } catch (e) { console.error(e); }
        }

        const miniGridHTML = generarMiniaturaHTML();

        let listaHTML = `<ul class="review-list">`;
        st.palabrasMision.forEach(p => {
            const encontrada = st.encontradas.includes(p.palabra);
            const clase = encontrada ? "ok" : "bad";
            const icono = encontrada ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            const textoEstado = encontrada ? "Encontrada" : "No encontrada";

            listaHTML += `
                <li class="review-item ${clase}">
                    <div style="display:flex; justify-content:flex-start; align-items:center; gap:10px;">
                        <span>${icono}</span>
                        <strong>${p.palabra}</strong>
                        <span style="margin-left:auto; font-size:0.8rem; opacity:0.7;">${textoEstado}</span>
                    </div>
                    <small style="display:block; margin-top:4px; color:#555; margin-left:24px;">${p.descripcion}</small>
                </li>
            `;
        });
        listaHTML += `</ul>`;

        const titulo = victoria ? "¡Misión Cumplida!" : "¡Tiempo Agotado!";
        const color = victoria ? "#16a34a" : "#333";

        root.innerHTML = `
            <div class="mt-panel text-center">
                <h2 style="color:${color}; margin-bottom:5px;">${titulo}</h2>
                <div style="font-size:3rem; font-weight:800; color:#F5A623">${st.puntos} pts</div>
                
                <div class="final-layout" style="display:flex; flex-wrap:wrap; gap:20px; margin-top:20px; text-align:left;">
                    <div style="flex:1; min-width:250px;">
                        <h4 style="color:#8A5B00; margin-bottom:10px;">Mapa de Soluciones</h4>
                        ${miniGridHTML}
                    </div>
                    <div style="flex:1; min-width:250px;">
                        <h4 style="color:#8A5B00; margin-bottom:10px;">Detalle Educativo</h4>
                        ${listaHTML}
                    </div>
                </div>

                <div class="action-row">
                    <button id="btnReplay" class="btn-action">
                        <i class="fa-solid fa-rotate-right"></i> Jugar de Nuevo
                    </button>
                    <br><br>
                    <a href="../../juega/ranking.html?juego=sopa&nivel=${st.nivel}" style="color:#8A5B00; font-weight:bold; text-decoration:none">
                        Ver Ranking Global
                    </a>
                </div>
            </div>
        `;

        $("#btnReplay").onclick = renderMenu;
    }

    function generarMiniaturaHTML() {
        const gridStyle = `display:grid; grid-template-columns: repeat(${st.gridSize}, 1fr); width: 100%; gap: 1px; background: #eee; border: 1px solid #ccc;`;

        let html = `<div style="${gridStyle}">`;

        for (let r = 0; r < st.gridSize; r++) {
            for (let c = 0; c < st.gridSize; c++) {
                const letra = st.grid[r][c];
                let claseColor = "background:white; color:#999;";

                for (let i = 0; i < st.palabrasMision.length; i++) {
                    const p = st.palabrasMision[i];
                    const coords = st.ubicaciones[p.palabra];
                    let esParteDePalabra = false;

                    if (coords) {
                        for (let k = 0; k < coords.length; k++) {
                            if (coords[k].r === r && coords[k].c === c) {
                                esParteDePalabra = true;
                                break;
                            }
                        }
                    }

                    if (esParteDePalabra) {
                        if (st.encontradas.includes(p.palabra)) {
                            claseColor = "background:#22c55e; color:white; font-weight:bold;";
                        } else {
                            claseColor = "background:#ef4444; color:white; font-weight:bold;";
                        }
                        break;
                    }
                }

                html += `<div style="aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:0.7rem; ${claseColor}">${letra}</div>`;
            }
        }
        html += `</div>`;
        return html;
    }

    renderMenu();
}