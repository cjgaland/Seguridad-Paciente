export const caso5 = {
    id: "c5",
    title: "La Orden Mortal",
    description: "Recibes una orden médica escrita que te parece extraña. Implica Cloruro Potásico (KCL).",
    difficulty: "Difícil",
    icon: "fa-skull-crossbones",
    
    steps: {
        start: {
            text: "Revisas el tratamiento del Sr. Gómez (hipopotasemia severa). La orden médica dice: '1 Ampolla de Cloruro Potásico (KCL) IV DIRECTO (Bolo)'.",
            icon: "fa-file-prescription",
            health: 100,
            options: [
                { text: "Cumplir la orden médica (es el médico quien sabe).", icon: "fa-check", next: "paro_cardiaco", risk: "critical" },
                { text: "Dudar y detener la administración.", icon: "fa-hand", next: "duda" }
            ]
        },
        paro_cardiaco: {
            text: "Administras el KCL en bolo. El paciente grita de dolor (quema) y entra inmediatamente en PARADA CARDÍACA en asistolia.",
            icon: "fa-heart-crack",
            health: 0,
            ending: "bad",
            reason: "EVENTO CENTINELA. El Potasio NUNCA se administra en bolo IV directo. Es letal. Siempre debe ir diluido y en bomba."
        },
        duda: {
            text: "Sabes que el KCL es peligroso. ¿Qué haces?",
            icon: "fa-question",
            health: 100,
            options: [
                { text: "Preguntar a un compañero veterano.", icon: "fa-user-nurse", next: "companero" },
                { text: "Llamar al médico para aclarar la orden.", icon: "fa-phone", next: "llamada" }
            ]
        },
        companero: {
            text: "Tu compañero te dice: '¡Estás loco! Eso mata al paciente. El médico se ha equivocado al escribirlo'.",
            icon: "fa-exclamation",
            health: 100,
            options: [
                { text: "No ponerlo y esperar a que venga el médico mañana.", icon: "fa-calendar-xmark", next: "omision", risk: "medium" },
                { text: "Llamar al médico de guardia para cambiar la orden ya.", icon: "fa-phone", next: "llamada" }
            ]
        },
        omision: {
            text: "No lo pones. El paciente sigue con hipopotasemia grave y sufre una arritmia durante la noche.",
            icon: "fa-wave-square",
            health: 50,
            ending: "neutral",
            reason: "Evitaste el error de medicación, pero dejaste al paciente sin tratamiento. Debes conseguir una orden correcta, no solo ignorar la mala."
        },
        llamada: {
            text: "Llamas al médico: 'Doctor, ha pautado KCL en bolo, ¿quiere decir diluido en 500ml?'. El médico se da cuenta: '¡Sí, perdón! Diluido, por favor'.",
            icon: "fa-user-doctor",
            health: 100,
            options: [
                { text: "Administrar diluido en bomba de infusión.", icon: "fa-gauge", next: "final_bueno" }
            ]
        },
        final_bueno: {
            ending: "good",
            text: "¡ERROR FATAL EVITADO!",
            reason: "Cuestionar una orden incorrecta es un deber de enfermería. El KCL es un medicamento de alto riesgo que requiere doble chequeo."
        }
    }
};