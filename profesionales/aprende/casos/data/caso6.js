// caso6.js - LAS TRES VÍCTIMAS
export const caso6 = {
    id: "c6", 
    title: "El Error y Sus Consecuencias",
    description: "Gestiona un evento adverso considerando paciente, profesional y organización",
    difficulty: "Difícil",
    icon: "fa-people-group",
    
    steps: {
        start: {
            text: "Tu compañera Ana, con 15 años de experiencia, administró por error una dosis triple de heparina. El paciente desarrolló un hematoma masivo pero se estabilizó. Ana está devastada.",
            icon: "fa-syringe",
            health: 60,
            options: [
                { 
                    text: "'Fue un error humano, todos cometemos errores'", 
                    icon: "fa-handshake", 
                    next: "enfoque_superficial", 
                    risk: "high" 
                },
                { 
                    text: "Analizar qué falló en el sistema y apoyar a Ana", 
                    icon: "fa-magnifying-glass", 
                    next: "analisis_profundo" 
                }
            ]
        },
        enfoque_superficial: {
            text: "Minimizas el incidente. Ana se siente culpable y aislada. Solicita traslado a otra unidad. El equipo pierde confianza.",
            icon: "fa-user-xmark",
            health: 30,
            ending: "bad",
            reason: "PRIMERA VÍCTIMA: Paciente con daño evitable. SEGUNDA VÍCTIMA: Profesional abandonada. TERCERA VÍCTIMA: Organización que pierde talento y confianza."
        },
        analisis_profundo: {
            text: "Reúnes al equipo. Descubren: jeringas similares, falta de doble verificación, sobrecarga de trabajo. Ana recibe apoyo psicológico.",
            icon: "fa-people-arrows",
            health: 75,
            options: [
                { 
                    text: "Implementar cambios y comunicarse con el paciente", 
                    icon: "fa-shield-heart", 
                    next: "recuperacion_completa" 
                },
                { 
                    text: "Solo documentar el incidente sin cambios", 
                    icon: "fa-clipboard", 
                    next: "cambios_superficiales",
                    risk: "medium" 
                }
            ]
        },
        cambios_superficiales: {
            text: "El paciente presenta queja. La organización enfrenta consecuencias legales. Ana abandona la profesión.",
            icon: "fa-scale-unbalanced",
            health: 40,
            ending: "bad", 
            reason: "Sin cambios sistémicos, el ciclo se repite. La cultura de culpa persigue a los profesionales en lugar de proteger a los pacientes."
        },
        recuperacion_completa: {
            text: "Implementan protocolos robustos. El paciente recibe disculpas sinceras. Ana se convierte en instructora de seguridad. La organización aprende y mejora.",
            icon: "fa-arrows-spin",
            health: 95,
            ending: "good",
            reason: "TRES VÍCTIMAS ATENDIDAS: 1) Paciente con daño reparado, 2) Profesional apoyada y resiliente, 3) Organización que aprende y se fortalece."
        }
    }
};