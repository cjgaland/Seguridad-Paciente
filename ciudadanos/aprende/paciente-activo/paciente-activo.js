const PASOS = {
    1: {
        titulo: "Prepárate antes de ir",
        icon: "fa-list-check",
        desc: "Una consulta médica puede ser breve. Para aprovecharla al máximo, es fundamental llevar los deberes hechos desde casa.",
        tips: [
            "Haz una lista escrita con tus síntomas y desde cuándo los tienes.",
            "Anota todas las medicinas que tomas (incluidas hierbas o vitaminas).",
            "Si tienes pruebas anteriores o informes, llévalos contigo.",
            "Si lo necesitas, pide a un familiar que te acompañe."
        ]
    },
    2: {
        titulo: "Pregunta sin miedo",
        icon: "fa-question",
        desc: "No te quedes con dudas. El personal sanitario está ahí para ayudarte, pero necesitan saber que no has entendido algo.",
        tips: [
            "Si no entiendes una palabra, pide que te la expliquen más sencillo.",
            "Pregunta: '¿Para qué es esta prueba?' o '¿Qué pasa si no me tomo este medicamento?'.",
            "No asientas con la cabeza si no estás seguro. Di: 'Lo siento, no lo he entendido'.",
            "Pregunta si hay otras opciones de tratamiento."
        ]
    },
    3: {
        titulo: "Anota las instrucciones",
        icon: "fa-pen-to-square",
        desc: "Es fácil olvidar los detalles al salir de la consulta. Escribir las cosas ayuda a recordar y a cumplir mejor el tratamiento.",
        tips: [
            "Lleva libreta y boli, o usa las notas del móvil.",
            "Pide al profesional que te escriba las indicaciones clave.",
            "Anota cuándo debes volver y qué síntomas vigilar.",
            "Si te dan un diagnóstico, escribe el nombre exacto para buscar información fiable luego."
        ]
    },
    4: {
        titulo: "Verifica que lo has entendido",
        icon: "fa-check-double",
        desc: "La mejor forma de asegurar que la comunicación ha funcionado es repetir la información con tus propias palabras.",
        tips: [
            "Usa la técnica del 'Parafraseo': 'Entonces, doctor, si he entendido bien, debo tomar esto 3 veces al día...'.",
            "Confirma cuándo y cómo tomar la medicación (¿con comida?, ¿en ayunas?).",
            "Asegúrate de saber qué hacer si te sientes peor al llegar a casa."
        ]
    },
    5: {
        titulo: "Participa en las decisiones",
        icon: "fa-handshake",
        desc: "Tu salud es tuya. Tienes derecho a opinar y a decidir sobre los tratamientos que afectan a tu vida.",
        tips: [
            "Expresa tus preferencias y preocupaciones (ej: 'Me da miedo operarme', 'No puedo pagar esa medicina').",
            "Pregunta por los riesgos y beneficios de cada opción.",
            "Acuerda con el profesional un plan que sea realista para ti.",
            "Recuerda: sois un equipo."
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.step-btn');
    const placeholder = document.querySelector('.info-placeholder');
    const content = document.getElementById('info-content');
    
    // Elementos a rellenar
    const elTitle = document.getElementById('info-title');
    const elDesc = document.getElementById('info-desc');
    const elIcon = document.getElementById('info-icon');
    const elTips = document.getElementById('info-tips');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            loadStep(id, btn);
        });
    });

    function loadStep(id, activeBtn) {
        const data = PASOS[id];
        if(!data) return;

        // 1. Visual Botones
        buttons.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        // 2. Mostrar Contenido
        placeholder.style.display = 'none';
        content.classList.remove('hidden');
        
        // Animación reset
        content.style.animation = 'none';
        void content.offsetHeight; // Trigger reflow
        content.style.animation = 'fadeIn 0.4s ease-out';

        // 3. Rellenar Datos
        elTitle.textContent = `${id}. ${data.titulo}`;
        elDesc.textContent = data.desc;
        elIcon.className = `fa-solid ${data.icon}`;
        
        // Rellenar lista de tips
        elTips.innerHTML = "";
        data.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            elTips.appendChild(li);
        });
    }
    
    // Cargar el paso 1 por defecto para que no se vea vacío
    // (Opcional, si prefieres que el usuario haga clic, borra esta línea)
    // buttons[0].click();
});