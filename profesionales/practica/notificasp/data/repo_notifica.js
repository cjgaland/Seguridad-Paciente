// repo_notifica.js - 5 CASOS NUEVOS (sumando 10 en total)
export const CASOS_NOTIFICA = [
    // CASOS ORIGINALES (1-5)
    {
        id: "c1",
        titulo: "Error de Dispensación (Medicación)",
        descripcion: "Estás en planta. Detectas que el fármaco preparado no coincide con la hoja de tratamiento. Es un error de Farmacia. Es la tercera vez que ocurre esta semana con el mismo fármaco. Lo detectas antes de administrar.",
        solucion: {
            tipo: "medicacion",
            impacto: "cuasi",
            frecuencia: "frecuente",
            riesgo_calculado: "moderado",
            consejo: "Al ser un error frecuente, el riesgo sube a Moderado aunque no llegue al paciente. Urge revisar el proceso de Farmacia."
        }
    },
    {
        id: "c2", 
        titulo: "Caída con Herida",
        descripcion: "Paciente de 82 años se cae en el baño a las 03:00 AM. Sufre una herida en la ceja que requiere sutura. No es algo habitual en la unidad, ha sido un hecho puntual por agitación.",
        solucion: {
            tipo: "caida",
            impacto: "adverso",
            frecuencia: "ocasional", 
            riesgo_calculado: "moderado",
            consejo: "Hubo daño (Evento Adverso). Al ser ocasional, el riesgo es Moderado, pero requiere análisis del protocolo de caídas."
        }
    },
    {
        id: "c3",
        titulo: "Error de Identificación (Laboratorio)", 
        descripcion: "Se extrae sangre al paciente 'Juan' usando etiquetas de 'José'. El error se detecta en el laboratorio. Fue un fallo puntual por las prisas en un turno complicado.",
        solucion: {
            tipo: "identificacion",
            impacto: "leve",
            frecuencia: "ocasional",
            riesgo_calculado: "bajo",
            consejo: "Incidente leve y ocasional. Riesgo Bajo. Aun así, notificar ayuda a monitorizar la carga de trabajo."
        }
    },
    {
        id: "c4",
        titulo: "Fallo de Bomba (Obsoleta)",
        descripcion: "La bomba de infusión falla repetidamente durante la quimio causando retrasos. Es un modelo muy antiguo que falla en casi todos los turnos.",
        solucion: {
            tipo: "equipamiento", 
            impacto: "leve",
            frecuencia: "frecuente",
            riesgo_calculado: "moderado",
            consejo: "El daño es leve, pero la frecuencia es altísima. Eso eleva el riesgo y justifica pedir la sustitución del equipo."
        }
    },
    {
        id: "c5",
        titulo: "UPP Grado II no detectada",
        descripcion: "Paciente ingresa con 'Piel íntegra' según informe de urgencias, pero al llegar a planta detectas una úlcera sacra Grado II. Pasa ocasionalmente cuando urgencias está colapsado.",
        solucion: {
            tipo: "cuidados",
            impacto: "adverso",
            frecuencia: "ocasional",
            riesgo_calculado: "moderado", 
            consejo: "Fallo de continuidad de cuidados. La UPP es un Evento Adverso. Requiere mejorar la comunicación en traslados."
        }
    },

    // NUEVOS CASOS (6-10) - VARIEDAD DE ESCENARIOS
    {
        id: "c6",
        titulo: "Retraso Diagnóstico por Error en Pruebas",
        descripcion: "Una TAC abdominal se informa como 'normal' pero 48h después se detecta un apéndice inflamado que no se mencionó. El paciente desarrolla peritonitis. El radiólogo era novel y trabajaba con sobrecarga.",
        solucion: {
            tipo: "pruebas",
            impacto: "adverso",
            frecuencia: "rara",
            riesgo_calculado: "alto",
            consejo: "Evento Adverso con daño grave. Aunque es raro, la gravedad eleva el riesgo a Alto. Necesita revisión por segundo radiólogo en casos dudosos."
        }
    },
    {
        id: "c7", 
        titulo: "Quemadura por Sonda Nasogástrica",
        descripcion: "Al conectar la nutrición enteral, el calentador de la sonda falla y quema la mucosa nasal del paciente. Es la segunda vez este mes que falla este equipo específico.",
        solucion: {
            tipo: "equipamiento",
            impacto: "adverso", 
            frecuencia: "frecuente",
            riesgo_calculado: "alto",
            consejo: "Daño físico + frecuencia alta = Riesgo Alto. Retirar inmediatamente el equipo y notificar al servicio de mantenimiento."
        }
    },
    {
        id: "c8",
        titulo: "Confusión en Procedimiento Quirúrgico",
        descripcion: "En el quirófano, el instrumental para una colecistectomía se prepara junto al de una apendicectomía programada después. Se detecta antes de la incisión. Ocurre aproximadamente una vez al mes.",
        solucion: {
            tipo: "identificacion",
            impacto: "cuasi",
            frecuencia: "frecuente", 
            riesgo_calculado: "moderado",
            consejo: "Cuasi-incidente pero muy frecuente en quirófano. Riesgo Moderado que justifica revisar los flujos de preparación de salas."
        }
    },
    {
        id: "c9",
        titulo: "Alergia no Comunicada en Traspaso",
        descripcion: "Paciente alérgico a penicilina recibe Augmentine porque la alergia no se transmitió en el traspaso de UCI a planta. Reacción cutánea leve. Es el tercer caso similar este trimestre.",
        solucion: {
            tipo: "comunicacion",
            impacto: "leve",
            frecuencia: "ocasional",
            riesgo_calculado: "moderado",
            consejo: "Fallo de comunicación en traspaso. Aunque el daño fue leve, la frecuencia indica problemas sistémicos en el proceso."
        }
    },
    {
        id: "c10",
        titulo: "Error en Administración de Quimioterapia",
        descripcion: "Se programa incorrectamente la dosis de un quimioterápico en el software (120mg en lugar de 12mg). Se detecta en la doble verificación de enfermería. Primer error de este tipo en 2 años.",
        solucion: {
            tipo: "medicacion",
            impacto: "cuasi",
            frecuencia: "rara",
            riesgo_calculado: "alto",
            consejo: "Aunque es raro y no llegó al paciente, al ser medicación de alto riesgo el potencial de daño es máximo. Riesgo Alto que requiere revisión del software."
        }
    },
    {
        id: "c11",
        titulo: "Error de Lateralidad en Cirugía Ortopédica",
        descripcion: "En el quirófano, se prepara al paciente para una artroscopia de rodilla derecha. El equipo quirúrgico inicia la intervención sin verificar la marcación prequirúrgica. A los 10 minutos de comenzar, el cirujano se da cuenta de que están operando la rodilla IZQUIERDA. Se para la intervención inmediatamente. Ocurrió hace 2 años en este hospital y se implementó el protocolo de marcación, pero en los últimos 6 meses se han relajado las verificaciones.",
        solucion: {
            tipo: "quirurgico",
            impacto: "centinela",
            frecuencia: "rara",
            riesgo_calculado: "critico",
            consejo: "EVENTO CENTINELA. Error de lateralidad que llegó al paciente. Aunque es raro, la gravedad es máxima. Reactivar inmediatamente el protocolo de verificación quirúrgica y lista de verificación WHO."
        }
    },
    {
        id: "c12",
        titulo: "Consentimiento Informado no Cumplimentado",
        descripcion: "Paciente programado para colonoscopia con posible polipectomía. Firma el consentimiento para 'colonoscopia diagnóstica' pero no se le informa ni firma el apartado de polipectomía. Durante la prueba, se encuentran pólipos y se extirpan. El paciente presenta sangrado posterior y reclama porque no autorizó el procedimiento terapéutico. Sucede aproximadamente 2-3 veces al mes en endoscopias.",
        solucion: {
            tipo: "cuidados",
            impacto: "adverso",
            frecuencia: "frecuente",
            riesgo_calculado: "alto",
            consejo: "Falta de consentimiento informado específico para procedimiento terapéutico. Alta frecuencia + daño clínico + implicaciones legales = Riesgo Alto. Unificar consentimientos y verificar antes de cualquier actuación beyond diagnóstico."
        }
    }
      
];