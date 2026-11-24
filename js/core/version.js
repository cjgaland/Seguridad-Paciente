// Versión de la aplicación e historial de cambios (se muestran en Ayuda › Versiones).
// AL PUBLICAR UNA VERSIÓN: cambiar VERSION aquí, añadir la entrada en HISTORIAL,
// poner el mismo número en /version.json y anotarlo en CHANGELOG.md.

export const VERSION = "2.2.0";

export const HISTORIAL = [
    {
        version: "2.2.0",
        fecha: "2026-11-24",
        cambios: [
            "Todas las pantallas caben enteras en la ventana del ordenador, sin desplazarse: el contenido se reparte en columnas (simuladores, listas de comprobación, escalas, encuestas, estadísticas, higiene de manos, medicación…).",
            "Las infografías de higiene de manos se pueden abrir a tamaño completo pulsando sobre ellas.",
            "El manual de usuario se descarga ahora en PDF."
        ]
    },
    {
        version: "2.1.0",
        fecha: "2026-11-24",
        cambios: [
            "En ordenador la página ya no se desplaza: la cabecera queda fija y, si algo no cabe, se mueve solo la caja de contenido. Los juegos «Detectives del hogar» e «Identificación de riesgos» se ven enteros, con el escenario a la izquierda y los mandos a la derecha.",
            "Carga mucho más rápida: las imágenes pesan una cuarta parte (la plataforma pasa de 28 MB a 8,5 MB).",
            "Accesibilidad: navegación con teclado en todas las tarjetas, enlace «Saltar al contenido», foco visible, textos alternativos en los logotipos y mejor contraste en los botones.",
            "Nueva página de Aviso legal, Privacidad y Accesibilidad, enlazada desde la portada y desde la Ayuda.",
            "En el móvil ya no se sale nada por el lateral (cabecera, juegos, clasificación y simulador de notificación).",
            "Simulador de notificación: corregido un error que impedía mostrar la acción recomendada al estimar el riesgo.",
            "Manual de usuario descargable desde la Ayuda.",
            "Se integran las mejoras de la versión publicada en noviembre de 2025 (nuevo panel Aprende de Ciudadanía y estadísticas ampliadas de las encuestas)."
        ]
    },
    {
        version: "2.0.0",
        fecha: "2026-11-24",
        cambios: [
            "Versión preparada para la Estrategia de Seguridad del Paciente del SSPA: se retira por completo la Inteligencia Artificial (asistente, analista de incidentes y traductor) y cualquier conexión a servicios de IA.",
            "Nuevas herramientas sin IA: Diccionario de términos médicos (ciudadanía), Guía de análisis de incidentes paso a paso y Buscador de protocolos y documentos (profesionales).",
            "Las puntuaciones y las encuestas se guardan solo en el propio dispositivo: no sale ningún dato fuera del navegador. Queda preparado para conectarse a un servidor del SAS si se autoriza.",
            "Arreglados los juegos «Adivina la medicina», «Semáforo» y «La mochila», que no arrancaban.",
            "Corregidos más de 150 enlaces a logos e iconos que no se veían.",
            "Nuevo bloque de Ayuda con manual de uso, historial de versiones y aviso de privacidad.",
            "Aviso «Nueva versión disponible · Actualizar» cuando se publica una versión nueva."
        ]
    },
    {
        version: "1.0.0",
        fecha: "2025-11-25",
        cambios: [
            "Primera versión de la plataforma gamificada: itinerarios para Profesionales y Ciudadanía con Aprende, Practica y Juega."
        ]
    }
];
