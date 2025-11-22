// ======================================================
//   DATOS: LOS 5 MOMENTOS DE LA OMS
// ======================================================
const MOMENTOS = {
    1: {
        titulo: "Antes del contacto con el paciente",
        cuando: "Antes de tocar al paciente al acercarse a él.",
        porque: "Para proteger al paciente de los gérmenes dañinos que llevas en las manos.",
        color: "#0ea5e9" // Azul cielo
    },
    2: {
        titulo: "Antes de realizar una tarea aséptica",
        cuando: "Inmediatamente antes de cualquier tarea aséptica o de manipulación (ej: vía periférica, sondaje).",
        porque: "Para proteger al paciente de los gérmenes dañinos, incluidos los suyos propios, que podrían entrar en su cuerpo.",
        color: "#0ea5e9"
    },
    3: {
        titulo: "Después del riesgo de exposición a fluidos",
        cuando: "Inmediatamente después de un riesgo de exposición a fluidos corporales (y tras quitarse los guantes).",
        porque: "Para protegerte a ti mismo y al entorno de atención sanitaria de los gérmenes dañinos del paciente.",
        color: "#f97316" // Naranja
    },
    4: {
        titulo: "Después del contacto con el paciente",
        cuando: "Después de tocar a un paciente y la zona que lo rodea, al dejar la cabecera.",
        porque: "Para protegerte a ti mismo y al entorno de atención sanitaria.",
        color: "#f97316"
    },
    5: {
        titulo: "Después del contacto con el entorno",
        cuando: "Después de tocar cualquier objeto o mueble del entorno inmediato del paciente (ej: barandilla, mesita), incluso si no se ha tocado al paciente.",
        porque: "Para protegerte a ti mismo y al entorno de atención sanitaria.",
        color: "#22c55e" // Verde
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.moment-btn');
    const panelInfo = document.getElementById('info-panel');
    const placeholder = document.querySelector('.info-placeholder');
    const content = document.getElementById('info-content');

    // Elementos a rellenar
    const elNum = document.getElementById('info-num');
    const elTitle = document.getElementById('info-title');
    const elWhen = document.getElementById('info-when');
    const elWhy = document.getElementById('info-why');

    botones.forEach(btn => {
        // Evento Click (Móvil y Desktop)
        btn.addEventListener('click', () => activarMomento(btn));
        
        // Evento Hover (Desktop)
        btn.addEventListener('mouseenter', () => activarMomento(btn));
    });

    function activarMomento(botonActivo) {
        const id = botonActivo.dataset.id;
        const data = MOMENTOS[id];

        // 1. Visual Botones
        botones.forEach(b => b.classList.remove('active'));
        botonActivo.classList.add('active');

        // 2. Mostrar Contenido
        placeholder.style.display = 'none';
        content.classList.remove('hidden');
        
        // Reiniciar animación para efecto visual
        content.style.animation = 'none';
        void content.offsetHeight; /* trigger reflow */
        content.style.animation = 'fadeIn 0.3s forwards';

        // 3. Rellenar Datos
        elNum.textContent = id;
        elNum.style.background = data.color;
        elTitle.textContent = data.titulo;
        elWhen.textContent = data.cuando;
        elWhy.textContent = data.porque;
    }
});