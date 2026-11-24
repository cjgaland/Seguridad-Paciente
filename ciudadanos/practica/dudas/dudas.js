// REPOSITORIO DE PREGUNTAS SEGURAS
const DATA = {
    general: [
        "¿Cuál es mi diagnóstico exacto?",
        "¿Cuáles son las opciones de tratamiento?",
        "¿Qué riesgos o efectos secundarios tiene?",
        "¿Qué pasa si no hago nada?",
        "¿Cuándo debo volver a revisión?",
        "¿Qué síntomas son de alarma y debo ir a Urgencias?"
    ],
    medicacion: [
        "¿Para qué sirve este medicamento?",
        "¿Cómo y cuándo debo tomarlo (ayunas, comida)?",
        "¿Qué hago si se me olvida una dosis?",
        "¿Interactúa con mis otras medicinas o hierbas?",
        "¿Durante cuánto tiempo debo tomarlo?",
        "¿Tiene efectos secundarios comunes?"
    ],
    pruebas: [
        "¿Para qué es esta prueba?",
        "¿Necesito alguna preparación especial (ayuno)?",
        "¿Tiene algún riesgo?",
        "¿Cuándo tendré los resultados?",
        "¿Me dolerá?"
    ],
    cirugia: [
        "¿Por qué necesito operarme?",
        "¿Hay alternativas a la cirugía?",
        "¿Cuánto tiempo estaré ingresado?",
        "¿Cómo será la recuperación en casa?",
        "¿Qué tipo de anestesia usarán?"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Referencias
    const topicBtns = document.querySelectorAll('.topic-btn');
    const suggestionList = document.getElementById('suggestions-list');
    const suggestionTitle = document.getElementById('suggestion-title');
    const finalListContainer = document.getElementById('final-list-container');
    const dateDisplay = document.getElementById('date-display');
    
    const customInput = document.getElementById('custom-input');
    const btnAddCustom = document.getElementById('btn-add-custom');
    const btnClear = document.getElementById('btn-clear');

    // Estado: Lista de preguntas seleccionadas
    let myQuestions = new Set();

    dateDisplay.textContent = "Fecha: " + new Date().toLocaleDateString();

    // 1. CAMBIO DE TEMA
    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            topicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSuggestions(btn.dataset.topic);
        });
    });

    // 2. RENDERIZAR SUGERENCIAS (Izquierda)
    function renderSuggestions(topic) {
        const titles = {general:"General", medicacion:"Medicación", pruebas:"Pruebas", cirugia:"Cirugía"};
        suggestionTitle.textContent = `Preguntas sobre: ${titles[topic]}`;
        suggestionList.innerHTML = "";
        
        DATA[topic].forEach(q => {
            const div = document.createElement('div');
            div.className = 'check-item';
            if (myQuestions.has(q)) div.classList.add('selected');
            
            // Usamos data-q para identificar la pregunta sin crear closures
            div.dataset.q = q; 
            div.innerHTML = `<div class="check-icon"><i class="fa-solid fa-check"></i></div><span>${q}</span>`;
            
            suggestionList.appendChild(div);
        });
    }

    // DELEGACIÓN DE EVENTOS (LISTA SUGERENCIAS)
    // Un solo listener para toda la lista izquierda
    suggestionList.addEventListener('click', (e) => {
        // Buscamos si el clic fue dentro de un .check-item
        const item = e.target.closest('.check-item');
        if (item) {
            toggleQuestion(item.dataset.q, item);
        }
    });

    function toggleQuestion(text, divElement) {
        if (myQuestions.has(text)) {
            myQuestions.delete(text);
            if(divElement) divElement.classList.remove('selected');
        } else {
            myQuestions.add(text);
            if(divElement) divElement.classList.add('selected');
        }
        renderFinalList();
    }

    // 3. RENDERIZAR LISTA FINAL (Derecha)
    function renderFinalList() {
        finalListContainer.innerHTML = "";
        
        if (myQuestions.size === 0) {
            finalListContainer.innerHTML = '<p class="empty-msg">Tu lista está vacía. Selecciona preguntas.</p>';
            return;
        }

        const groups = { general: [], medicacion: [], pruebas: [], cirugia: [], custom: [] };

        myQuestions.forEach(q => {
            let found = false;
            for (const [cat, questions] of Object.entries(DATA)) {
                if (questions.includes(q)) {
                    groups[cat].push(q);
                    found = true;
                    break;
                }
            }
            if (!found) groups.custom.push(q);
        });

        const displayTitles = {
            general: "General", medicacion: "Medicación", pruebas: "Pruebas Diagnósticas",
            cirugia: "Cirugía", custom: "Otras Dudas"
        };

        for (const [cat, questions] of Object.entries(groups)) {
            if (questions.length > 0) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'print-group';
                
                const h4 = document.createElement('h4');
                h4.textContent = displayTitles[cat];
                groupDiv.appendChild(h4);

                const ol = document.createElement('ol');
                ol.className = 'print-list';

                questions.forEach(q => {
                    const li = document.createElement('li');
                    
                    const span = document.createElement('span');
                    span.className = 'q-text';
                    span.textContent = q;
                    
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-xmark delete-icon';
                    icon.title = "Borrar";
                    // Guardamos el dato en el elemento DOM para recuperarlo luego
                    icon.dataset.questionText = q; 

                    li.appendChild(span);
                    li.appendChild(icon);
                    ol.appendChild(li);
                });

                groupDiv.appendChild(ol);
                finalListContainer.appendChild(groupDiv);
            }
        }
    }

    // DELEGACIÓN DE EVENTOS (LISTA FINAL)
    // Un solo listener para borrar elementos
    finalListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-icon')) {
            const q = e.target.dataset.questionText;
            handleDelete(q);
        }
    });

    function handleDelete(q) {
        myQuestions.delete(q);
        // Refrescar visualmente si está en pantalla la categoría activa
        const activeBtn = document.querySelector('.topic-btn.active');
        if (activeBtn) {
            const activeTopic = activeBtn.dataset.topic;
            renderSuggestions(activeTopic);
        }
        renderFinalList();
    }

    // 4. AÑADIR PERSONALIZADA
    function addCustom() {
        const text = customInput.value.trim();
        if (text) {
            myQuestions.add(text);
            customInput.value = "";
            renderFinalList();
        }
    }
    btnAddCustom.addEventListener('click', addCustom);
    customInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addCustom(); });

    // 5. BORRAR TODO
    btnClear.addEventListener('click', () => {
        if(confirm("¿Borrar toda la lista?")) {
            myQuestions.clear();
            const activeBtn = document.querySelector('.topic-btn.active');
            if(activeBtn) renderSuggestions(activeBtn.dataset.topic);
            renderFinalList();
        }
    });

    // INICIO
    renderSuggestions('general');
});