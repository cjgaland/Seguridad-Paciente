export const caso1 = {
    id: "c1",
    title: "La Interrupción Inoportuna",
    description: "Estás preparando medicación crítica y surge una interrupción. ¿Cómo gestionas la seguridad del paciente?",
    difficulty: "Fácil", // Fácil, Medio, Difícil
    icon: "fa-pills",
    
    // AQUÍ EMPIEZA TU HISTORIA (Igual que antes)
    steps: {
        start: {
            text: "Estás en el control de enfermería preparando la medicación de las 12:00 para la habitación 304 (Sr. García). Tienes la jeringa en la mano.",
            icon: "fa-user-nurse",
            health: 100,
            options: [
                { text: "Continuar preparando.", icon: "fa-eye", next: "interrupcion" }
            ]
        },
        interrupcion: {
            text: "Un familiar te toca el hombro: '¿Perdone, dónde está la máquina de café?'. Tienes la medicación a medio cargar.",
            icon: "fa-comments",
            health: 100,
            options: [
                { text: "Dejar la medicación en la mesa y acompañarle.", icon: "fa-person-walking-arrow-right", next: "error_mesa", risk: "high" },
                { text: "Responder sin soltar la jeringa.", icon: "fa-shield-halved", next: "buena_gestion", risk: "none" },
                { text: "Ignorarle.", icon: "fa-face-angry", next: "mala_comunicacion", risk: "medium" }
            ]
        },
        error_mesa: {
            text: "Vuelves y ves la jeringa en la mesa junto a una ampolla vacía de Adrenalina.",
            icon: "fa-triangle-exclamation",
            health: 60,
            options: [
                { text: "Asumir que es la correcta y administrar.", icon: "fa-syringe", next: "final_malo", risk: "critical" },
                { text: "Desechar y empezar de cero.", icon: "fa-trash-can", next: "final_salvado", risk: "none" }
            ]
        },
        buena_gestion: {
            text: "Le indicas la dirección sin soltar el vial. Etiquetas la jeringa inmediatamente.",
            icon: "fa-clipboard-check",
            health: 100,
            options: [
                { text: "Ir a la habitación.", icon: "fa-arrow-right", next: "habitacion" }
            ]
        },
        mala_comunicacion: {
            text: "El familiar se enfada. Te pones nervioso/a y te tiembla el pulso.",
            icon: "fa-bolt",
            health: 80,
            options: [
                { text: "Calmarte y revisar.", icon: "fa-magnifying-glass", next: "habitacion" }
            ]
        },
        habitacion: {
            text: "Habitación 304. Paciente dormido. ¿Qué haces?",
            icon: "fa-bed-pulse",
            health: 100,
            options: [
                { text: "Administrar rápido.", icon: "fa-gauge-high", next: "final_identificacion", risk: "high" },
                { text: "Comprobar pulsera.", icon: "fa-id-card", next: "final_bueno", risk: "none" }
            ]
        },
        // FINALES
        final_malo: { ending: "bad", text: "¡ERROR GRAVE! Posible administración de Adrenalina. Taquicardia severa.", reason: "Nunca administres algo que has perdido de vista." },
        final_identificacion: { ending: "bad", text: "¡PACIENTE INCORRECTO! Se habían cambiado de cama.", reason: "La identificación inequívoca es obligatoria." },
        final_salvado: { ending: "neutral", text: "Has perdido tiempo, pero has EVITADO un error. Bien hecho.", reason: "Ante la duda, desechar es lo seguro." },
        final_bueno: { ending: "good", text: "¡PERFECTO! Medicación y paciente correctos.", reason: "Has seguido los 5 correctos." }
    }
};