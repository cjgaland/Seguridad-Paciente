// ======================================================
//   Juego: Detectives del Hogar
//   Adaptación de Riesgos.js para Ciudadanía
// ======================================================

export async function initGame({ root, saveScoreFirebase }) {

    // --- IMÁGENES ---
    // Asegúrate de que los archivos existen en esta ruta
    const IMGS = {
        salon: "img/escenario1.png",      // Salón
        bano: "img/escenario2.png",       // Baño
        cocina: "img/escenario3.png",     // Cocina
        dormitorio: "img/escenario4.png"  // Dormitorio
    };

    // --- DEFINICIÓN DE RIESGOS (COORDENADAS PENDIENTES DE AJUSTAR) ---
    const ESCENARIOS = {
        "salon": {
            name: "Nivel 1: El Salón",
            time: 60, // Tiempo en segundos (un poco más relajado para ciudadanos)
            img: IMGS.salon,
            riesgos: [
                { nombre:"Alfombra arrugada", coords:[43.6, 71.0, 15.1, 7.8] }, // Placeholder
                { nombre:"Cables sueltos", coords:[72.9, 68.3, 8.1, 6.2] },
                { nombre:"Medicinas al alcance", coords:[51.4, 44.3, 12.2, 8.7] },
                { nombre:"Juguetes en paso", coords:[19.5, 51.5, 11.3, 6.3] },
                { nombre:"Esquinas de mesa", coords:[37.7, 44.5, 5.0, 4.3] }
            ]
        },
        "bano": {
            name: "Nivel 2: El Baño",
            time: 60,
            img: IMGS.bano,
            riesgos: [
                { nombre:"Suelo mojado", coords:[32.1, 65.7, 15.4, 8.6] },
                { nombre:"Falta asidero ducha", coords:[66.0, 22.2, 18.3, 11.7] },
                { nombre:"Productos tóxicos", coords:[5.0, 49.5, 15.1, 15.7] },
                { nombre:"Alfombrilla suelta", coords:[52.3, 58.3, 18.5, 7.4] },
                { nombre:"Secador enchufado", coords:[27.1, 11.5, 5.2, 8.8] }
            ]
        },
        "cocina": {
            name: "Nivel 3: La Cocina",
            time: 60,
            img: IMGS.cocina,
            riesgos: [
                { nombre:"Mango sartén fuera", coords:[47.0, 27.8, 10.1, 4.8] },
                { nombre:"Cuchillo al borde", coords:[12.1, 39.7, 9.3, 5.7] },
                { nombre:"Botella con producto tóxico", coords:[66.5, 52.0, 5.8, 11.5] },
                { nombre:"Trapo cerca fuego", coords:[56.5, 38.4, 7.1, 11.5] },
                { nombre:"Mancha de aceite", coords:[36.6, 59.3, 15.0, 11.1] }
            ]
        },
        "dormitorio": {
            name: "Nivel 4: El Dormitorio",
            time: 60,
            img: IMGS.dormitorio,
            riesgos: [
                { nombre:"Cigarrillo en cama", coords:[47.4, 44.0, 7.4, 6.5] },
                { nombre:"Estufa cerca cortina", coords:[14.6, 44.0, 9.9, 13.7] },
                { nombre:"Zapatillas en paso", coords:[35.6, 73.2, 15.4, 8.3] },
                { nombre:"Muchos fármacos", coords:[84.4, 44.5, 11.3, 7.2] },
                { nombre:"Alfombra levantada", coords:[72.5, 67.8, 11.8, 6.5] }
            ]
        }
    };

    // --- ESTADO ---
    const st = {
        escenario: "salon",
        t: 0, puntos: 0, found: 0, misses: 0,
        hot: [], svg: null, vw: 0, vh: 0, running: false
    };

    // --- UTILIDADES ---
    function $(s, p=root){ return p.querySelector(s); }
    function pct(a,b){ return (a/100)*b; }
    function svgEl(tag,attrs={}){
        const n=document.createElementNS("http://www.w3.org/2000/svg",tag);
        for(const k in attrs) {
            if(k==="textContent") n.textContent = attrs[k];
            else n.setAttribute(k,attrs[k]);
        }
        return n;
    }

    // --- RENDER ---
    function renderUI(){
        root.innerHTML="";
        const name = localStorage.getItem("jugador-sp") || "";

        const panel = document.createElement("div");
        panel.className = "mt-panel";

        // Botones Niveles
        const bar = document.createElement("div");
        bar.className = "levelbar";
        
        Object.keys(ESCENARIOS).forEach(id=>{
            const b=document.createElement("button");
            b.className="btn";
            b.dataset.id = id; 
            
            // Iconos para los botones
            const icons = {salon:"couch", bano:"bath", cocina:"kitchen-set", dormitorio:"bed"};
            
            // --- CAMBIO AQUÍ: Mapeo de nombres correctos ---
            const labels = {
                salon: "Salón",
                bano: "Baño",
                cocina: "Cocina",
                dormitorio: "Dormitorio"
            };

            // Usamos labels[id] en vez de transformar el ID
            b.innerHTML = `<i class="fa-solid fa-${icons[id]}"></i> ${labels[id]}`;
            
            b.onclick=()=>setEscenario(id);
            bar.append(b);
        });

        // Marcadores
        const kpi = document.createElement("div");
        kpi.className="kpi";
        kpi.innerHTML = `
            <div class="box"><div class="muted">TIEMPO</div><div id="kpi-t" class="value">—</div></div>
            <div class="box"><div class="muted">PUNTOS</div><div id="kpi-p" class="value">0</div></div>
            <div class="box" id="box-found"><div class="muted">RIESGOS</div><div id="kpi-f" class="value">0</div></div>
            <div class="box" id="box-miss"><div class="muted">FALLOS</div><div id="kpi-m" class="value">0</div></div>
            <div class="box player-box">
                <div class="muted">JUGADOR/A</div>
                <input id="playerName" value="${name}">
                <button id="saveNameBtn">Guardar Nombre</button>
            </div>
        `;

        // Escenario
        const sec = document.createElement("div");
        sec.className="sec-wrapper";
        
        const toast = document.createElement("div");
        toast.id = "feedback-toast";
        toast.className = "toast-msg";
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span id="toast-text"></span>`;
        
        const canvas = document.createElement("div");
        canvas.id = "canvas";
        canvas.className = "sec-canvas";

        sec.append(toast, canvas);

        // Botón Start
        const nav = document.createElement("div");
        nav.className="qz-meta";
        nav.innerHTML=`<button class="btn-primary" id="btnStart">Cargar...</button>`;

        panel.append(bar, kpi, sec, nav);
        root.append(panel);

        $("#saveNameBtn").onclick = ()=>{
            const n = $("#playerName").value.trim();
            localStorage.setItem("jugador-sp", n || "Detective");
            $("#saveNameBtn").textContent = "Guardado";
            setTimeout(()=> $("#saveNameBtn").textContent="Guardar Nombre", 1000);
        };

        // Check URL params para carga directa
        const params = new URLSearchParams(window.location.search);
        const urlEscenario = params.get('escenario');
        if(urlEscenario && ESCENARIOS[urlEscenario]) {
            setEscenario(urlEscenario);
        } else {
            setEscenario(st.escenario);
        }
    }

    function setEscenario(id){
        st.escenario=id;
        
        root.querySelectorAll(".levelbar .btn").forEach(btn => {
            if(btn.dataset.id === id) btn.classList.add("active");
            else btn.classList.remove("active");
        });

        const cfg = ESCENARIOS[id];
        const canvas=$("#canvas");
        canvas.innerHTML="";

        $("#btnStart").disabled=true;
        $("#btnStart").textContent="Cargando imagen...";

        const img = new Image();
        img.onload = ()=>{
            st.vw=img.naturalWidth;
            st.vh=img.naturalHeight;

            const svg = svgEl("svg",{ class:"scene", viewBox:`0 0 ${st.vw} ${st.vh}` });
            svg.append(svgEl("image",{ x:0,y:0,width:st.vw,height:st.vh, href:cfg.img }));
            svg.append(svgEl("g",{id:"hsLayer"}));

            svg.onclick = (e) => {
                if(st.running && !e.target.classList.contains("hs")) onMiss(e);
            };

            canvas.append(svg);
            st.svg=svg;

            $("#btnStart").disabled=false;
            $("#btnStart").textContent="¡Empezar la Búsqueda!";
            $("#btnStart").onclick=()=>start();
        };
        img.src = cfg.img;
    }

    function start(){
        const cfg = ESCENARIOS[st.escenario];
        st.running=true;
        st.t=cfg.time;
        st.puntos=0; st.found=0; st.misses=0;

        $("#kpi-t").textContent=st.t;
        $("#kpi-p").textContent="0";
        $("#kpi-f").textContent=`0 / ${cfg.riesgos.length}`;
        $("#kpi-m").textContent="0";

        st.hot = cfg.riesgos.map((r,i)=>({
            idx:i+1, nombre:r.nombre, coords:r.coords, found:false
        }));

        renderHotspots();
        tick();
        $("#btnStart").style.display="none";
    }

    function renderHotspots(){
        const layer=st.svg.querySelector("#hsLayer");
        layer.innerHTML="";
        st.hot.forEach(h=>{
            // Coordenadas en %
            const x=pct(h.coords[0],st.vw), y=pct(h.coords[1],st.vh);
            const w=pct(h.coords[2],st.vw), h2=pct(h.coords[3],st.vh);
            
            const r=svgEl("rect",{x,y,width:w,height:h2,class:"hs"});
            r.onclick=(e)=>onHotspot(e, h, r);
            layer.append(r);
        });
    }

    function onHotspot(e, h, node){
        e.stopPropagation();
        if(h.found || !st.running) return;

        h.found=true;
        st.found++;
        st.puntos+=100;

        $("#kpi-f").textContent=`${st.found} / ${st.hot.length}`;
        $("#kpi-p").textContent=st.puntos;
        node.classList.add("found");

        showFeedback(`¡Bien visto! ${h.nombre}`);

        if(st.found===st.hot.length) end(true);
    }

    function onMiss(e){
        if(!st.running) return;
        st.misses++;
        st.puntos = Math.max(0, st.puntos - 10);
        $("#kpi-m").textContent = st.misses;
        $("#kpi-p").textContent = st.puntos;

        // Efecto visual del fallo
        const pt = st.svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const cursorPt = pt.matrixTransform(st.svg.getScreenCTM().inverse());

        const circle = svgEl("circle", {
            cx: cursorPt.x, cy: cursorPt.y, r: 20, class: "miss-marker"
        });
        st.svg.appendChild(circle);
        setTimeout(()=> circle.remove(), 500);
    }

    function showFeedback(msg) {
        const t = $("#feedback-toast");
        const txt = $("#toast-text");
        if(!t || !txt) return;

        txt.textContent = msg;
        t.classList.add("show");
        
        if(st.toastTimer) clearTimeout(st.toastTimer);
        st.toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
    }

    function tick(){
        if(!st.running) return;
        st.t-=0.016;
        if(st.t<=0){ st.t=0; end(false); return; }
        $("#kpi-t").textContent=Math.ceil(st.t);
        requestAnimationFrame(tick);
    }

    async function end(win){
        st.running=false;
        if(win) st.puntos += Math.ceil(st.t*10); // Bonus tiempo

        // Guardar Score
        if(typeof saveScoreFirebase === "function"){
            try{ await saveScoreFirebase(st.escenario, st.puntos, Math.round(st.t)); }
            catch(e){ console.error(e); }
        }

        // Generar resumen
        let listHtml = `<ul class="res-list">`;
        st.hot.forEach(h => {
            const icon = h.found ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            const cssClass = h.found ? 'success' : 'fail';
            listHtml += `
                <li class="res-item ${cssClass}">
                    <span class="res-icon">${h.idx}</span>
                    <span class="res-text"><strong>${h.nombre}</strong></span>
                    <span style="margin-left:auto">${icon}</span>
                </li>`;
        });
        listHtml += `</ul>`;

        // Clonar mapa con marcas finales
        const finalSvg = st.svg.cloneNode(true);
        finalSvg.onclick = null;
        const hotLayer = finalSvg.querySelector("#hsLayer");
        hotLayer.innerHTML = "";

        st.hot.forEach(h => {
            const x=pct(h.coords[0],st.vw), y=pct(h.coords[1],st.vh);
            const w=pct(h.coords[2],st.vw), h2=pct(h.coords[3],st.vh);
            const cx = x + w/2; const cy = y + h2/2;

            const color = h.found ? "rgba(249, 115, 22, 0.4)" : "rgba(100, 116, 139, 0.5)";
            const stroke = h.found ? "#f97316" : "#64748b";

            hotLayer.append(svgEl("rect", { x, y, width:w, height:h2, fill:color, stroke:stroke, "stroke-width":3 }));
            hotLayer.append(svgEl("text", { x:cx, y:cy, class:"map-number", textContent:h.idx, "text-anchor":"middle", "dominant-baseline":"middle" }));
        });

        // Pantalla final
        root.innerHTML="";
        const panel=document.createElement("div");
        panel.className="mt-panel";

        panel.innerHTML=`
            <div style="text-align:center;">
                <h2 style="color:#333; margin-bottom:5px;">${ win ? "¡Misión Cumplida!" : "Tiempo Agotado" }</h2>
                <p style="color:#666;">Puntuación: <strong style="color:#f97316; font-size:1.4rem;">${st.puntos}</strong></p>
            </div>

            <div class="results-grid">
                <div>
                    <h3 style="font-size:1rem; color:#c2410c; margin-bottom:10px;">Riesgos Encontrados</h3>
                    ${listHtml}
                </div>
                <div>
                    <h3 style="font-size:1rem; color:#c2410c; margin-bottom:10px;">Mapa del Delito</h3>
                    <div class="mini-map-container" id="miniMapDest"></div>
                </div>
            </div>

            <div style="text-align:center; margin-top:30px;">
                <button class="btn-primary" id="replayBtn">Jugar de nuevo</button>
                <br><br>
                <a href="../../juega/ranking.html?juego=detectives&nivel=${st.escenario}" style="color:#c2410c; font-weight:600; text-decoration:none;">
                    <i class="fa-solid fa-trophy"></i> Ver Ranking
                </a>
            </div>
        `;

        panel.querySelector("#miniMapDest").append(finalSvg);
        root.append(panel);
        $("#replayBtn").onclick=()=>renderUI();
    }

    renderUI();
}