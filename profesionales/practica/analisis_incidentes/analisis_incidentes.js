/* Guía de análisis de incidentes (Protocolo de Londres / causa-raíz).
   Sin servidor ni servicios externos: todo ocurre en el navegador.
   Único almacenamiento: borrador en localStorage de este navegador, que se puede borrar. */
(function () {
    "use strict";

    var CLAVE = "sp_analisis_incidentes_borrador_v1";

    var PASOS = ["Hecho", "Clasificación", "Cronología", "Factores", "Barreras y causas", "Acciones", "Resumen"];

    var FACTORES = [
        { id: "paciente", nombre: "Paciente", items: [
            "Gravedad o complejidad de la enfermedad",
            "Pluripatología o polimedicación",
            "Edad avanzada, fragilidad o deterioro cognitivo",
            "Barreras de idioma o de comunicación",
            "Factores sociales o familiares",
            "Poca información o implicación del paciente" ] },
        { id: "tarea", nombre: "Tarea y tecnología", items: [
            "Falta de protocolo o protocolo poco claro",
            "Ayudas a la decisión no disponibles o no usadas",
            "Diseño confuso de equipos o aplicaciones",
            "Fallo, avería o falta de mantenimiento del equipo",
            "Etiquetado o presentación similar (medicamentos o material)",
            "Pruebas no disponibles o resultados poco fiables" ] },
        { id: "individuo", nombre: "Individuo (profesional)", items: [
            "Conocimientos o formación insuficientes para la tarea",
            "Poca experiencia con el procedimiento",
            "Fatiga, estrés o sobrecarga",
            "Falta de supervisión de profesionales en formación",
            "Distracción o interrupciones durante la tarea",
            "Rutinas o atajos habituales no seguros" ] },
        { id: "equipo", nombre: "Equipo", items: [
            "Comunicación verbal deficiente",
            "Documentación escrita incompleta o ilegible",
            "Traspaso de información en relevos o traslados",
            "Falta de supervisión o apoyo disponible",
            "Roles y responsabilidades poco claros",
            "Dificultad para cuestionar o avisar de un riesgo" ] },
        { id: "entorno", nombre: "Entorno de trabajo", items: [
            "Dotación de personal insuficiente",
            "Carga de trabajo o presión asistencial elevada",
            "Mezcla de perfiles o turnos inadecuada",
            "Interrupciones, ruido o distracciones frecuentes",
            "Espacio físico, iluminación o disposición del material",
            "Falta de material o equipos disponibles" ] },
        { id: "organizacion", nombre: "Organización y gestión", items: [
            "Falta de políticas o procedimientos institucionales",
            "Prioridades que no favorecen la seguridad",
            "Recursos o restricciones económicas",
            "Formación continuada no planificada",
            "Cultura de seguridad poco desarrollada",
            "Sistemas de información que no se comunican entre sí" ] },
        { id: "contexto", nombre: "Contexto institucional", items: [
            "Normativa o requisitos externos",
            "Relación con otros centros o niveles asistenciales",
            "Suministradores o proveedores externos",
            "Factores del entorno social o económico" ] }
    ];

    var BARRERAS = [
        "Identificación del paciente con dos identificadores",
        "Protocolo o lista de verificación",
        "Doble comprobación independiente",
        "Alertas o apoyo a la decisión (receta electrónica, etc.)",
        "Conciliación de la medicación",
        "Comunicación estructurada en relevos (p. ej. SBAR)",
        "Supervisión por un profesional con más experiencia",
        "Formación y competencia acreditada",
        "Información al paciente y participación",
        "Mantenimiento y revisión de equipos",
        "Medidas físicas (barandillas, alarmas, etiquetas)",
        "Cultura de aviso (cualquiera puede parar y avisar)"
    ];

    var ESTADOS_BARRERA = ["Sin valorar", "Funcionó", "Falló", "No existía"];

    function vacio() {
        return {
            paso: 0,
            desc: {}, clas: {},
            crono: [{ cuando: "", que: "", quien: "" }],
            factores: {},
            barreras: {}, barrerasOtras: "",
            porques: ["", "", "", "", ""], causaRaiz: "",
            acciones: [{ que: "", resp: "", plazo: "", indic: "" }]
        };
    }

    var estado = vacio();
    var $ = function (id) { return document.getElementById(id); };

    /* ---------- almacenamiento (opcional) ---------- */
    var temporizador = null, almacenOk = true;

    function cargar() {
        try {
            var txt = window.localStorage.getItem(CLAVE);
            if (!txt) return;
            var d = JSON.parse(txt);
            if (d && typeof d === "object") {
                var base = vacio();
                Object.keys(base).forEach(function (k) { if (d[k] !== undefined) base[k] = d[k]; });
                estado = base;
                $("estado-borrador").textContent = "Borrador recuperado de este navegador.";
            }
        } catch (e) { almacenOk = false; }
    }

    function guardarPronto() {
        detectarIdentificadores();
        if (!almacenOk) return;
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
            try {
                window.localStorage.setItem(CLAVE, JSON.stringify(estado));
                $("estado-borrador").textContent = "Borrador guardado solo en este navegador.";
            } catch (e) {
                almacenOk = false;
                $("estado-borrador").textContent = "No se puede guardar borrador en este navegador.";
            }
        }, 500);
    }

    /* ---------- utilidades ---------- */
    function obtener(ruta) {
        return ruta.split(".").reduce(function (o, k) { return (o && o[k] !== undefined) ? o[k] : ""; }, estado);
    }
    function fijar(ruta, valor) {
        var partes = ruta.split("."), o = estado;
        for (var i = 0; i < partes.length - 1; i++) {
            if (typeof o[partes[i]] !== "object" || o[partes[i]] === null) o[partes[i]] = {};
            o = o[partes[i]];
        }
        o[partes[partes.length - 1]] = valor;
    }
    function el(tag, props, hijos) {
        var e = document.createElement(tag);
        if (props) Object.keys(props).forEach(function (k) {
            if (k === "text") e.textContent = props[k];
            else if (k === "class") e.className = props[k];
            else e.setAttribute(k, props[k]);
        });
        (hijos || []).forEach(function (h) { e.appendChild(typeof h === "string" ? document.createTextNode(h) : h); });
        return e;
    }

    /* ---------- aviso de posibles datos identificativos (no bloquea) ---------- */
    var PATRONES = [
        { re: /\b\d{8}\s?-?[A-Za-z]\b/, nombre: "un DNI" },
        { re: /\b[XYZxyz]\s?-?\d{7}\s?-?[A-Za-z]\b/, nombre: "un NIE" },
        { re: /\bAN\s?\d{8,10}\b/i, nombre: "un NUHSA" },
        { re: /(\+34\s?)?\b[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/, nombre: "un teléfono" },
        { re: /[\w.+-]+@[\w-]+\.[\w.-]+/, nombre: "un correo electrónico" },
        { re: /\b(historia|hist\.?|nhc|nº\s?hc)\s*(cl[ií]nica)?\s*[:nº.]*\s*\d{4,}/i, nombre: "un número de historia" },
        { re: /\bcama\s*(n[ºo°.]?\s*)?\d{1,3}\b|\bhabitaci[oó]n\s*(n[ºo°.]?\s*)?\d{1,3}\b/i, nombre: "una cama o habitación" }
    ];

    function textosDelEstado() {
        var out = [];
        (function rec(v) {
            if (typeof v === "string") out.push(v);
            else if (Array.isArray(v)) v.forEach(rec);
            else if (v && typeof v === "object") Object.keys(v).forEach(function (k) { rec(v[k]); });
        })(estado);
        return out;
    }

    function detectarIdentificadores() {
        var hallados = {};
        textosDelEstado().forEach(function (t) {
            PATRONES.forEach(function (p) { if (p.re.test(t)) hallados[p.nombre] = true; });
        });
        var lista = Object.keys(hallados);
        var caja = $("alerta-ident");
        if (lista.length) {
            $("alerta-ident-txt").textContent = "Atención: parece que el texto contiene " + lista.join(", ") +
                ". Elimínelo o sustitúyalo por un dato genérico antes de continuar.";
            caja.hidden = false;
        } else {
            caja.hidden = true;
        }
    }

    /* ---------- campos estáticos ---------- */
    function enlazarCampos() {
        document.querySelectorAll("[data-k]").forEach(function (c) {
            var ruta = c.getAttribute("data-k");
            if (c.type === "radio") {
                c.checked = (obtener(ruta) === c.value);
                c.addEventListener("change", function () { if (c.checked) { fijar(ruta, c.value); guardarPronto(); } });
            } else {
                c.value = obtener(ruta) || "";
                c.addEventListener("input", function () { fijar(ruta, c.value); guardarPronto(); });
            }
        });
    }

    /* ---------- filas dinámicas (cronología, acciones) ---------- */
    function pintarFilas(contenedorId, clase, lista, campos, etiqueta) {
        var cont = $(contenedorId);
        cont.textContent = "";
        lista.forEach(function (fila, i) {
            var cuadro = el("div", { "class": "ai-fila " + clase });
            campos.forEach(function (c) {
                var ctl;
                var nombre = etiqueta + ", fila " + (i + 1) + ": " + c.etiqueta;
                if (c.tipo === "textarea") ctl = el("textarea", { rows: "2", "aria-label": nombre });
                else ctl = el("input", { type: c.tipo || "text", "aria-label": nombre });
                ctl.value = fila[c.k] || "";
                ctl.addEventListener("input", function () { fila[c.k] = ctl.value; guardarPronto(); });
                cuadro.appendChild(ctl);
            });
            var x = el("button", { type: "button", "class": "ai-btn-x", "aria-label": "Quitar " + etiqueta.toLowerCase() + ", fila " + (i + 1) }, [el("i", { "class": "fa-solid fa-xmark", "aria-hidden": "true" })]);
            x.addEventListener("click", function () {
                lista.splice(i, 1);
                if (!lista.length) lista.push(vacioFila(campos));
                pintarFilas(contenedorId, clase, lista, campos, etiqueta);
                guardarPronto();
            });
            cuadro.appendChild(x);
            cont.appendChild(cuadro);
        });
    }
    function vacioFila(campos) { var f = {}; campos.forEach(function (c) { f[c.k] = ""; }); return f; }

    var CAMPOS_CRONO = [
        { k: "cuando", etiqueta: "cuándo" },
        { k: "que", etiqueta: "qué ocurrió", tipo: "textarea" },
        { k: "quien", etiqueta: "rol implicado" }
    ];
    var CAMPOS_ACC = [
        { k: "que", etiqueta: "acción de mejora", tipo: "textarea" },
        { k: "resp", etiqueta: "responsable" },
        { k: "plazo", etiqueta: "plazo", tipo: "date" },
        { k: "indic", etiqueta: "indicador de seguimiento" }
    ];

    function pintarCrono() { pintarFilas("filas-crono", "ai-cols-crono", estado.crono, CAMPOS_CRONO, "Cronología"); }
    function pintarAcciones() { pintarFilas("filas-acc", "ai-cols-acc", estado.acciones, CAMPOS_ACC, "Acción de mejora"); }

    /* ---------- factores, barreras, porqués ---------- */
    function pintarFactores() {
        var cont = $("factores");
        cont.textContent = "";
        FACTORES.forEach(function (cat) {
            if (!estado.factores[cat.id]) estado.factores[cat.id] = { items: [], nota: "" };
            var datos = estado.factores[cat.id];
            var fs = el("fieldset", { "class": "ai-factor" }, [el("legend", { text: cat.nombre })]);
            cat.items.forEach(function (it, n) {
                var cb = el("input", { type: "checkbox", id: "fc-" + cat.id + "-" + n });
                cb.checked = datos.items.indexOf(it) > -1;
                cb.addEventListener("change", function () {
                    var pos = datos.items.indexOf(it);
                    if (cb.checked && pos === -1) datos.items.push(it);
                    if (!cb.checked && pos > -1) datos.items.splice(pos, 1);
                    guardarPronto();
                });
                fs.appendChild(el("label", { "class": "ai-opcion", "for": "fc-" + cat.id + "-" + n }, [cb, it]));
            });
            var idNota = "fn-" + cat.id;
            fs.appendChild(el("label", { "class": "nota", "for": idNota, text: "Nota sobre " + cat.nombre.toLowerCase() + " (opcional)" }));
            var ta = el("textarea", { id: idNota, rows: "2" });
            ta.value = datos.nota || "";
            ta.addEventListener("input", function () { datos.nota = ta.value; guardarPronto(); });
            fs.appendChild(ta);
            cont.appendChild(fs);
        });
    }

    function pintarBarreras() {
        var cont = $("barreras");
        cont.textContent = "";
        BARRERAS.forEach(function (b, i) {
            var id = "br-" + i;
            var sel = el("select", { id: id });
            ESTADOS_BARRERA.forEach(function (e) { sel.appendChild(el("option", { value: e, text: e })); });
            sel.value = estado.barreras[b] || ESTADOS_BARRERA[0];
            sel.addEventListener("change", function () { estado.barreras[b] = sel.value; guardarPronto(); });
            cont.appendChild(el("div", { "class": "ai-barrera" }, [el("label", { "for": id, text: b }), sel]));
        });
    }

    function pintarPorques() {
        var cont = $("porques");
        cont.textContent = "";
        for (var i = 0; i < 5; i++) {
            (function (n) {
                var id = "pq-" + n;
                var ta = el("textarea", { id: id, rows: "2" });
                ta.value = estado.porques[n] || "";
                ta.addEventListener("input", function () { estado.porques[n] = ta.value; guardarPronto(); });
                cont.appendChild(el("div", { "class": "ai-porque" }, [el("label", { "for": id, text: "¿Por qué " + (n + 1) + "?" }), ta]));
            })(i);
        }
    }

    /* ---------- resumen ---------- */
    function hayTexto(v) { return typeof v === "string" && v.trim() !== ""; }

    function construirResumen(destino) {
        destino.textContent = "";
        var d = estado.desc || {}, c = estado.clas || {};
        var raiz = el("div");
        raiz.appendChild(el("h3", { text: "Análisis de incidente de seguridad del paciente" + (hayTexto(d.titulo) ? ": " + d.titulo : "") }));
        raiz.appendChild(el("div", { "class": "meta", text: "Documento de trabajo generado el " + new Date().toLocaleDateString("es-ES") + ". Sin datos identificativos." }));

        function seccionDL(titulo, pares) {
            var visibles = pares.filter(function (p) { return hayTexto(p[1]); });
            raiz.appendChild(el("h4", { text: titulo }));
            if (!visibles.length) { raiz.appendChild(el("p", { "class": "vacio", text: "Sin información." })); return; }
            var dl = el("dl");
            visibles.forEach(function (p) { dl.appendChild(el("dt", { text: p[0] })); dl.appendChild(el("dd", { text: p[1] })); });
            raiz.appendChild(dl);
        }

        seccionDL("1. Descripción del hecho", [
            ["Fecha aproximada", d.fecha ? new Date(d.fecha + "T00:00:00").toLocaleDateString("es-ES") : ""],
            ["Ámbito o unidad", d.ambito], ["Qué ocurrió", d.hecho],
            ["Cómo se detectó", d.deteccion], ["Medidas inmediatas", d.medidas]
        ]);
        seccionDL("2. Clasificación", [
            ["Tipo", c.tipo], ["Alcance", c.alcance], ["Gravedad", c.gravedad],
            ["Frecuencia estimada", c.frecuencia], ["Notificado en notificASP", c.notificado],
            ["Informado paciente/familia", c.informado]
        ]);

        raiz.appendChild(el("h4", { text: "3. Cronología" }));
        var crono = estado.crono.filter(function (f) { return hayTexto(f.cuando) || hayTexto(f.que) || hayTexto(f.quien); });
        if (!crono.length) raiz.appendChild(el("p", { "class": "vacio", text: "Sin información." }));
        else raiz.appendChild(tabla(["Cuándo", "Qué ocurrió", "Rol implicado"], crono.map(function (f) { return [f.cuando, f.que, f.quien]; })));

        raiz.appendChild(el("h4", { text: "4. Factores contribuyentes" }));
        var hay = false;
        FACTORES.forEach(function (cat) {
            var dt = estado.factores[cat.id];
            if (!dt || (!dt.items.length && !hayTexto(dt.nota))) return;
            hay = true;
            raiz.appendChild(el("strong", { text: cat.nombre }));
            if (dt.items.length) {
                var ul = el("ul");
                dt.items.forEach(function (it) { ul.appendChild(el("li", { text: it })); });
                raiz.appendChild(ul);
            }
            if (hayTexto(dt.nota)) raiz.appendChild(el("p", { text: "Nota: " + dt.nota }));
        });
        if (!hay) raiz.appendChild(el("p", { "class": "vacio", text: "Sin factores marcados." }));

        raiz.appendChild(el("h4", { text: "5. Barreras y causas raíz" }));
        var br = BARRERAS.filter(function (b) { return estado.barreras[b] && estado.barreras[b] !== ESTADOS_BARRERA[0]; });
        if (br.length) raiz.appendChild(tabla(["Barrera o defensa", "Valoración"], br.map(function (b) { return [b, estado.barreras[b]]; })));
        var extra = [["Otras barreras", estado.barrerasOtras]];
        estado.porques.forEach(function (p, i) { extra.push(["¿Por qué " + (i + 1) + "?", p]); });
        extra.push(["Causa(s) raíz", estado.causaRaiz]);
        var vis = extra.filter(function (p) { return hayTexto(p[1]); });
        if (vis.length) {
            var dl = el("dl", { style: "margin-top:6px" });
            vis.forEach(function (p) { dl.appendChild(el("dt", { text: p[0] })); dl.appendChild(el("dd", { text: p[1] })); });
            raiz.appendChild(dl);
        } else if (!br.length) raiz.appendChild(el("p", { "class": "vacio", text: "Sin información." }));

        raiz.appendChild(el("h4", { text: "6. Plan de acciones de mejora" }));
        var acc = estado.acciones.filter(function (f) { return hayTexto(f.que) || hayTexto(f.resp) || hayTexto(f.plazo) || hayTexto(f.indic); });
        if (!acc.length) raiz.appendChild(el("p", { "class": "vacio", text: "Sin acciones definidas." }));
        else raiz.appendChild(tabla(["Acción", "Responsable", "Plazo", "Indicador"], acc.map(function (f) {
            return [f.que, f.resp, f.plazo ? new Date(f.plazo + "T00:00:00").toLocaleDateString("es-ES") : "", f.indic];
        })));

        raiz.appendChild(el("p", { "class": "aviso-fin", text: "Método de apoyo basado en el Protocolo de Londres y el análisis causa-raíz, según las Recomendaciones para el análisis de incidentes de seguridad del paciente con daño (Ministerio de Sanidad / SECA, 2021). Este documento no sustituye a la notificación en notificASP ni al informe formal del análisis." }));
        destino.appendChild(raiz);
    }

    function tabla(cabeceras, filas) {
        var t = el("table");
        var tr = el("tr");
        cabeceras.forEach(function (h) { tr.appendChild(el("th", { scope: "col", text: h })); });
        t.appendChild(el("thead", null, [tr]));
        var tb = el("tbody");
        filas.forEach(function (f) {
            var r = el("tr");
            f.forEach(function (v) { r.appendChild(el("td", { text: v || "" })); });
            tb.appendChild(r);
        });
        t.appendChild(tb);
        return t;
    }

    /* ---------- navegación ---------- */
    function pintarPasos() {
        var ol = $("pasos");
        ol.textContent = "";
        PASOS.forEach(function (nombre, i) {
            var b = el("button", { type: "button", "class": "ai-paso-btn" }, [
                el("span", { "class": "num", text: String(i + 1) }), el("span", { "class": "txt", text: nombre })
            ]);
            b.setAttribute("aria-label", "Paso " + (i + 1) + ": " + nombre);
            b.addEventListener("click", function () { irA(i, true); });
            ol.appendChild(el("li", null, [b]));
        });
    }

    function irA(n, enfocar) {
        n = Math.max(0, Math.min(PASOS.length - 1, n));
        estado.paso = n;
        PASOS.forEach(function (_, i) { $("paso-" + (i + 1)).hidden = (i !== n); });
        document.querySelectorAll(".ai-paso-btn").forEach(function (b, i) {
            if (i === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
        });
        $("btn-ant").disabled = (n === 0);
        $("btn-sig").hidden = (n === PASOS.length - 1);
        if (n === PASOS.length - 1) construirResumen($("resumen"));
        var form = document.querySelector("#paso-" + (n + 1) + " .ai-form");
        if (form) form.scrollTop = 0;
        if (enfocar) { var t = $("t" + (n + 1)); if (t) t.focus({ preventScroll: true }); }
    }

    function borrarTodo() {
        if (!window.confirm("¿Borrar todo el análisis y el borrador guardado en este navegador? Esta acción no se puede deshacer.")) return;
        estado = vacio();
        try { window.localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
        iniciarVistas();
        irA(0, true);
        $("estado-borrador").textContent = "Análisis y borrador borrados.";
    }

    function imprimir() {
        construirResumen($("zona-impresion"));
        window.print();
    }

    function iniciarVistas() {
        enlazarCampos();
        pintarCrono(); pintarAcciones(); pintarFactores(); pintarBarreras(); pintarPorques();
        detectarIdentificadores();
    }

    document.addEventListener("DOMContentLoaded", function () {
        cargar();
        pintarPasos();
        iniciarVistas();
        $("add-crono").addEventListener("click", function () { estado.crono.push(vacioFila(CAMPOS_CRONO)); pintarCrono(); guardarPronto(); });
        $("add-acc").addEventListener("click", function () { estado.acciones.push(vacioFila(CAMPOS_ACC)); pintarAcciones(); guardarPronto(); });
        $("btn-ant").addEventListener("click", function () { irA(estado.paso - 1, true); });
        $("btn-sig").addEventListener("click", function () { irA(estado.paso + 1, true); });
        $("btn-borrar").addEventListener("click", borrarTodo);
        $("btn-imprimir").addEventListener("click", imprimir);
        window.addEventListener("beforeprint", function () { construirResumen($("zona-impresion")); });
        irA(typeof estado.paso === "number" ? estado.paso : 0, false);
    });
})();
