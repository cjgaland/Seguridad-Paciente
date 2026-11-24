/* Buscador de protocolos y documentos.
   Lee los .txt locales de assets/docs/ mediante fetch con ruta RELATIVA y busca en el navegador.
   No se contacta con ningún servicio externo. */
(function () {
    "use strict";

    var VENTANA = 600, PASO = 400, POR_PAGINA = 30;
    var $ = function (id) { return document.getElementById(id); };

    /* ---------- texto sin tildes ni mayúsculas, conservando la longitud ---------- */
    var MAPA = { "á": "a", "à": "a", "â": "a", "ä": "a", "ã": "a", "å": "a", "é": "e", "è": "e", "ê": "e", "ë": "e",
                 "í": "i", "ì": "i", "î": "i", "ï": "i", "ó": "o", "ò": "o", "ô": "o", "ö": "o", "õ": "o",
                 "ú": "u", "ù": "u", "û": "u", "ü": "u", "ñ": "n", "ç": "c", "İ": "i" };
    var RE_ACENTOS = /[áàâäãåéèêëíìîïóòôöõúùûüñçİ]/g;
    function plano(s) { return s.replace(/İ/g, "I").toLowerCase().replace(RE_ACENTOS, function (c) { return MAPA[c] || c; }); }

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

    /* ---------- estado ---------- */
    var docs = PROT_DOCS.map(function (m) {
        return { m: m, url: PROT_RUTA_DOCS + m.file, texto: "", pl: "", estado: "pend" };
    });
    var filtro = { org: "", doc: "", q: "" };
    var maxMostrar = POR_PAGINA;
    var enFile = location.protocol === "file:";
    var cargados = 0, terminados = 0;

    /* ---------- carga de documentos ---------- */
    function prepararTexto(d, bruto) {
        d.texto = bruto.normalize("NFC").replace(/\s+/g, " ").trim();
        d.pl = plano(d.texto);
        if (d.pl.length !== d.texto.length) { d.pl = ""; d.texto = ""; d.estado = "error"; return; }
        d.estado = "ok";
    }

    function cargarUno(d) {
        return fetch(d.url, { cache: "no-store" })
            .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
            .then(function (t) { prepararTexto(d, t); })
            .catch(function () { d.estado = "error"; })
            .then(function () {
                terminados++;
                if (d.estado === "ok") cargados++;
                actualizarProgreso();
            });
    }

    function cargarTodos() {
        if (enFile) {
            $("aviso-servidor").hidden = false;
            docs.forEach(function (d) { d.estado = "error"; });
            terminados = docs.length;
            actualizarProgreso();
            return;
        }
        var cola = docs.slice(), activos = 0, MAX = 4;
        (function siguiente() {
            while (activos < MAX && cola.length) {
                activos++;
                cargarUno(cola.shift()).then(function () { activos--; siguiente(); });
            }
        })();
    }

    function mensajeBase() {
        if (terminados < docs.length) {
            $("estado").textContent = "Cargando documentos (" + terminados + " de " + docs.length + ")...";
        } else if (!cargados) {
            if (!enFile) $("aviso-servidor").hidden = false;
            $("estado").textContent = "No se han podido cargar los documentos.";
        } else {
            $("estado").textContent = cargados + " documentos listos para buscar" +
                (cargados < docs.length ? " (" + (docs.length - cargados) + " no disponibles)." : ".");
        }
    }

    function actualizarProgreso() {
        mensajeBase();
        if (terminados === docs.length || filtro.q) buscar();
        pintarDocs();
    }

    /* ---------- búsqueda ---------- */
    var resultados = [];      // todos los fragmentos, ordenados
    var parcial = false;
    var porDoc = {};          // nº de fragmentos por documento

    function palabras() { return plano(filtro.q).split(/\s+/).filter(function (p) { return p.length >= 2; }); }

    function buscar() {
        var ps = palabras();
        resultados = []; porDoc = {}; parcial = false;
        if (!ps.length) { pintarResultados(); pintarDocs(); return; }

        function recoger(modoAnd) {
            var salida = [];
            docs.forEach(function (d) {
                if (d.estado !== "ok") return;
                if (filtro.org && d.m.org !== filtro.org) return;
                var candidatos = [];
                for (var i = 0, ini = 0; ini < d.pl.length; i++, ini = i * PASO) {
                    var tr = d.pl.substr(ini, VENTANA), hit = 0, ocurr = 0;
                    for (var k = 0; k < ps.length; k++) {
                        var pos = tr.indexOf(ps[k]);
                        if (pos > -1) { hit++; ocurr += 1 + (tr.indexOf(ps[k], pos + ps[k].length) > -1 ? 1 : 0); }
                    }
                    if (modoAnd ? hit === ps.length : hit > 0) candidatos.push({ d: d, ini: ini, score: hit * 10 + ocurr });
                    if (ini + VENTANA >= d.pl.length) break;
                }
                // Evita fragmentos solapados del mismo documento: se queda el de mayor puntuación
                candidatos.sort(function (a, b) { return b.score - a.score; });
                var elegidos = [];
                candidatos.forEach(function (c) {
                    if (!elegidos.some(function (e) { return Math.abs(e.ini - c.ini) < VENTANA * 0.7; })) elegidos.push(c);
                });
                salida = salida.concat(elegidos);
            });
            return salida;
        }

        var todos = recoger(true);
        if (!todos.length && ps.length > 1) { todos = recoger(false); parcial = todos.length > 0; }
        todos.sort(function (a, b) { return b.score - a.score; });

        todos.forEach(function (r) { porDoc[r.d.m.file] = (porDoc[r.d.m.file] || 0) + 1; });
        resultados = filtro.doc ? todos.filter(function (r) { return r.d.m.file === filtro.doc; }) : todos;
        maxMostrar = POR_PAGINA;
        pintarResultados();
        pintarDocs();
    }

    /* ---------- pintado ---------- */
    function resaltar(texto, plan, ps) {
        var frag = document.createDocumentFragment();
        var marcas = new Array(texto.length).fill(false);
        ps.forEach(function (p) {
            var pos = plan.indexOf(p);
            while (pos > -1) {
                for (var k = pos; k < pos + p.length; k++) marcas[k] = true;
                pos = plan.indexOf(p, pos + p.length);
            }
        });
        var i = 0;
        while (i < texto.length) {
            var j = i;
            while (j < texto.length && marcas[j] === marcas[i]) j++;
            var trozo = texto.slice(i, j);
            if (marcas[i]) frag.appendChild(el("mark", { text: trozo }));
            else frag.appendChild(document.createTextNode(trozo));
            i = j;
        }
        return frag;
    }

    function fragmento(r) {
        var t = r.d.texto, ini = r.ini, fin = Math.min(t.length, ini + VENTANA);
        if (ini > 0 && t.charAt(ini - 1) !== " ") { var a = t.indexOf(" ", ini); if (a > -1 && a < fin) ini = a + 1; }
        if (fin < t.length && t.charAt(fin) !== " ") { var b = t.lastIndexOf(" ", fin); if (b > ini) fin = b; }
        return { texto: t.slice(ini, fin), plano: r.d.pl.slice(ini, fin), pre: ini > 0, post: fin < t.length };
    }

    function pintarResultados() {
        var cont = $("resultados");
        cont.textContent = "";
        var ps = palabras();

        if (!cargados && terminados === docs.length) {
            cont.appendChild(el("p", { "class": "pr-vacio", text: enFile
                ? "Abra la aplicación desde un servidor web para poder buscar dentro de los documentos."
                : "No se han podido cargar los documentos. Compruebe su conexión con el servidor e inténtelo de nuevo recargando la página." }));
            return;
        }
        if (!ps.length) {
            mensajeBase();
            cont.appendChild(el("p", { "class": "pr-vacio", text: filtro.q
                ? "Escriba al menos dos letras por palabra."
                : "Escriba una o varias palabras para buscar en los documentos. Puede limitar la búsqueda a un organismo o a un solo documento con el listado de la izquierda." }));
            return;
        }
        if (terminados < docs.length) $("estado").textContent = "Cargando documentos (" + terminados + " de " + docs.length + ")... Resultados provisionales.";
        else $("estado").textContent = resultados.length
            ? resultados.length + (resultados.length === 1 ? " fragmento encontrado" : " fragmentos encontrados") +
              (parcial ? ". Ninguno contiene todas las palabras; se muestran los que contienen alguna." : ".")
            : "Sin resultados.";

        if (!resultados.length && terminados === docs.length) {
            cont.appendChild(el("p", { "class": "pr-vacio", text: "No se han encontrado coincidencias. Pruebe con menos palabras, con sinónimos o quite filtros." }));
            return;
        }

        resultados.slice(0, maxMostrar).forEach(function (r) {
            var f = fragmento(r);
            var p = el("p");
            if (f.pre) p.appendChild(document.createTextNode("… "));
            p.appendChild(resaltar(f.texto, f.plano, ps));
            if (f.post) p.appendChild(document.createTextNode(" …"));
            var enlace = el("a", { href: r.d.url, target: "_blank", rel: "noopener", text: "Abrir documento" });
            var cab = el("div", { "class": "pr-res-cab" }, [
                el("span", { "class": "pr-badge org-" + r.d.m.org, text: r.d.m.org }),
                el("strong", { text: r.d.m.titulo }),
                enlace
            ]);
            cont.appendChild(el("article", { "class": "pr-res" }, [cab, p]));
        });

        if (resultados.length > maxMostrar) {
            var mas = el("button", { type: "button", "class": "pr-mas", text: "Mostrar más resultados (" + (resultados.length - maxMostrar) + " restantes)" });
            mas.addEventListener("click", function () { maxMostrar += POR_PAGINA; pintarResultados(); });
            cont.appendChild(mas);
        }
    }

    function pintarDocs() {
        var ul = $("lista-docs");
        ul.textContent = "";
        docs.forEach(function (d) {
            if (filtro.org && d.m.org !== filtro.org) return;
            var meta = el("span", { "class": "pr-doc-meta" }, [
                el("span", { "class": "pr-badge org-" + d.m.org, title: PROT_ORGANISMOS[d.m.org].nombre, text: d.m.org })
            ]);
            if (d.m.idioma) meta.appendChild(el("span", { "class": "pr-badge pr-badge-sec", text: "En inglés" }));
            if (d.estado === "error" && terminados === docs.length) meta.appendChild(el("span", { "class": "pr-badge pr-badge-err", text: "No disponible" }));
            if (filtro.q && porDoc[d.m.file]) meta.appendChild(el("span", { "class": "pr-badge pr-badge-hits", text: porDoc[d.m.file] + " coincidencias" }));

            var b = el("button", { type: "button", "class": "pr-doc", "aria-pressed": String(filtro.doc === d.m.file),
                                   title: filtro.doc === d.m.file ? "Quitar el filtro de este documento" : "Buscar solo en este documento" }, [
                el("span", { "class": "pr-doc-t", text: d.m.titulo }),
                el("span", { "class": "pr-doc-d", text: d.m.desc }),
                meta
            ]);
            b.addEventListener("click", function () {
                filtro.doc = (filtro.doc === d.m.file ? "" : d.m.file);
                buscar();
                $("q").focus();
            });
            ul.appendChild(el("li", null, [b]));
        });
    }

    function pintarOrgs() {
        var cont = $("orgs");
        cont.textContent = "";
        [["", "Todos"]].concat(Object.keys(PROT_ORGANISMOS).map(function (k) { return [k, k]; })).forEach(function (par) {
            var b = el("button", { type: "button", "class": "pr-chip", "aria-pressed": String(filtro.org === par[0]), text: par[1] });
            if (par[0]) b.title = PROT_ORGANISMOS[par[0]].nombre;
            b.addEventListener("click", function () {
                filtro.org = par[0];
                if (filtro.doc && filtro.org) {
                    var sel = docs.filter(function (d) { return d.m.file === filtro.doc; })[0];
                    if (sel && sel.m.org !== filtro.org) filtro.doc = "";
                }
                pintarOrgs(); buscar();
            });
            cont.appendChild(b);
        });
    }

    /* ---------- FAQ ---------- */
    var temaFaq = "";

    function pintarTemas() {
        var cont = $("temas");
        cont.textContent = "";
        [["", "Todos"]].concat(Object.keys(PROT_FAQ_TEMAS).map(function (k) { return [k, PROT_FAQ_TEMAS[k]]; })).forEach(function (par) {
            var b = el("button", { type: "button", "class": "pr-chip", "aria-pressed": String(temaFaq === par[0]), text: par[1] });
            b.addEventListener("click", function () { temaFaq = par[0]; pintarTemas(); pintarFaq(); });
            cont.appendChild(b);
        });
    }

    function pintarFaq() {
        var cont = $("faq-lista");
        cont.textContent = "";
        PROT_FAQ.forEach(function (f) {
            if (temaFaq && f.tema !== temaFaq) return;
            var enlace = el("a", { href: PROT_RUTA_DOCS + f.file, target: "_blank", rel: "noopener", text: "Abrir documento" });
            var cuerpo = el("div", { "class": "pr-faq-cuerpo" }, [
                el("p", { text: f.r }),
                el("p", { "class": "pr-fuente" }, [el("strong", { text: "Fuente: " }), f.fuente + ". ", enlace])
            ]);
            cont.appendChild(el("details", { "class": "pr-faq" }, [
                el("summary", { text: f.p }),
                el("span", { "class": "pr-faq-tema", text: PROT_FAQ_TEMAS[f.tema] }),
                cuerpo
            ]));
        });
    }

    /* ---------- pestañas ---------- */
    function activarTab(cual) {
        var buscar = cual === "buscar";
        $("tab-buscar").setAttribute("aria-selected", String(buscar));
        $("tab-faq").setAttribute("aria-selected", String(!buscar));
        $("tab-buscar").tabIndex = buscar ? 0 : -1;
        $("tab-faq").tabIndex = buscar ? -1 : 0;
        $("panel-buscar").hidden = !buscar;
        $("panel-faq").hidden = buscar;
    }

    function iniciarTabs() {
        $("tab-buscar").addEventListener("click", function () { activarTab("buscar"); });
        $("tab-faq").addEventListener("click", function () { activarTab("faq"); });
        [$("tab-buscar"), $("tab-faq")].forEach(function (t) {
            t.addEventListener("keydown", function (e) {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Home" || e.key === "End") {
                    e.preventDefault();
                    var ir = (t.id === "tab-buscar") ? "faq" : "buscar";
                    if (e.key === "Home") ir = "buscar";
                    if (e.key === "End") ir = "faq";
                    activarTab(ir);
                    $("tab-" + ir).focus();
                }
            });
        });
    }

    /* ---------- inicio ---------- */
    var temporizador = null;
    $("q").addEventListener("input", function () {
        filtro.q = $("q").value;
        clearTimeout(temporizador);
        temporizador = setTimeout(buscar, 150);
    });

    iniciarTabs();
    pintarOrgs();
    pintarDocs();
    pintarTemas();
    pintarFaq();
    pintarResultados();
    cargarTodos();
})();
