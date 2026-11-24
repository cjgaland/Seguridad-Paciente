/* Diccionario de términos médicos: búsqueda instantánea, filtro por categoría y letra.
   Todo se ejecuta en el navegador; no se envía ni se guarda ningún dato. */
(function () {
    "use strict";

    // Normaliza (sin tildes, minúsculas) conservando la correspondencia con el texto original
    function normalizar(texto) {
        var norm = "", mapa = [];
        for (var i = 0; i < texto.length; i++) {
            var n = texto[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
            for (var j = 0; j < n.length; j++) { norm += n[j]; mapa.push(i); }
        }
        return { norm: norm, mapa: mapa };
    }
    function simple(texto) { return normalizar(texto).norm; }

    var $ = function (id) { return document.getElementById(id); };
    var elBuscador = $("buscador"), elLista = $("lista"), elContador = $("contador");
    var elCats = $("categorias"), elLetras = $("letras");

    var estado = { q: "", cat: "", letra: "" };

    // Precalcular datos normalizados
    var items = GLOSARIO.map(function (e) {
        var term = simple(e.t);
        var m = /[a-z0-9]/.exec(term);
        return {
            e: e,
            term: term,
            alias: simple(e.a || ""),
            todo: term + " " + simple(e.a || "") + " " + simple(e.d) + " " + simple(e.s || ""),
            letra: m ? m[0].toUpperCase() : "#"
        };
    }).sort(function (x, y) { return x.term.localeCompare(y.term, "es"); });

    function palabrasConsulta() {
        return simple(estado.q).split(/\s+/).filter(Boolean);
    }

    function coincide(it, palabras) {
        for (var i = 0; i < palabras.length; i++) {
            if (it.todo.indexOf(palabras[i]) === -1) return false;
        }
        return true;
    }

    function prioridad(it, palabras) {
        if (!palabras.length) return 0;
        var q = palabras.join(" ");
        if (it.term.indexOf(q) === 0) return 0;
        if (it.term.indexOf(q) > -1) return 1;
        if (palabras.every(function (p) { return it.term.indexOf(p) > -1; })) return 2;
        if (it.alias.indexOf(q) > -1) return 3;
        return 4;
    }

    // Crea nodos de texto con <mark> en las coincidencias (sin usar innerHTML)
    function resaltar(texto, palabras) {
        var frag = document.createDocumentFragment();
        if (!palabras.length) { frag.appendChild(document.createTextNode(texto)); return frag; }
        var r = normalizar(texto), marcas = new Array(texto.length).fill(false);
        palabras.forEach(function (p) {
            var pos = r.norm.indexOf(p);
            while (pos > -1) {
                for (var k = pos; k < pos + p.length; k++) marcas[r.mapa[k]] = true;
                pos = r.norm.indexOf(p, pos + p.length);
            }
        });
        var i = 0;
        while (i < texto.length) {
            var j = i;
            while (j < texto.length && marcas[j] === marcas[i]) j++;
            var trozo = texto.slice(i, j);
            if (marcas[i]) { var m = document.createElement("mark"); m.textContent = trozo; frag.appendChild(m); }
            else frag.appendChild(document.createTextNode(trozo));
            i = j;
        }
        return frag;
    }

    function crearTarjeta(it, palabras) {
        var art = document.createElement("article");
        art.className = "glos-card";
        var h = document.createElement("h3");
        h.appendChild(resaltar(it.e.t, palabras));
        art.appendChild(h);
        var tag = document.createElement("span");
        tag.className = "glos-tag";
        tag.textContent = GLOSARIO_CATEGORIAS[it.e.c].nombre;
        art.appendChild(tag);
        var p = document.createElement("p");
        p.appendChild(resaltar(it.e.d, palabras));
        art.appendChild(p);
        if (it.e.s) {
            var s = document.createElement("p");
            s.className = "glos-consejo";
            var ic = document.createElement("i");
            ic.className = "fa-solid fa-shield-heart";
            ic.setAttribute("aria-hidden", "true");
            var b = document.createElement("strong");
            b.textContent = "Consejo de seguridad: ";
            s.appendChild(ic); s.appendChild(b);
            s.appendChild(resaltar(it.e.s, palabras));
            art.appendChild(s);
        }
        return art;
    }

    function render() {
        var palabras = palabrasConsulta();
        // Base filtrada por texto (para recuentos de categorías y letras)
        var porTexto = items.filter(function (it) { return coincide(it, palabras); });
        var porCatTexto = porTexto.filter(function (it) { return !estado.cat || it.e.c === estado.cat; });
        var visibles = porCatTexto.filter(function (it) { return !estado.letra || it.letra === estado.letra; });

        visibles.sort(function (a, b) {
            return prioridad(a, palabras) - prioridad(b, palabras) || a.term.localeCompare(b.term, "es");
        });

        elLista.textContent = "";
        if (!visibles.length) {
            var v = document.createElement("p");
            v.className = "glos-vacio";
            v.textContent = "No hay términos que coincidan. Pruebe con otra palabra o quite algún filtro.";
            elLista.appendChild(v);
        } else {
            var frag = document.createDocumentFragment();
            visibles.forEach(function (it) { frag.appendChild(crearTarjeta(it, palabras)); });
            elLista.appendChild(frag);
        }
        elLista.scrollTop = 0;
        elContador.textContent = visibles.length + (visibles.length === 1 ? " término" : " términos") +
            " de " + items.length;

        // Botones de categoría
        elCats.querySelectorAll(".glos-cat").forEach(function (b) {
            var c = b.dataset.cat;
            var n = porTexto.filter(function (it) { return (!c || it.e.c === c) && (!estado.letra || it.letra === estado.letra); }).length;
            b.querySelector(".n").textContent = n;
            b.setAttribute("aria-pressed", String(estado.cat === c));
        });
        // Botones de letra
        var letrasDisp = {};
        porCatTexto.forEach(function (it) { letrasDisp[it.letra] = true; });
        elLetras.querySelectorAll(".glos-letra").forEach(function (b) {
            var l = b.dataset.letra;
            b.disabled = l !== "" && !letrasDisp[l];
            b.setAttribute("aria-pressed", String(estado.letra === l));
        });
    }

    function construirControles() {
        function botonCat(clave, nombre, icono) {
            var b = document.createElement("button");
            b.type = "button"; b.className = "glos-cat"; b.dataset.cat = clave;
            var i = document.createElement("i"); i.className = "fa-solid " + icono; i.setAttribute("aria-hidden", "true");
            var t = document.createElement("span"); t.textContent = nombre;
            var n = document.createElement("span"); n.className = "n";
            b.appendChild(i); b.appendChild(t); b.appendChild(n);
            b.addEventListener("click", function () { estado.cat = clave; render(); });
            elCats.appendChild(b);
        }
        botonCat("", "Todas", "fa-list");
        Object.keys(GLOSARIO_CATEGORIAS).forEach(function (k) {
            botonCat(k, GLOSARIO_CATEGORIAS[k].nombre, GLOSARIO_CATEGORIAS[k].icono);
        });

        function botonLetra(l, texto) {
            var b = document.createElement("button");
            b.type = "button"; b.className = "glos-letra"; b.dataset.letra = l; b.textContent = texto;
            if (l) b.setAttribute("aria-label", "Letra " + l);
            b.addEventListener("click", function () { estado.letra = (estado.letra === l ? "" : l); render(); });
            elLetras.appendChild(b);
        }
        botonLetra("", "Todas");
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (l) { botonLetra(l, l); });
    }

    elBuscador.addEventListener("input", function () { estado.q = elBuscador.value; render(); });
    $("btn-limpiar").addEventListener("click", function () {
        estado = { q: "", cat: "", letra: "" };
        elBuscador.value = "";
        render();
        elBuscador.focus();
    });

    construirControles();
    render();
})();
