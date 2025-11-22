export const caso4 = {
    id: "c4",
    title: "El Teléfono Roto",
    description: "Cambio de turno en una planta muy saturada. Tienes prisa por irte. ¿Qué información transmites?",
    difficulty: "Medio",
    icon: "fa-comments",
    
    steps: {
        start: {
            text: "Acaba tu turno. Tienes prisa. Le pasas el parte a tu compañero sobre el paciente nuevo de la 201 (Ingreso por Neumonía).",
            icon: "fa-clipboard-user",
            health: 100,
            options: [
                { text: "'Todo bien, estable. Pendiente de analítica mañana'.", icon: "fa-thumbs-up", next: "info_incompleta", risk: "high" },
                { text: "Usar método ISBAR (Identificación, Situación, Antecedentes...)", icon: "fa-list-check", next: "isbar" }
            ]
        },
        info_incompleta: {
            text: "Tu compañero se fía. A la media hora, el paciente tiene dolor y el médico pauta Nolotil (Metamizol).",
            icon: "fa-pills",
            health: 80,
            options: [
                { text: "Tu compañero lo administra sin mirar más.", icon: "fa-syringe", next: "reaccion", risk: "critical" },
                { text: "Tu compañero revisa la historia antes.", icon: "fa-laptop-medical", next: "salvado_por_pelos" }
            ]
        },
        reaccion: {
            text: "¡SHOCK ANAFILÁCTICO! El paciente era alérgico al Metamizol. Tú lo sabías, pero se te olvidó decirlo en el cambio de turno rápido.",
            icon: "fa-face-dizzy",
            health: 0,
            ending: "bad",
            reason: "La información de seguridad (Alergias) debe ser lo primero en comunicarse. 'Todo bien' no es un pase de turno válido."
        },
        isbar: {
            text: "Sigues el orden: 'Paciente Juan Pérez... Neumonía... ALÉRGICO AL METAMIZOL... Se queda estable'.",
            icon: "fa-check-double",
            health: 100,
            options: [
                { text: "Irte a casa tranquilo.", icon: "fa-house", next: "final_bueno" }
            ]
        },
        salvado_por_pelos: {
            ending: "neutral",
            text: "Tu compañero detectó la alergia en el ordenador. El paciente está bien, pero tu compañero está enfadado contigo.",
            reason: "La seguridad no puede depender solo de que el otro revise. La comunicación verbal debe ser precisa."
        },
        final_bueno: {
            ending: "good",
            text: "¡TRANSFERENCIA PERFECTA!",
            reason: "El uso de métodos estructurados (SBAR/ISBAR) reduce drásticamente los errores por olvido en los cambios de turno."
        }
    }
};