export const CASOS_BUZON = [
    {
        id: "c1",
        titulo: "Suelo Mojado sin Avisar",
        descripcion: "Estás en la sala de espera de urgencias. Acaban de fregar el suelo pero no han puesto ninguna señal amarilla de 'Suelo Mojado'. Una señora mayor casi se resbala al pasar.",
        solucion: {
            tipo: "instalaciones",
            impacto: "riesgo",
            consejo: "¡Muy bien visto! Avisar de un riesgo antes de que alguien se caiga es la mejor forma de ayudar. Es un 'Cuasi-incidente'."
        }
    },
    {
        id: "c2",
        titulo: "Pastilla Desconocida",
        descripcion: "Estás ingresado. La enfermera te trae una pastilla azul, pero tú siempre tomas una blanca para la tensión. Se lo dices y ella comprueba que, efectivamente, había un error en la bandeja.",
        solucion: {
            tipo: "medicacion",
            impacto: "riesgo",
            consejo: "¡Excelente! Al hablar y preguntar, has evitado un error de medicación. Tu participación ha sido clave."
        }
    },
    {
        id: "c3",
        titulo: "Pulsera de Identificación",
        descripcion: "A tu padre lo van a llevar a rayos X. Te das cuenta de que la pulsera que lleva puesta tiene el nombre mal escrito (pone 'Antonio' en lugar de 'Antón').",
        solucion: {
            tipo: "identificacion",
            impacto: "riesgo",
            consejo: "La identificación correcta es fundamental. Avisar de ese error evita confusiones graves en pruebas o tratamientos."
        }
    },
    {
        id: "c4",
        titulo: "Alergia no Preguntada",
        descripcion: "El médico te receta un antibiótico nuevo. No te ha preguntado si eres alérgico, y tú sabes que la Penicilina te sienta mal. Se lo comentas antes de que imprima la receta.",
        solucion: {
            tipo: "comunicacion",
            impacto: "riesgo",
            consejo: "¡Perfecto! Recordar tus alergias es una barrera de seguridad vital. Nunca des por hecho que 'ya lo saben'."
        }
    },
    {
        id: "c5",
        titulo: "Barandilla Bajada",
        descripcion: "Tu familiar está sedado tras una operación. Alguien bajó la barandilla de la cama para asearlo y se les olvidó subirla. Avisas a la enfermera para que la suba.",
        solucion: {
            tipo: "caida",
            impacto: "riesgo",
            consejo: "Las barandillas son esenciales para evitar caídas en pacientes que no controlan bien. Has protegido a tu familiar."
        }
    },
    {
        id: "c6",
        titulo: "Bandeja de Comida Errónea",
        descripcion: "Traen la comida. Tu madre es diabética, pero ves que en la bandeja hay un sobre de azúcar y un zumo azucarado. Avisas antes de que empiece a comer.",
        solucion: {
            tipo: "identificacion", // O Cuidados/Alimentación
            impacto: "riesgo",
            consejo: "La dieta es parte del tratamiento. Detectar errores en la bandeja evita descompensaciones importantes."
        }
    },
    {
        id: "c7",
        titulo: "Higiene de Manos",
        descripcion: "Entra un profesional a curar una herida. Ves que se pone los guantes directamente sin haberse lavado las manos con el gel hidroalcohólico antes. Se lo recuerdas amablemente.",
        solucion: {
            tipo: "comunicacion", // O Cuidados
            impacto: "riesgo",
            consejo: "Los pacientes pueden recordar a los profesionales la higiene de manos ('¿Te has lavado?'). Es la medida más eficaz contra infecciones."
        }
    },
    {
        id: "c8",
        titulo: "Silla de Ruedas Rota",
        descripcion: "Te prestan una silla de ruedas para trasladar a tu abuelo al coche. Notas que el freno de la rueda derecha no funciona bien y la silla se mueve sola.",
        solucion: {
            tipo: "instalaciones", // Equipamiento
            impacto: "riesgo",
            consejo: "El material defectuoso debe retirarse. Al avisar, evitas que el siguiente usuario pueda tener un accidente."
        }
    },
    {
        id: "c9",
        titulo: "Informe de Alta Confuso",
        descripcion: "Os dan el alta. Al leer el informe en casa, no entendéis cuándo hay que dejar de tomar los pinchazos de heparina. No está claro.",
        solucion: {
            tipo: "comunicacion",
            impacto: "riesgo", // Riesgo de mal cumplimiento
            consejo: "La información al alta debe ser clara. Si no se entiende, hay riesgo de error en casa. Es importante preguntar."
        }
    },
    {
        id: "c10",
        titulo: "Caída en el Pasillo",
        descripcion: "Vas caminando por el pasillo y ves a un señor mayor tropezar con su propio gotero y caer al suelo. Se hace una brecha en la rodilla.",
        solucion: {
            tipo: "caida",
            impacto: "dano", // Aquí SÍ hubo daño
            consejo: "En este caso, el accidente ha ocurrido y hay una lesión. Es un incidente con daño que debe ser atendido y reportado."
        }
    }
];