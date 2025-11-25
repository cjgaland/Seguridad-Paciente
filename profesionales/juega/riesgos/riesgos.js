// ======================================================
//   Juego: Identificación de Riesgos - Versión 3.0
//   Autor: Carlos (con ayuda de Gemini)
//   Mejoras: Feedback inmediato, Resumen visual, UX pulida
// ======================================================

export async function initGame({ root, saveScoreFirebase }) {

    // --- CONFIGURACIÓN DE IMÁGENES Y ESCENARIOS ---
    const IMGS = {
        escenario1: "img/escenario1.jpg",
        escenario2: "img/escenario2.jpg",
        escenario3: "img/escenario3.jpg",
        escenario4: "img/escenario4.jpg"
    };

    const ESCENARIOS = {
        escenario1: {
            name: "Escenario 1: Habitación",
            time: 45,
            img: IMGS.escenario1,
            riesgos: [
                { nombre:"Suero sin rotular", coords:[40,16.9,4.7,6.1] },
                { nombre:"Barandilla baja", coords:[41.9,59.9,14.3,6.3] },
                { nombre:"Jeringa fuera de lugar", coords:[73.6,46,7.1,2.7] },
                { nombre:"Pulsador inaccesible", coords:[24.4,76.3,4.6,3.9] },
                { nombre:"Humedad en suelo", coords:[52.4,77.9,19.3,5.9] }
            ]
        },
        escenario2: {
            name: "Escenario 2: Carro de Medicación",
            time: 45,
            img: IMGS.escenario2,
            riesgos: [
                { nombre:"Jeringuilla sin encapsular", coords:[44.3,29.3,12.1,4] },
                { nombre:"Medicamento caducado", coords:[61.5,30.5,5.4,5.8] },
                { nombre:"Alto riesgo mezclado", coords:[33,41.7,18.1,7.7] },
                { nombre:"Contenedor rebosado", coords:[73.2,46.1,10.4,14.7] },
                { nombre:"Cajón abierto", coords:[15.1,50,18.3,7.8] }
            ]
        },
        escenario3: {
            name: "Escenario 3: Mostrador",
            time: 45,
            img: IMGS.escenario3,
            riesgos: [
                { nombre:"Datos expuestos", coords:[24.9,23.7,18.1,4.9] },
                { nombre:"Contraseña visible", coords:[31.1,49.9,5.4,5.8] },
                { nombre:"Consentimiento incompleto", coords:[16.3,74.6,18.1,7.7] },
                { nombre:"Pulsera aislada", coords:[73.6,69.4,12.1,4.6] },
                { nombre:"Documento ilegible", coords:[50,65.7,10.4,14.7] }
            ]
        },
        escenario4: {
            name: "Escenario 4: Camilla",
            time: 45,
            img: IMGS.escenario4,
            riesgos: [
                { nombre:"Suero desconectado", coords:[19.4,14.2,6.1,8.8] },
                { nombre:"Objeto personal suelto", coords:[46.1,43.7,7.4,5.1] },
                { nombre:"Sin barandillas", coords:[34.8,57.3,27.1,6.2] },
                { nombre:"Obstáculos en pasillo", coords:[3.1,54.7,9.7,18.1] },
                { nombre:"Iluminación deficiente", coords:[48.7,6.8,22.4,7.8] }
            ]
        }
    };

    // --- ESTADO ---
    const st = {
        escenario: "escenario1",
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

    // --- INTERFAZ PRINCIPAL ---
    function renderUI(){
        root.innerHTML="";
        const name = localStorage.getItem("jugador-sp") || "";

        const panel = document.createElement("div");
        panel.className = "mt-panel";

        // Botones Niveles
        const bar = document.createElement("div");
        bar.className = "levelbar";
        ["escenario1","escenario2","escenario3","escenario4"].forEach(id=>{
            const b=document.createElement("button");
            b.className="btn";
            b.dataset.id = id; 
            b.textContent=id.replace("escenario","Escenario ");
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
                <div class="muted">JUGADOR</div>
                <input id="playerName" value="${name}">
                <button id="saveNameBtn">Guardar</button>
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
            localStorage.setItem("jugador-sp", n || "Anónimo");
            $("#saveNameBtn").textContent = "OK";
            setTimeout(()=> $("#saveNameBtn").textContent="Guardar", 1000);
        };

        setEscenario(st.escenario);
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
        $("#btnStart").textContent="Cargando...";

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
            $("#btnStart").textContent="Comenzar";
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

        showFeedback(`¡Bien! ${h.nombre}`);

        if(st.found===st.hot.length) end(true);
    }

    function onMiss(e){
        if(!st.running) return;
        st.misses++;
        st.puntos = Math.max(0, st.puntos - 10);
        $("#kpi-m").textContent = st.misses;
        $("#kpi-p").textContent = st.puntos;

        const pt = st.svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const cursorPt = pt.matrixTransform(st.svg.getScreenCTM().inverse());

        const circle = svgEl("circle", {
            cx: cursorPt.x, cy: cursorPt.y, r: 15, class: "miss-marker"
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
        st.toastTimer = setTimeout(() => {
            t.classList.remove("show");
        }, 2000);
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
        if(win) st.puntos += Math.ceil(st.t*10);

        // Guardar score
        if(typeof saveScoreFirebase === "function"){
            try{ await saveScoreFirebase(st.escenario, st.puntos, Math.round(st.t)); }
            catch(e){ console.error(e); }
        }

        // Generar lista de riesgos
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

        // Generar miniatura mapa final
        const finalSvg = st.svg.cloneNode(true);
        finalSvg.onclick = null; 
        
        const hotLayer = finalSvg.querySelector("#hsLayer");
        hotLayer.innerHTML = ""; 

        st.hot.forEach(h => {
            const x=pct(h.coords[0],st.vw), y=pct(h.coords[1],st.vh);
            const w=pct(h.coords[2],st.vw), h2=pct(h.coords[3],st.vh);
            const cx = x + w/2;
            const cy = y + h2/2;

            const color = h.found ? "rgba(22, 163, 74, 0.5)" : "rgba(220, 38, 38, 0.5)";
            const stroke = h.found ? "#16a34a" : "#dc2626";

            hotLayer.append(svgEl("rect", {
                x, y, width:w, height:h2, 
                fill: color, stroke: stroke, "stroke-width": 2
            }));

            hotLayer.append(svgEl("text", {
                x: cx, y: cy, class: "map-number", textContent: h.idx,
                "text-anchor": "middle", "dominant-baseline": "middle"
            }));
        });

        // Render final
        root.innerHTML="";
        const panel=document.createElement("div");
        panel.className="mt-panel";

        panel.innerHTML=`
            <div style="text-align:center;">
                <h2 style="color:#333; margin-bottom:5px;">${ win ? "¡Enhorabuena!" : "Tiempo agotado" }</h2>
                <p style="color:#666;">Has conseguido <strong style="color:#F5A623; font-size:1.2rem;">${st.puntos}</strong> puntos</p>
            </div>

            <div class="results-grid">
                <div>
                    <h3 style="font-size:1rem; color:#8A5B00; margin-bottom:10px;">Detalle de Riesgos</h3>
                    ${listHtml}
                </div>
                <div>
                    <h3 style="font-size:1rem; color:#8A5B00; margin-bottom:10px;">Mapa de Aciertos/Fallos</h3>
                    <div class="mini-map-container" id="miniMapDest"></div>
                </div>
            </div>

            <div style="text-align:center; margin-top:20px;">
                <button class="btn-primary" id="replayBtn">Jugar de nuevo</button>
                <br><br>
                <!-- ENLACE AL RANKING CON PARÁMETROS -->
                <a href="../../juega/ranking.html?juego=riesgos&nivel=${st.escenario}" style="color:#8A5B00; font-weight:600; text-decoration:none;">
                    <i class="fa-solid fa-chart-simple"></i> Ver Clasificación Global
                </a>
            </div>
        `;

        panel.querySelector("#miniMapDest").append(finalSvg);
        
        root.append(panel);
        $("#replayBtn").onclick=()=>renderUI();
    }

    renderUI();

}
