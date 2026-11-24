export const caso2 = {
    id: "c2",
    title: "La Escapada Nocturna",
    description: "Paciente de 82 años, desorientado, intenta bajarse de la cama a las 3:00 AM. ¿Sujeción o acompañamiento?",
    difficulty: "Medio",
    icon: "fa-person-falling",
    
    steps: {
        start: {
            text: "Son las 03:00 AM. Suena el timbre en la 304. Encuentras al Sr. Antonio (82 años, deterioro cognitivo leve) con una pierna por encima de la barandilla. Dice que 'tiene que ir a trabajar'.",
            icon: "fa-bed",
            health: 100,
            options: [
                { text: "Subirle las dos barandillas y decirle que duerma.", icon: "fa-lock", next: "barandillas", risk: "medium" },
                { text: "Preguntarle si necesita ir al baño o tiene dolor.", icon: "fa-ear-listen", next: "valoracion" }
            ]
        },
        barandillas: {
            text: "Subes las barandillas al máximo y te vas. A los 10 minutos oyes un golpe seco. Antonio ha intentado saltar por encima de la barandilla (efecto escalada) y ha caído.",
            icon: "fa-person-falling-burst",
            health: 0,
            ending: "bad",
            reason: "El uso indiscriminado de barandillas en pacientes agitados aumenta la altura de la caída (Efecto Paradójico). Hay que valorar la causa de la agitación."
        },
        valoracion: {
            text: "Le bajas la barandilla, le ayudas a sentarse y le preguntas. Te dice que tiene muchas ganas de orinar.",
            icon: "fa-toilet",
            health: 100,
            options: [
                { text: "Darle una botella/cuña en la cama.", icon: "fa-bottle-water", next: "botella" },
                { text: "Acompañarle al baño con seguridad.", icon: "fa-person-walking", next: "bano" }
            ]
        },
        botella: {
            text: "Se niega, se pone agresivo y grita que él no es un animal. Se agita más.",
            icon: "fa-face-angry",
            health: 80,
            options: [
                { text: "Llamar al médico para sedación.", icon: "fa-syringe", next: "sedacion", risk: "high" },
                { text: "Intentar reconducir y llevarle al baño.", icon: "fa-hands-holding", next: "bano" }
            ]
        },
        bano: {
            text: "Le acompañas al baño. Orina gran cantidad. Al volver a la cama está mucho más tranquilo y te da las gracias.",
            icon: "fa-face-smile-beam",
            health: 100,
            options: [
                { text: "Dejarle la luz de noche encendida y timbre a mano.", icon: "fa-lightbulb", next: "final_bueno" }
            ]
        },
        sedacion: {
            text: "Se le administra medicación. El paciente queda dormido, pero al día siguiente está obnubilado y broncoaspira en el desayuno.",
            icon: "fa-lungs-virus",
            health: 40,
            ending: "bad",
            reason: "La contención química debe ser la última opción. A menudo, la agitación se debe a necesidades básicas no cubiertas (dolor, orina, sed)."
        },
        final_bueno: {
            ending: "good",
            text: "¡CAÍDA EVITADA! Antonio duerme tranquilo.",
            reason: "Has atendido la causa raíz de la agitación (necesidad fisiológica) en lugar de simplemente contener al paciente."
        }
    }
};