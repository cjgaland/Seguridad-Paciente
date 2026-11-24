// ======================================================
//   BANCO DE PALABRAS - ANAGRAMAS
//   Se clasifican automáticamente por su longitud.
// ======================================================

export const bancoPalabras = [
    // --- PALABRAS CORTAS (< 6 letras) ---
    {
        palabra: "DOSIS",
        pista: "Cantidad exacta de medicamento.",
        explicacion: "La dosis correcta es uno de los 5 correctos básicos en la administración de medicación."
    },
    {
        palabra: "BATA",
        pista: "Prenda de protección básica.",
        explicacion: "El uso de bata es fundamental en las precauciones de contacto y aislamiento."
    },
    {
        palabra: "MANOS",
        pista: "Principal vehículo de transmisión de infecciones.",
        explicacion: "La higiene de manos es la medida más barata y eficaz para prevenir infecciones nosocomiales."
    },
    {
        palabra: "ERROR",
        pista: "Fallo no intencionado.",
        explicacion: "Errar es humano. Lo importante en seguridad del paciente es notificarlo para aprender y evitar que se repita."
    },
    {
        palabra: "CALMA",
        pista: "Actitud necesaria en una urgencia.",
        explicacion: "Mantener la calma permite pensar con claridad y seguir los protocolos de seguridad."
    },
    {
        palabra: "VIA",
        pista: "Ruta de administración de medicamentos.",
        explicacion: "La vía correcta (oral, intravenosa, intramuscular) es crucial para la efectividad y seguridad del tratamiento."
    },
    {
        palabra: "ALTA",
        pista: "Documento al finalizar la hospitalización.",
        explicacion: "El informe de alta debe incluir conciliación de medicación y recomendaciones para continuar el tratamiento en domicilio."
    },
    {
        palabra: "SEDA",
        pista: "Estado del paciente durante procedimientos.",
        explicacion: "La sedación consciente requiere monitorización continua para prevenir complicaciones respiratorias."
    },
    {
        palabra: "DOLOR",
        pista: "Quinto signo vital.",
        explicacion: "La valoración y tratamiento del dolor es un derecho del paciente y un indicador de calidad asistencial."
    },
    {
        palabra: "RISCO",
        pista: "Posibilidad de daño.",
        explicacion: "La evaluación de riesgos permite implementar medidas preventivas antes de que ocurran incidentes."
    },
    {
        palabra: "GLUCOSA",
        pista: "Nivel de azúcar en sangre.",
        explicacion: "El control de la glucemia previene complicaciones en pacientes diabéticos y críticos."
    },
    {
        palabra: "SALUD",
        pista: "Estado de bienestar físico y mental.",
        explicacion: "La seguridad del paciente contribuye directamente a la mejora de los resultados en salud."
    },
    {
        palabra: "ETICA",
        pista: "Principios morales profesionales.",
        explicacion: "La ética en la atención sanitaria incluye confidencialidad, consentimiento y no maleficencia."
    },
    {
        palabra: "CUIDA",
        pista: "Acción fundamental de enfermería.",
        explicacion: "El cuidado seguro incluye prevención de úlceras, movilizaciones y atención integral."
    },
    {
        palabra: "PACTO",
        pista: "Acuerdo entre profesional y paciente.",
        explicacion: "El pacto terapéutico mejora la adherencia al tratamiento y la seguridad."
    },
    {
        palabra: "LEGAL",
        pista: "Marco normativo de la práctica.",
        explicacion: "La documentación clínica adecuada proporciona seguridad jurídica a profesionales y pacientes."
    },
    {
        palabra: "HORA",
        pista: "Momento de administración de medicación.",
        explicacion: "Respetar los horarios de medicación mantiene niveles terapéuticos adecuados."
    },
    {
        palabra: "SIGLA",
        pista: "Abreviaturas en documentación clínica.",
        explicacion: "Evitar siglas ambiguas previene errores de interpretación en prescripciones."
    },
    {
        palabra: "TACTO",
        pista: "Sentido usado en exploración física.",
        explicacion: "La técnica adecuada de palpación proporciona información clínica valiosa."
    },
    {
        palabra: "PESO",
        pista: "Parámetro para calcular dosis.",
        explicacion: "El peso actualizado es esencial para calcular correctamente dosis de medicamentos."
    },
    {
        palabra: "EDAD",
        pista: "Factor en ajuste de medicación.",
        explicacion: "La edad influye en el metabolismo y eliminación de fármacos, requiriendo ajustes posológicos."
    },
    {
        palabra: "RIÑON",
        pista: "Órgano de eliminación de fármacos.",
        explicacion: "La función renal debe monitorizarse para ajustar dosis de medicamentos nefrotóxicos."
    },
    {
        palabra: "RUTA",
        pista: "Camino de administración.",
        explicacion: "La ruta de administración afecta la biodisponibilidad y velocidad de acción de los medicamentos."
    },
    {
        palabra: "TOS",
        pista: "Síntoma respiratorio.",
        explicacion: "La tos puede ser efecto adverso de algunos medicamentos como IECA."
    },
    {
        palabra: "SANGRE",
        pista: "Fluido corporal frecuentemente muestreado.",
        explicacion: "Las extracciones de sangre requieren identificación correcta del paciente y de los tubos."
    },
    {
        palabra: "SUEÑO",
        pista: "Necesidad básica del paciente.",
        explicacion: "La privación de sueño en hospitalización afecta la recuperación y puede causar confusión."
    },
    {
        palabra: "RASGO",
        pista: "Característica individual del paciente.",
        explicacion: "Los rasgos personales y culturales influyen en la adherencia al tratamiento."
    },
    {
        palabra: "TUBO",
        pista: "Elemento de drenajes y conexiones.",
        explicacion: "Los tubos y conexiones deben estar correctamente identificados para prevenir errores."
    },
    {
        palabra: "CAMA",
        pista: "Lugar donde el paciente pasa más tiempo.",
        explicacion: "La cama hospitalaria debe mantenerse en posición baja para prevenir caídas."
    },
    {
        palabra: "LUZ",
        pista: "Iluminación del entorno asistencial.",
        explicacion: "Una iluminación adecuada previene errores en la administración de medicación y procedimientos."
    },
    {
        palabra: "SALA",
        pista: "Espacio de atención grupal.",
        explicacion: "La distribución de salas debe permitir la privacidad y observación adecuada de los pacientes."
    },
    {
        palabra: "PASEO",
        pista: "Actividad física beneficiosa.",
        explicacion: "La deambulación precoz previene complicaciones como trombosis y úlceras por presión."
    },
    {
        palabra: "RUIDO",
        pista: "Contaminación acústica en hospitales.",
        explicacion: "El exceso de ruido afecta el descanso del paciente y aumenta el estrés del personal."
    },
    {
        palabra: "TEXTO",
        pista: "Contenido de protocolos y guías.",
        explicacion: "La documentación escrita debe ser clara, actualizada y accesible para todos los profesionales."
    },
    {
        palabra: "CICLO",
        pista: "Proceso continuo de mejora.",
        explicacion: "El ciclo de mejora continua (PDCA) aplicado a la seguridad del paciente."
    },
    {
        palabra: "VIGOR",
        pista: "Estado de alerta y energía.",
        explicacion: "El vigor del profesional influye en la calidad de la atención y prevención de errores."
    },
    {
        palabra: "GRADO",
        pista: "Nivel de severidad o intensidad.",
        explicacion: "La gradación de síntomas y riesgos permite priorizar intervenciones."
    },
    {
        palabra: "PAUSA",
        pista: "Momento de reflexión antes de actuar.",
        explicacion: "La pausa de seguridad previene errores en procedimientos de alto riesgo."
    },
    {
        palabra: "TALLA",
        pista: "Parámetro antropométrico.",
        explicacion: "La talla se usa junto con el peso para calcular superficie corporal en quimioterapia."
    },
    {
        palabra: "PULSO",
        pista: "Signo vital fundamental.",
        explicacion: "El control del pulso detecta arritmias y valora efectividad de tratamientos."
    },
    {
        palabra: "TENSIÓN",
        pista: "Presión arterial del paciente.",
        explicacion: "El control de la tensión arterial previene complicaciones cardiovasculares."
    },
    {
        palabra: "SIGNO",
        pista: "Manifestación objetiva de enfermedad.",
        explicacion: "Los signos clínicos guían el diagnóstico y tratamiento del paciente."
    },
    {
        palabra: "DATOS",
        pista: "Información del paciente.",
        explicacion: "La protección de datos personales es un derecho fundamental del paciente."
    },
    {
        palabra: "TEMA",
        pista: "Asunto de interés en seguridad.",
        explicacion: "La educación del paciente sobre temas de seguridad mejora su participación."
    },
    {
        palabra: "ROL",
        pista: "Función de cada profesional.",
        explicacion: "La delimitación clara de roles previene duplicidades y omisiones en la atención."
    },
    {
        palabra: "RED",
        pista: "Sistema de apoyo y recursos.",
        explicacion: "Las redes de seguridad incluyen protocolos, alertas y sistemas de backup."
    },
    {
        palabra: "META",
        pista: "Objetivo a alcanzar.",
        explicacion: "Las metas de seguridad internacionales buscan reducir daños evitables."
    },
    {
        palabra: "TIPO",
        pista: "Clasificación de pacientes o procedimientos.",
        explicacion: "La tipificación permite estandarizar procesos y reducir variabilidad."
    },
    {
        palabra: "ZONA",
        pista: "Área delimitada en el hospital.",
        explicacion: "Las zonas de limpieza y suciedad deben estar claramente separadas."
    },

    // --- PALABRAS LARGAS (>= 6 letras) ---
    {
        palabra: "ALERGIA",
        pista: "Reacción adversa inmunitaria.",
        explicacion: "Siempre debemos verificar las alergias (pulsera roja o registro) antes de prescribir o administrar."
    },
    {
        palabra: "PULSERA",
        pista: "Elemento de identificación física.",
        explicacion: "La pulsera identificativa debe colocarse al ingreso y verificarse antes de cualquier actuación."
    },
    {
        palabra: "CULTURA",
        pista: "Conjunto de valores de la organización.",
        explicacion: "Una cultura de seguridad positiva fomenta la transparencia y el aprendizaje frente a la culpa."
    },
    {
        palabra: "BARANDILLA",
        pista: "Evita caídas en la cama.",
        explicacion: "Las barandillas deben estar subidas en pacientes con riesgo de caída o bajo efectos de sedación."
    },
    {
        palabra: "REGISTRO",
        pista: "Lo que no está escrito, no existe.",
        explicacion: "Un registro clínico adecuado garantiza la continuidad asistencial y la seguridad jurídica."
    },
    {
        palabra: "TRIAGE",
        pista: "Clasificación según gravedad.",
        explicacion: "El triage asegura que los pacientes más graves sean atendidos primero, reduciendo el riesgo clínico."
    },
    {
        palabra: "PACIENTE",
        pista: "Centro de la atención sanitaria.",
        explicacion: "El paciente debe participar activamente en su seguridad mediante la verificación y el cuestionamiento."
    },
    {
        palabra: "MEDICINA",
        pista: "Ciencia de la curación.",
        explicacion: "La medicina basada en evidencia es fundamental para decisiones clínicas seguras."
    },
    {
        palabra: "ENFERMERA",
        pista: "Profesional clave en seguridad.",
        explicacion: "La enfermera actúa como última barrera en la prevención de errores de medicación."
    },
    {
        palabra: "HOSPITAL",
        pista: "Entorno de atención compleja.",
        explicacion: "El diseño del hospital influye en la seguridad mediante flujos, iluminación y señalización."
    },
    {
        palabra: "PROTOCOLO",
        pista: "Guía de actuación estandarizada.",
        explicacion: "Los protocolos reducen la variabilidad en la práctica y aumentan la seguridad."
    },
    {
        palabra: "VIGILANCIA",
        pista: "Monitorización continua.",
        explicacion: "La vigilancia activa detecta precozmente complicaciones y eventos adversos."
    },
    {
        palabra: "PREVENCIÓN",
        pista: "Acción para evitar daños.",
        explicacion: "La prevención primaria es más efectiva que la corrección de incidentes."
    },
    {
        palabra: "MEDICAMENTO",
        pista: "Sustancia terapéutica.",
        explicacion: "Los medicamentos son la principal causa de eventos adversos prevenibles."
    },
    {
        palabra: "IDENTIFICACIÓN",
        pista: "Proceso de reconocimiento del paciente.",
        explicacion: "La identificación incorrecta es una de las causas más frecuentes de eventos adversos."
    },
    {
        palabra: "COMUNICACIÓN",
        pista: "Intercambio de información.",
        explicacion: "La comunicación efectiva entre profesionales previene errores por malentendidos."
    },
    {
        palabra: "CONSENTIMIENTO",
        pista: "Autorización informada.",
        explicacion: "El consentimiento informado garantiza que el paciente comprende riesgos y beneficios."
    },
    {
        palabra: "HIGIENE",
        pista: "Limpieza y aseo.",
        explicacion: "La higiene ambiental y personal reduce la transmisión de infecciones."
    },
    {
        palabra: "INFORMACIÓN",
        pista: "Datos relevantes del paciente.",
        explicacion: "La información completa y actualizada es esencial para la toma de decisiones seguras."
    },
    {
        palabra: "SEGURIDAD",
        pista: "Objetivo principal.",
        explicacion: "La seguridad del paciente es un principio fundamental de la calidad asistencial."
    },
    {
        palabra: "INFECCIÓN",
        pista: "Proceso patológico por microorganismos.",
        explicacion: "Las infecciones asociadas a la asistencia sanitaria son eventos adversos frecuentes y prevenibles."
    },
    {
        palabra: "PROCEDIMIENTO",
        pista: "Actuación técnica.",
        explicacion: "Los procedimientos deben seguir listas de verificación para garantizar su seguridad."
    },
    {
        palabra: "EVALUACIÓN",
        pista: "Valoración sistemática.",
        explicacion: "La evaluación continua del paciente detecta cambios que requieren intervención."
    },
    {
        palabra: "TRATAMIENTO",
        pista: "Conjunto de terapias.",
        explicacion: "El tratamiento debe individualizarse según características y comorbilidades del paciente."
    },
    {
        palabra: "PRESCRIPCIÓN",
        pista: "Indicación terapéutica.",
        explicacion: "La prescripción electrónica reduce errores de legibilidad y omisión."
    },
    {
        palabra: "CONCILIACIÓN",
        pista: "Armonización de tratamientos.",
        explicacion: "La conciliación de medicación evita duplicidades y omisiones en transiciones asistenciales."
    },
    {
        palabra: "MONITORIZACIÓN",
        pista: "Seguimiento continuo.",
        explicacion: "La monitorización de signos vitales permite detectar precozmente deterioros clínicos."
    },
    {
        palabra: "DOCUMENTACIÓN",
        pista: "Registro escrito.",
        explicacion: "La documentación clínica completa y precisa es esencial para la continuidad asistencial."
    },
    {
        palabra: "FORMACIÓN",
        pista: "Educación continua.",
        explicacion: "La formación en seguridad del paciente debe ser continua y basada en simulaciones."
    },
    {
        palabra: "LIDERAZGO",
        pista: "Dirección comprometida.",
        explicacion: "El liderazgo en seguridad establece prioridades y asigna recursos para la prevención."
    },
    {
        palabra: "EQUILIBRIO",
        pista: "Estabilidad postural.",
        explicacion: "El equilibrio del paciente influye en el riesgo de caídas y debe valorarse sistemáticamente."
    },
    {
        palabra: "ATENCIÓN",
        pista: "Cuidado profesional.",
        explicacion: "La atención centrada en el paciente mejora la seguridad y la experiencia del mismo."
    },
    {
        palabra: "HERRAMIENTA",
        pista: "Instrumento de trabajo.",
        explicacion: "Las herramientas de seguridad (SBAR, listas de verificación) estandarizan procesos críticos."
    },
    {
        palabra: "RECURSO",
        pista: "Medio disponible.",
        explicacion: "La adecuación de recursos humanos y materiales es esencial para la seguridad."
    },
    {
        palabra: "ESTRATEGIA",
        pista: "Plan de acción.",
        explicacion: "Las estrategias de seguridad deben ser integrales y abordar factores humanos y sistémicos."
    },
    {
        palabra: "CAPACITACIÓN",
        pista: "Preparación profesional.",
        explicacion: "La capacitación continua mantiene las competencias necesarias para la práctica segura."
    },
    {
        palabra: "ORGANIZACIÓN",
        pista: "Estructura sanitaria.",
        explicacion: "La organización debe facilitar flujos de trabajo seguros y comunicación efectiva."
    },
    {
        palabra: "VERIFICACIÓN",
        pista: "Confirmación de datos.",
        explicacion: "La verificación sistemática previene errores en identificación y administración."
    },
    {
        palabra: "OBSERVACIÓN",
        pista: "Examen atento.",
        explicacion: "La observación continua detecta cambios sutiles en el estado del paciente."
    },
    {
        palabra: "COORDINACIÓN",
        pista: "Trabajo conjunto.",
        explicacion: "La coordinación entre niveles asistenciales evita lagunas en la atención."
    },
    {
        palabra: "INTERVENCIÓN",
        pista: "Actuación terapéutica.",
        explicacion: "Toda intervención debe balancear beneficios esperados y riesgos potenciales."
    },
    {
        palabra: "PROTECCIÓN",
        pista: "Medidas de resguardo.",
        explicacion: "La protección del paciente incluye aspectos físicos, psicológicos y de privacidad."
    },
    {
        palabra: "GARANTÍA",
        pista: "Aseguramiento de calidad.",
        explicacion: "Las garantías de seguridad deben integrarse en todos los procesos asistenciales."
    },
    {
        palabra: "SUPERVISIÓN",
        pista: "Control profesional.",
        explicacion: "La supervisión de profesionales en formación previene errores por inexperiencia."
    },
    {
        palabra: "ACTITUD",
        pista: "Disposición mental.",
        explicacion: "La actitud proactiva hacia la seguridad previene eventos adversos."
    },
    {
        palabra: "CONOCIMIENTO",
        pista: "Saber profesional.",
        explicacion: "El conocimiento actualizado es fundamental para la toma de decisiones seguras."
    },
    {
        palabra: "RESPONSABILIDAD",
        pista: "Obligación ética.",
        explicacion: "La responsabilidad compartida fortalece la cultura de seguridad."
    },
    {
        palabra: "EFICACIA",
        pista: "Capacidad de lograr objetivos.",
        explicacion: "La eficacia de las intervenciones debe evaluarse continuamente."
    },
    {
        palabra: "CONTROL",
        pista: "Dominio de situaciones.",
        explicacion: "El control de procesos reduce la variabilidad y aumenta la seguridad."
    },
    {
        palabra: "ANALISIS",
        pista: "Estudio detallado.",
        explicacion: "El análisis de incidentes identifica causas profundas para prevención."
    },
    {
        palabra: "MEJORA",
        pista: "Progreso continuo.",
        explicacion: "La mejora continua es un principio fundamental en seguridad del paciente."
    },
    {
        palabra: "CONFIANZA",
        pista: "Seguridad en relaciones.",
        explicacion: "La confianza entre equipo y paciente facilita la comunicación abierta sobre seguridad."
    },
    {
        palabra: "COMPROMISO",
        pista: "Obligación contraída.",
        explicacion: "El compromiso organizacional con la seguridad se demuestra con recursos y priorización."
    },
    {
        palabra: "EXPERIENCIA",
        pista: "Vivencia del paciente.",
        explicacion: "La experiencia del paciente proporciona información valiosa para mejorar la seguridad."
    },
    {
        palabra: "INNOVACIÓN",
        pista: "Introducción de novedades.",
        explicacion: "La innovación tecnológica puede mejorar la seguridad pero requiere evaluación."
    },
    {
        palabra: "STANDARD",
        pista: "Norma o patrón.",
        explicacion: "Los estándares de práctica basados en evidencia aumentan la seguridad."
    },
    {
        palabra: "CALIDAD",
        pista: "Excelencia en la atención.",
        explicacion: "La calidad y la seguridad son dos caras de la misma moneda en atención sanitaria."
    }
];