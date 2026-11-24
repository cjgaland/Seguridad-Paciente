// ======================================================
//   BANCO DE PREGUNTAS - TEST DE SEGURIDAD DEL PACIENTE
//   Basado en la Estrategia de Seguridad del Paciente
//   Fuentes: OMS, Estrategia SNS, Seguridad del Paciente Andalucía
// ======================================================

export const bancoPreguntas = [
    // --- NIVEL BÁSICO ---
    {
        id: 1,
        nivel: "nivel1",
        pregunta: "¿Cuál es el momento clave para la identificación inequívoca del paciente?",
        opciones: [
            "Solo al ingreso en administración.",
            "Antes de cualquier procedimiento de riesgo, administración de medicación o extracción.",
            "Cuando el paciente no puede hablar.",
            "Al darle el alta hospitalaria."
        ],
        correcta: 1,
        explicacion: "La identificación activa es obligatoria antes de administrar medicación, sangre, extraer muestras o realizar cualquier procedimiento invasivo."
    },
    {
        id: 2,
        nivel: "nivel1",
        pregunta: "En la higiene de manos, ¿qué momento es fundamental ANTES de tocar al paciente?",
        opciones: [
            "Después de quitarse los guantes.",
            "Antes del contacto con el paciente.",
            "Después del contacto con el entorno.",
            "Solo si las manos están visiblemente sucias."
        ],
        correcta: 1,
        explicacion: "Los 5 momentos de la OMS incluyen 'Antes del contacto con el paciente' para protegerlo de gérmenes nocivos que llevamos en las manos."
    },
    {
        id: 3,
        nivel: "nivel1",
        pregunta: "¿Qué significan las siglas RAM?",
        opciones: [
            "Reacción Adversa a Medicamentos.",
            "Registro de Alta Médica.",
            "Revisión Anual de Medicación.",
            "Resucitación Avanzada Manual."
        ],
        correcta: 0,
        explicacion: "Una RAM es cualquier respuesta a un medicamento que sea nociva y no intencionada."
    },
    {
        id: 4,
        nivel: "nivel1",
        pregunta: "¿Cuál es el método más efectivo para prevenir infecciones relacionadas con la asistencia sanitaria?",
        opciones: [
            "Uso de mascarillas en todo momento.",
            "Higiene de manos adecuada.",
            "Limpieza terminal de habitaciones.",
            "Uso de guantes estériles."
        ],
        correcta: 1,
        explicacion: "La higiene de manos es la medida individual más importante para prevenir la transmisión de infecciones."
    },
    {
        id: 5,
        nivel: "nivel1",
        pregunta: "¿Qué información debe verificarse al identificar a un paciente?",
        opciones: [
            "Solo el nombre.",
            "Nombre y fecha de nacimiento.",
            "Nombre y número de habitación.",
            "Solo el número de historia clínica."
        ],
        correcta: 1,
        explicacion: "Se deben verificar al menos dos identificadores: nombre completo y fecha de nacimiento."
    },
    {
        id: 6,
        nivel: "nivel1",
        pregunta: "¿Cuál es el objetivo principal de la lista de verificación quirúrgica?",
        opciones: [
            "Documentar el tiempo quirúrgico.",
            "Prevenir errores en el sitio, procedimiento y paciente.",
            "Controlar el inventario de instrumental.",
            "Registrar los participantes en la cirugía."
        ],
        correcta: 1,
        explicacion: "La lista de verificación quirúrgica busca garantizar la seguridad en tres momentos críticos: antes de la inducción anestésica, antes de la incisión y antes de que el paciente salga del quirófano."
    },
    {
        id: 7,
        nivel: "nivel1",
        pregunta: "¿Qué escala se utiliza comúnmente para valorar el riesgo de caídas?",
        opciones: [
            "Escala de Morse.",
            "Escala de Glasgow.",
            "Escala de Braden.",
            "Escala de Norton."
        ],
        correcta: 0,
        explicacion: "La escala de Morse valora específicamente el riesgo de caídas mediante seis ítems que evalúan historia de caídas, diagnósticos secundarios, ayuda para deambular, terapia intravenosa, marcha y estado mental."
    },
    {
        id: 8,
        nivel: "nivel1",
        pregunta: "¿Cuándo se debe realizar la higiene de manos con solución alcohólica?",
        opciones: [
            "Solo cuando las manos están visiblemente sucias.",
            "Cuando no hay disponible agua y jabón.",
            "En la mayoría de situaciones de atención clínica.",
            "Solo en procedimientos estériles."
        ],
        correcta: 2,
        explicacion: "La solución alcohólica es el método de elección para la higiene de manos en la mayoría de situaciones clínicas, excepto cuando las manos están visiblemente sucias o hay exposición a esporas."
    },
    {
        id: 9,
        nivel: "nivel1",
        pregunta: "¿Qué es un evento centinela?",
        opciones: [
            "Cualquier incidente en la atención sanitaria.",
            "Un evento inesperado que causa muerte o daño grave.",
            "Un error de medicación sin consecuencias.",
            "Una queja del paciente."
        ],
        correcta: 1,
        explicacion: "Evento centinela es aquel incidente inesperado que causa muerte o daño físico o psicológico grave, y que no está relacionado con la evolución natural de la enfermedad."
    },
    {
        id: 10,
        nivel: "nivel1",
        pregunta: "¿Qué medida es fundamental para prevenir úlceras por presión?",
        opciones: [
            "Cambios posturales frecuentes.",
            "Uso de cremas hidratantes.",
            "Alimentación rica en proteínas.",
            "Masajes en zonas de presión."
        ],
        correcta: 0,
        explicacion: "Los cambios posturales frecuentes (cada 2-3 horas) son la medida más efectiva para prevenir úlceras por presión al redistribuir las presiones."
    },
    {
        id: 11,
        nivel: "nivel1",
        pregunta: "¿Qué información debe contener una prescripción médica segura?",
        opciones: [
            "Solo el nombre del medicamento.",
            "Medicamento, dosis, vía y frecuencia.",
            "Medicamento y firma del médico.",
            "Solo el diagnóstico del paciente."
        ],
        correcta: 1,
        explicacion: "Una prescripción segura debe incluir claramente: medicamento, dosis, vía de administración, frecuencia y duración del tratamiento."
    },
    {
        id: 12,
        nivel: "nivel1",
        pregunta: "¿Cuál es el tiempo mínimo recomendado para la fricción con solución alcohólica?",
        opciones: [
            "5-10 segundos.",
            "20-30 segundos.",
            "45-60 segundos.",
            "2 minutos."
        ],
        correcta: 1,
        explicacion: "El tiempo recomendado para la fricción con solución alcohólica es de 20-30 segundos hasta que las manos estén secas."
    },
    {
        id: 13,
        nivel: "nivel1",
        pregunta: "¿Qué significa la sigla SBAR?",
        opciones: [
            "Situación, Base, Análisis, Resultado.",
            "Situación, Antecedentes, Evaluación, Recomendación.",
            "Síntomas, Biopsia, Análisis, Respuesta.",
            "Signos, Bases, Aplicación, Revisión."
        ],
        correcta: 1,
        explicacion: "SBAR es una herramienta de comunicación estructurada que significa: Situación, Antecedentes, Evaluación, Recomendación."
    },
    {
        id: 14,
        nivel: "nivel1",
        pregunta: "¿Cuándo se debe notificar un incidente de seguridad?",
        opciones: [
            "Solo cuando causa daño al paciente.",
            "Inmediatamente después de detectarlo.",
            "Al finalizar la jornada laboral.",
            "Solo si el paciente se queja."
        ],
        correcta: 1,
        explicacion: "Los incidentes de seguridad deben notificarse inmediatamente después de su detección para permitir una respuesta rápida y el aprendizaje del sistema."
    },
    {
        id: 15,
        nivel: "nivel1",
        pregunta: "¿Qué es la cultura de seguridad?",
        opciones: [
            "Sistema de castigos por errores.",
            "Conjunto de valores y creencias sobre la seguridad.",
            "Protocolos de limpieza del hospital.",
            "Normativa sobre equipos de protección."
        ],
        correcta: 1,
        explicacion: "La cultura de seguridad es el conjunto de valores, actitudes, percepciones, competencias y patrones de comportamiento que determinan el compromiso con la gestión de la seguridad."
    },
    {
        id: 16,
        nivel: "nivel1",
        pregunta: "¿Qué debe hacerse antes de administrar un medicamento de alto riesgo?",
        opciones: [
            "Verificar solo la dosis.",
            "Doble verificación independiente.",
            "Administrar rápidamente.",
            "Consultar con farmacia después."
        ],
        correcta: 1,
        explicacion: "Los medicamentos de alto riesgo requieren doble verificación independiente por dos profesionales cualificados antes de su administración."
    },
    {
        id: 17,
        nivel: "nivel1",
        pregunta: "¿Cuál es el objetivo de la conciliación de la medicación?",
        opciones: [
            "Reducir costes de medicación.",
            "Evitar discrepancias en la transición asistencial.",
            "Unificar criterios de prescripción.",
            "Controlar el almacén de medicamentos."
        ],
        correcta: 1,
        explicacion: "La conciliación de la medicación busca identificar y resolver discrepancias en los tratamientos durante las transiciones asistenciales."
    },
    {
        id: 18,
        nivel: "nivel1",
        pregunta: "¿Qué medida previene errores en la administración de medicamentos?",
        opciones: [
            "Leer la etiqueta una vez.",
            "Administrar sin interrupciones.",
            "Verificar las 5 correctas.",
            "Memorizar las dosis habituales."
        ],
        correcta: 2,
        explicacion: "Las 5 correctas son: paciente correcto, medicamento correcto, dosis correcta, vía correcta y hora correcta."
    },
    {
        id: 19,
        nivel: "nivel1",
        pregunta: "¿Cuándo se debe usar guantes?",
        opciones: [
            "Siempre que se entre en una habitación.",
            "Cuando hay posibilidad de contacto con fluidos corporales.",
            "Solo en procedimientos quirúrgicos.",
            "Cuando el paciente lo solicite."
        ],
        correcta: 1,
        explicacion: "Los guantes deben usarse cuando existe posibilidad de contacto con sangre, fluidos corporales, membranas mucosas o piel no intacta."
    },
    {
        id: 20,
        nivel: "nivel1",
        pregunta: "¿Qué es un near miss o incidente sin daño?",
        opciones: [
            "Error que no llega al paciente.",
            "Evento con daño leve.",
            "Queja del paciente resuelta.",
            "Error en documentación."
        ],
        correcta: 0,
        explicacion: "Near miss es un incidente que no llega al paciente, siendo detectado y corregido antes de la administración o realización del procedimiento."
    },
    {
        id: 21,
        nivel: "nivel1",
        pregunta: "¿Qué debe hacerse si se comete un error en la documentación?",
        opciones: [
            "Tacharlo con una línea y firmar.",
            "User corrector líquido.",
            "Rasgar la hoja.",
            "Ignorarlo y continuar."
        ],
        correcta: 0,
        explicacion: "Los errores en documentación deben corregirse tachando con una línea simple, anotando la corrección, fechando y firmando."
    },
    {
        id: 22,
        nivel: "nivel1",
        pregunta: "¿Cuál es el propósito de los procedimientos normalizados de trabajo?",
        opciones: [
            "Aumentar la burocracia.",
            "Estandarizar prácticas seguras.",
            "Disminuir la autonomía profesional.",
            "Controlar el tiempo de trabajo."
        ],
        correcta: 1,
        explicacion: "Los procedimientos normalizados buscan estandarizar prácticas basadas en evidencia para reducir la variabilidad y mejorar la seguridad."
    },
    {
        id: 23,
        nivel: "nivel1",
        pregunta: "¿Qué factor humano contribuye frecuentemente a los errores?",
        opciones: [
            "Exceso de comunicación.",
            "Fatiga y sobrecarga de trabajo.",
            "Demasiada formación.",
            "Exceso de personal."
        ],
        correcta: 1,
        explicacion: "La fatiga, sobrecarga de trabajo y estrés son factores humanos que aumentan significativamente el riesgo de error."
    },
    {
        id: 24,
        nivel: "nivel1",
        pregunta: "¿Qué es la seguridad del paciente?",
        opciones: [
            "Ausencia de errores.",
            "Eliminación de riesgo cero.",
            "Reducción del riesgo de daño innecesario.",
            "Perfección en la atención."
        ],
        correcta: 2,
        explicacion: "La seguridad del paciente es la reducción del riesgo de daño innecesario asociado a la atención sanitaria hasta un mínimo aceptable."
    },
    {
        id: 25,
        nivel: "nivel1",
        pregunta: "¿Cuándo se debe realizar educación al paciente sobre su medicación?",
        opciones: [
            "Solo al alta.",
            "Durante toda la estancia.",
            "Cuando el paciente pregunte.",
            "Solo si tiene estudios."
        ],
        correcta: 1,
        explicacion: "La educación al paciente sobre su medicación debe ser continua durante toda la estancia, adaptándose a sus necesidades y capacidades."
    },
    {
        id: 26,
        nivel: "nivel1",
        pregunta: "¿Qué debe verificarse antes de una transfusión sanguínea?",
        opciones: [
            "Solo el grupo sanguíneo.",
            "Dos identificadores del paciente y la bolsa.",
            "Solo la fecha de caducidad.",
            "La presión arterial del paciente."
        ],
        correcta: 1,
        explicacion: "Antes de transfundir, deben verificarse dos identificadores del paciente y todos los datos de la bolsa con la prescripción y compatibilidad."
    },
    {
        id: 27,
        nivel: "nivel1",
        pregunta: "¿Qué es un indicador de seguridad?",
        opciones: [
            "Herramienta para medir resultados.",
            "Lista de tareas pendientes.",
            "Formulario de quejas.",
            "Registro de incidencias."
        ],
        correcta: 0,
        explicacion: "Los indicadores de seguridad son herramientas de medida que permiten evaluar y monitorizar aspectos relevantes de la seguridad del paciente."
    },
    {
        id: 28,
        nivel: "nivel1",
        pregunta: "¿Cuál es la actitud correcta ante un error?",
        opciones: [
            "Ocultarlo para evitar problemas.",
            "Aceptarlo y aprender del mismo.",
            "Culpar a otros profesionales.",
            "Minimizar su importancia."
        ],
        correcta: 1,
        explicacion: "La cultura de seguridad promove la notificación y análisis de errores para aprender del sistema y prevenir su repetición."
    },
    {
        id: 29,
        nivel: "nivel1",
        pregunta: "¿Qué mejora la comunicación entre profesionales?",
        opciones: [
            "Uso de abreviaturas.",
            "Comunicación verbal informal.",
            "Herramientas estructuradas como SBAR.",
            "Mensajes de texto."
        ],
        correcta: 2,
        explicacion: "Las herramientas de comunicación estructurada como SBAR mejoran la claridad, completitud y efectividad en la transferencia de información."
    },
    {
        id: 30,
        nivel: "nivel1",
        pregunta: "¿Por qué es importante la participación del paciente en su seguridad?",
        opciones: [
            "Para reducir costes.",
            "Porque conoce mejor su enfermedad.",
            "Es un requerimiento legal.",
            "Para evitar demandas."
        ],
        correcta: 1,
        explicacion: "El paciente es el que mejor conoce su situación y puede detectar discrepancias, siendo un aliado fundamental en su propia seguridad."

    },

    // --- NIVEL AVANZADO ---
    {
        id: 31,
        nivel: "nivel2",
        pregunta: "En una bacteriemia cero, ¿cuál NO es una medida del paquete (bundle)?",
        opciones: [
            "Higiene de manos adecuada.",
            "Uso de clorhexidina alcohólica > 0.5% en la preparación de la piel.",
            "Cambio rutinario de catéter cada 48 horas.",
            "Retirada innecesaria de vías venosas."
        ],
        correcta: 2,
        explicacion: "No se recomienda el recambio rutinario de catéteres venosos centrales si funcionan bien y no hay signos de infección."
    },
    {
        id: 32,
        nivel: "nivel2",
        pregunta: "¿Qué herramienta se recomienda para el traspaso de información (handover) efectivo?",
        opciones: [
            "Método SBAR (SAER).",
            "Escala de Glasgow.",
            "Test de Norton.",
            "Protocolo de Montreal."
        ],
        correcta: 0,
        explicacion: "SBAR (Situación, Antecedentes, Evaluación, Recomendación) estructura la comunicación crítica entre profesionales."
    },
    {
        id: 33,
        nivel: "nivel2",
        pregunta: "Respecto a los medicamentos de alto riesgo (MAR), ¿cuál es una práctica segura prioritaria?",
        opciones: [
            "Almacenarlos alfabéticamente junto al resto.",
            "La doble comprobación independiente durante la preparación y administración.",
            "Memorizar las dosis para ir más rápido.",
            "Usar abreviaturas en la prescripción."
        ],
        correcta: 1,
        explicacion: "La doble comprobación independiente es el 'gold standard' para evitar errores fatales con medicamentos de alto riesgo."
    },
    {
        id: 34,
        nivel: "nivel2",
        pregunta: "¿Qué estrategia reduce las infecciones del tracto urinario asociadas a sonda vesical?",
        opciones: [
            "Sondaje sistemático de todos los ingresados.",
            "Uso profiláctico de antibióticos.",
            "Inserción y mantenimiento aséptico.",
            "Cambio rutinario cada 7 días."
        ],
        correcta: 2,
        explicacion: "La inserción aséptica y el mantenimiento adecuado son clave para prevenir infecciones del tracto urinario asociadas a sonda vesical."
    },
    {
        id: 35,
        nivel: "nivel2",
        pregunta: "En el sistema de codificación de pacientes, ¿qué color se asocia comúnmente al riesgo de alergias?",
        opciones: [
            "Rojo.",
            "Amarillo.",
            "Verde.",
            "Azul."
        ],
        correcta: 0,
        explicacion: "El código rojo en los sistemas de identificación de pacientes suele indicar alerta de alergias graves."
    },
    {
        id: 36,
        nivel: "nivel2",
        pregunta: "¿Qué principio sigue la gestión de riesgos proactiva?",
        opciones: [
            "Esperar a que ocurran incidentes.",
            "Identificar y prevenir riesgos antes de que ocurran.",
            "Actuar solo ante quejas de pacientes.",
            "Documentar únicamente eventos con daño."
        ],
        correcta: 1,
        explicacion: "La gestión proactiva de riesgos busca identificar y controlar los riesgos potenciales antes de que se materialicen en incidentes."
    },
    {
        id: 37,
        nivel: "nivel2",
        pregunta: "¿Cuál es el objetivo del análisis de causa raíz?",
        opciones: [
            "Encontrar un culpable.",
            "Identificar factores sistémicos subyacentes.",
            "Justificar el incidente.",
            "Reducir la documentación."
        ],
        correcta: 1,
        explicacion: "El análisis de causa raíz busca identificar los factores sistémicos y organizativos que contribuyeron al incidente, no individualizar culpables."
    },
    {
        id: 38,
        nivel: "nivel2",
        pregunta: "¿Qué caracteriza a una organización de alta confiabilidad?",
        opciones: [
            "Tolerancia cero al error.",
            "Preocupación por las fallas.",
            "Jerarquías rígidas.",
            "Resistencia al cambio."
        ],
        correcta: 1,
        explicacion: "Las organizaciones de alta confiabilidad mantienen una preocupación constante por la posibilidad de fallas, incluso cuando las cosas van bien."
    },
    {
        id: 39,
        nivel: "nivel2",
        pregunta: "¿Qué método se utiliza para la evaluación de riesgos de manera sistemática?",
        opciones: [
            "Método FIFO.",
            "Análisis modal de fallos y efectos (AMFE).",
            "Técnica Pomodoro.",
            "Diagrama de Gantt."
        ],
        correcta: 1,
        explicacion: "El AMFE es una técnica proactiva que identifica y prioriza modos potenciales de fallo en procesos antes de que ocurran."
    },
    {
        id: 40,
        nivel: "nivel2",
        pregunta: "¿Qué es la resistencia a los antimicrobianos?",
        opciones: [
            "Capacidad de microorganismos para neutralizar antibióticos.",
            "Reacción alérgica a antibióticos.",
            "Intolerancia gastrointestinal a antimicrobianos.",
            "Falta de adherencia al tratamiento."
        ],
        correcta: 0,
        explicacion: "La resistencia antimicrobiana ocurre cuando microorganismos desarrollan mecanismos para sobrevivir a los antimicrobianos que antes eran efectivos."
    },
    {
        id: 41,
        nivel: "nivel2",
        pregunta: "¿Qué medida reduce errores en la administración de quimioterápicos?",
        opciones: [
            "Prescripción verbal.",
            "Uso de protocolos estandarizados y verificación.",
            "Administración rápida.",
            "Dilución aleatoria."
        ],
        correcta: 1,
        explicacion: "Los protocolos estandarizados y sistemas de verificación múltiple son esenciales para la seguridad en la administración de quimioterápicos."
    },
    {
        id: 42,
        nivel: "nivel2",
        pregunta: "¿Qué es la farmacovigilancia?",
        opciones: [
            "Control de almacén de medicamentos.",
            "Detección y evaluación de RAM.",
            "Dispensación de medicamentos.",
            "Prescripción médica."
        ],
        correcta: 1,
        explicacion: "La farmacovigilancia es la ciencia relacionada con la detección, evaluación, comprensión y prevención de efectos adversos de medicamentos."
    },
    {
        id: 43,
        nivel: "nivel2",
        pregunta: "¿Cuál es el principio del diseño resiliente de sistemas?",
        opciones: [
            "Eliminar al factor humano.",
            "Anticipar y adaptarse a variaciones.",
            "Aumentar la burocracia.",
            "Reducir costes a toda costa."
        ],
        correcta: 1,
        explicacion: "El diseño resiliente busca crear sistemas que puedan anticipar, monitorizar, responder y aprender de las variaciones en las condiciones de trabajo."
    },
    {
        id: 44,
        nivel: "nivel2",
        pregunta: "¿Qué estrategia reduce eventos por anticoagulantes?",
        opciones: [
            "Uso de dosis fijas para todos.",
            "Monitorización periódica y educación.",
            "Suspensión sistemática antes de procedimientos.",
            "Administración sin controles."
        ],
        correcta: 1,
        explicacion: "La monitorización regular del INR y la educación al paciente son estrategias clave para la seguridad con anticoagulantes."
    },
    {
        id: 45,
        nivel: "nivel2",
        pregunta: "¿Qué es el principio de precaución en seguridad del paciente?",
        opciones: [
            "Actuar cuando hay evidencia absoluta.",
            "Tomar medidas ante posibles riesgos graves.",
            "Esperar a que ocurra el daño.",
            "Solo intervenir si el paciente lo solicita."
        ],
        correcta: 1,
        explicacion: "El principio de precaución justifica la adopción de medidas protectoras ante riesgos potenciales graves, incluso con incertidumbre científica."
    },
    {
        id: 46,
        nivel: "nivel2",
        pregunta: "¿Qué mejora la seguridad en cirugía?",
        opciones: [
            "Comunicación jerárquica estricta.",
            "Briefing y debriefing quirúrgico.",
            "Rapidez en los procedimientos.",
            "Minimizar la documentación."
        ],
        correcta: 1,
        explicacion: "El briefing previo y debriefing posterior permiten la comunicación del equipo, planificación y aprendizaje continuo."
    },
    {
        id: 47,
        nivel: "nivel2",
        pregunta: "¿Qué es la teoría de sistemas en seguridad del paciente?",
        opciones: [
            "Culpar a individuos por errores.",
            "Enfocarse en fallos del sistema.",
            "Ignorar factores organizativos.",
            "Buscar responsables directos."
        ],
        correcta: 1,
        explicacion: "La teoría de sistemas entiende que los errores son consecuencia de fallos del sistema más que de individuos aislados."
    },
    {
        id: 48,
        nivel: "nivel2",
        pregunta: "¿Qué reduce eventos de violencia en urgencias?",
        opciones: [
            "Ignorar comportamientos agresivos.",
            "Entrenamiento en desescalada.",
            "Aumentar tiempos de espera.",
            "Reducir la iluminación."
        ],
        correcta: 1,
        explicacion: "El entrenamiento en técnicas de desescalada verbal y no verbal es efectivo para prevenir y manejar situaciones de violencia."
    },
    {
        id: 49,
        nivel: "nivel2",
        pregunta: "¿Qué es la seguridad en el diseño de tecnología sanitaria?",
        opciones: [
            "Usar equipos más caros.",
            "Incorporar principios de usabilidad.",
            "Comprar tecnología puntera.",
            "Minimizar formación en equipos."
        ],
        correcta: 1,
        explicacion: "La seguridad en el diseño incluye principios de usabilidad, estandarización y mitigación de errores en la interfaz humano-máquina."
    },
    {
        id: 50,
        nivel: "nivel2",
        pregunta: "¿Qué mide el índice de seguridad hospitalaria?",
        opciones: [
            "Solo tasas de infección.",
            "Múltiples dimensiones de seguridad.",
            "Satisfacción del personal.",
            "Costes por paciente."
        ],
        correcta: 1,
        explicacion: "El índice de seguridad hospitalaria evalúa múltiples dimensiones mediante indicadores estructurales, de proceso y resultado."
    },
    {
        id: 51,
        nivel: "nivel2",
        pregunta: "¿Qué es la ergonomía cognitiva?",
        opciones: [
            "Diseño de muebles ergonómicos.",
            "Adaptación del trabajo a capacidades mentales.",
            "Ejercicios de memoria para profesionales.",
            "Software de recordatorios."
        ],
        correcta: 1,
        explicacion: "La ergonomía cognitiva se enfoca en cómo los sistemas de trabajo se adaptan a las capacidades y limitaciones del procesamiento mental humano."
    },
    {
        id: 52,
        nivel: "nivel2",
        pregunta: "¿Qué principio sigue la justicia culture en seguridad?",
        opciones: [
            "Culpar a los profesionales.",
            "Distinguir entre comportamiento humano y negligencia.",
            "Aplicar sanciones automáticas.",
            "Ignorar errores sin daño."
        ],
        correcta: 1,
        explicacion: "La just culture distingue entre comportamiento humano (errores), comportamientos de riesgo y actos negligentes, con respuestas diferenciadas."
    },
    {
        id: 53,
        nivel: "nivel2",
        pregunta: "¿Qué mejora la seguridad en terapia intravenosa?",
        opciones: [
            "Uso de catéteres de mayor calibre.",
            "Protocolos de mantenimiento de vías.",
            "Cambios frecuentes de sitio.",
            "Uso único de venas periféricas."
        ],
        correcta: 1,
        explicacion: "Los protocolos estandarizados de inserción y mantenimiento reducen complicaciones en terapia intravenosa."
    },
    {
        id: 54,
        nivel: "nivel2",
        pregunta: "¿Qué es el principio de transparencia en seguridad?",
        opciones: [
            "Ocultar información al paciente.",
            "Comunicación abierta sobre incidentes.",
            "Documentación mínima necesaria.",
            "Informar solo a superiores."
        ],
        correcta: 1,
        explicacion: "La transparencia implica comunicación abierta y honesta con pacientes y familias cuando ocurren incidentes con daño."
    },
    {
        id: 55,
        nivel: "nivel2",
        pregunta: "¿Qué estrategia reduce errores de diagnóstico?",
        opciones: [
            "Confianza absoluta en pruebas complementarias.",
            "Revisión diagnóstica sistemática.",
            "Rapidez en la toma de decisiones.",
            "Minimizar la anamnesis."
        ],
        correcta: 1,
        explicacion: "La revisión diagnóstica sistemática y el pensamiento crítico reducen errores cognitivos en el proceso diagnóstico."
    },
    {
        id: 56,
        nivel: "nivel2",
        pregunta: "¿Qué es la seguridad del paciente en atención primaria?",
        opciones: [
            "Solo evitar errores de medicación.",
            "Gestión de riesgos en entorno comunitario.",
            "Control de infecciones en centros de salud.",
            "Formación exclusiva de médicos."
        ],
        correcta: 1,
        explicacion: "La seguridad en atención primaria implica gestión específica de riesgos en el ámbito comunitario y continuidad asistencial."
    },
    {
        id: 57,
        nivel: "nivel2",
        pregunta: "¿Qué mejora la seguridad en telemedicina?",
        opciones: [
            "Minimizar la documentación.",
            "Protocolos para identificación y comunicación.",
            "Uso exclusivo de audio.",
            "Evitar la participación del paciente."
        ],
        correcta: 1,
        explicacion: "Protocolos robustos para identificación, comunicación clara y documentación son esenciales en telemedicina."
    },
    {
        id: 58,
        nivel: "nivel2",
        pregunta: "¿Qué es el liderazgo en seguridad del paciente?",
        opciones: [
            "Gestión administrativa.",
            "Compromiso visible y asignación de recursos.",
            "Control de personal.",
            "Redacción de protocolos."
        ],
        correcta: 1,
        explicacion: "El liderazgo en seguridad implica compromiso visible, asignación de recursos y creación de cultura de seguridad desde la dirección."
    },
    {
        id: 59,
        nivel: "nivel2",
        pregunta: "¿Qué reduce eventos en unidades de críticos?",
        opciones: [
            "Minimizar alarmas.",
            "Gestión proactiva de alarmas y handoffs.",
            "Reducir monitorización.",
            "Trabajo individual sin equipo."
        ],
        correcta: 1,
        explicacion: "La gestión proactiva de alarmas y procesos de handoff estructurados son críticos en entornos de alta complejidad."
    },
    {
        id: 60,
        nivel: "nivel2",
        pregunta: "¿Qué es el aprendizaje organizacional en seguridad?",
        opciones: [
            "Formación individual puntual.",
            "Sistema que incorpora lecciones de incidentes.",
            "Cursos anuales obligatorios.",
            "Lectura de protocolos."
        ],
        correcta: 1,
        explicacion: "El aprendizaje organizacional implica sistemas que capturan, analizan y difunden lecciones aprendidas de incidentes para mejorar procesos."
    }
];