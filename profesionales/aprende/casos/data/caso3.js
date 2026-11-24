export const caso3 = {
    id: "c3",
    title: "Código Sepsis: El Tiempo es Oro",
    description: "Paciente joven ingresada por pielonefritis. Empieza con tiritonas y mal estado general. Actúa rápido.",
    difficulty: "Difícil",
    icon: "fa-bacteria",
    
    steps: {
        start: {
            text: "Laura (35 años), ingresada por pielonefritis. En el turno de tarde la notas somnolienta. TA: 85/50, FC: 115 lpm, SatO2: 93%, Tª: 38.5ºC.",
            icon: "fa-heart-pulse",
            health: 70,
            options: [
                { text: "Ponerle un Paracetamol IV y reevaluar en 1h.", icon: "fa-pills", next: "retraso", risk: "critical" },
                { text: "Activar alerta, cursar Lactato y Hemocultivos.", icon: "fa-bell", next: "accion_rapida" }
            ]
        },
        retraso: {
            text: "1 hora después: Laura está inconsciente. TA: 70/40. Ha entrado en Shock Séptico. El retraso en el inicio de fluidos y antibióticos ha sido crítico.",
            icon: "fa-skull",
            health: 0,
            ending: "bad",
            reason: "¡ERROR CRÍTICO! La hipotensión + taquicardia + fiebre es Sepsis hasta que se demuestre lo contrario. No trates solo la fiebre, trata la infección."
        },
        accion_rapida: {
            text: "Avisas al médico de guardia por posible SEPSIS. Mientras llega, tienes una vía periférica.",
            icon: "fa-user-doctor",
            health: 90,
            options: [
                { text: "Esperar a que llegue el médico para poner nada.", icon: "fa-clock", next: "espera", risk: "high" },
                { text: "Iniciar sueroterapia intensiva y preparar kit de extracción.", icon: "fa-faucet-drip", next: "tratamiento" }
            ]
        },
        espera: {
            text: "El médico tarda 15 minutos. La tensión sigue bajando. Se ha perdido tiempo valioso de resucitación con fluidos.",
            icon: "fa-hourglass-half",
            health: 50,
            ending: "neutral",
            reason: "En sepsis e hipotensión, la carga de fluidos precoz es vital. No esperes si tienes protocolo delegado."
        },
        tratamiento: {
            text: "Sacas Hemocultivos (antes del antibiótico) y gasometría (Lactato). El médico llega y pauta antibiótico de amplio espectro. ¿Cuándo lo pones?",
            icon: "fa-vial",
            health: 100,
            options: [
                { text: "Inmediatamente (primera hora).", icon: "fa-bolt", next: "final_bueno" },
                { text: "Cuando termine el suero que está pasando.", icon: "fa-stopwatch", next: "final_regular" }
            ]
        },
        final_regular: {
            ending: "neutral",
            text: "Paciente estabilizada, pero el antibiótico se retrasó.",
            reason: "En sepsis grave, cada hora de retraso en el antibiótico aumenta la mortalidad un 7.6%."
        },
        final_bueno: {
            ending: "good",
            text: "¡VIDA SALVADA! Protocolo cumplido.",
            reason: "Has aplicado el 'Hour-1 Bundle': Lactato, Cultivos, Antibióticos y Fluidos en la primera hora."
        }
    }
};