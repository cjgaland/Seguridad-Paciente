/* Datos del buscador de protocolos y documentos.
   Los documentos son texto plano locales en assets/docs/ (ruta relativa a esta carpeta). */

const PROT_RUTA_DOCS = "../../../assets/docs/";

const PROT_ORGANISMOS = {
    JA:  { nombre: "Junta de Andalucía", corto: "JA" },
    MS:  { nombre: "Ministerio de Sanidad", corto: "MS" },
    OMS: { nombre: "Organización Mundial de la Salud", corto: "OMS" },
    OT:  { nombre: "Otros (documento de apoyo; contrastar con fuentes oficiales)", corto: "OT" }
};

const PROT_DOCS = [
    { file: "JA_estrategia_seguridad_paciente.txt", org: "JA",
      titulo: "Estrategia para la Seguridad del Paciente del SSPA",
      desc: "Plan estratégico de calidad del Sistema Sanitario Público de Andalucía (Consejería de Salud y Familias, 2019): líneas, objetivos y acciones de seguridad del paciente." },
    { file: "JA_notificasp_profesionales.txt", org: "JA",
      titulo: "notificASP: cómo hacer una notificación (profesionales)",
      desc: "Guía paso a paso del formulario de notificación de incidentes de seguridad para profesionales del SSPA (2023)." },
    { file: "JA_notificasp_ciudadania.txt", org: "JA",
      titulo: "notificASP: cómo hacer una notificación (ciudadanía)",
      desc: "Guía del formulario de notificación para la ciudadanía: qué datos se piden, anonimato y seguimiento con el código localizador." },
    { file: "JA_notificasp_como_gestionar_incidente.txt", org: "JA",
      titulo: "notificASP: cómo gestionar un incidente (gestores)",
      desc: "Procedimiento de los gestores para analizar, clasificar y cerrar un incidente notificado, incluidas las acciones de mejora." },
    { file: "JA_notificasp_funcionalidades_gestores.txt", org: "JA",
      titulo: "notificASP: funcionalidades generales para gestores",
      desc: "Descripción de las funciones del sistema de gestión de incidentes: incidentes, estadísticas, informes y usuarios." },
    { file: "JA_notificasp_faq.txt", org: "JA",
      titulo: "notificASP: preguntas frecuentes de gestores",
      desc: "Respuestas a dudas habituales sobre acceso, perfiles, mensajería y estados de un incidente en notificASP." },
    { file: "JA_recomendaciones_analisis_incidentes.txt", org: "JA",
      titulo: "Recomendaciones para el análisis de incidentes con daño (eventos adversos)",
      desc: "Cuestiones metodológicas y legales (Ministerio de Sanidad y SECA/FECA, 2021): análisis en profundidad, Protocolo de Londres, causa raíz y listado de verificación." },
    { file: "MS_estrategia_seguridad_2025_2035.txt", org: "MS",
      titulo: "Estrategia de Seguridad del Paciente del SNS 2025-2035",
      desc: "Marco nacional con siete líneas estratégicas: cultura de seguridad, prácticas seguras, notificación y aprendizaje, participación de pacientes, entre otras." },
    { file: "MS_informe_sinasp_notificaciones_2024.txt", org: "MS",
      titulo: "SiNASP: incidentes de seguridad notificados en 2024",
      desc: "Informe del Sistema de Notificación y Aprendizaje para la Seguridad del Paciente con el análisis de las notificaciones de 2024." },
    { file: "MS_experiencias_gestion_sistemas_notificacion_2025.txt", org: "MS",
      titulo: "Experiencias de éxito en la gestión de mejoras tras el análisis de incidentes (2025)",
      desc: "Recopilación de 29 experiencias de las comunidades autónomas sobre mejoras derivadas de las notificaciones y cómo incentivar notificar en Atención Primaria." },
    { file: "MS_estudio_incremento_conocimiento.txt", org: "MS",
      titulo: "Estudio sobre reforma legislativa en seguridad del paciente (2025)",
      desc: "Estudio encargado por el Ministerio de Sanidad sobre cómo abordar una reforma legal en seguridad del paciente y en los sistemas de notificación de eventos adversos." },
    { file: "MS_indicadores_higiene_manos_2024.txt", org: "MS",
      titulo: "Programa de Higiene de Manos del SNS: indicadores 2024",
      desc: "Indicadores para medir la higiene de manos en los centros sanitarios, con resultados y cuestionarios de autoevaluación." },
    { file: "MS_mejora_higiene_manos_centros_residenciales.txt", org: "MS",
      titulo: "Programa PRINCESS: higiene de manos en centros residenciales (2024)",
      desc: "Programa para mejorar la higiene de manos y prevenir infecciones en residencias de personas mayores." },
    { file: "MS_atencion_segura_recien_nacidos_ninos.txt", org: "MS",
      titulo: "Atención segura para todos los recién nacidos y todos los niños",
      desc: "Editorial de Anales de Pediatría sobre seguridad del paciente en la atención a recién nacidos y población infantil." },
    { file: "OMS_manual_tecnico.txt", org: "OMS",
      titulo: "Manual técnico de referencia para la higiene de las manos",
      desc: "Referencia de la OMS sobre los cinco momentos, técnica de fricción y lavado, uso de guantes e indicaciones de higiene de manos." },
    { file: "OMS_guia_aplicacion.txt", org: "OMS",
      titulo: "Guía de aplicación de la estrategia multimodal de la OMS para la higiene de manos",
      desc: "Guía (2009) para implantar el programa \"Save Lives: Clean Your Hands\" en un centro sanitario." },
    { file: "OMS_consideraciones_recursos_higiene_manos.txt", org: "OMS", idioma: "EN",
      titulo: "Consideraciones de recursos para invertir en higiene de manos (inglés)",
      desc: "Documento de la OMS (2021, en inglés) sobre los recursos necesarios y el retorno de invertir en mejorar la higiene de manos." },
    { file: "OMS_WHO_IPC_TOOL_2023_2_eng.txt", org: "OMS", idioma: "EN",
      titulo: "Herramienta de evaluación de requisitos mínimos de prevención y control de infecciones (inglés)",
      desc: "Herramienta de la OMS (2023, en inglés) para evaluar los requisitos mínimos de prevención y control de infecciones en atención primaria." },
    { file: "OT_higiene_manos.txt", org: "OT",
      titulo: "Guía técnica y estratégica para la higiene de manos",
      desc: "Documento de apoyo con indicaciones, técnicas, tiempos y barreras de la higiene de manos en la atención sanitaria." },
    { file: "OT_identificacion_paciente.txt", org: "OT",
      titulo: "Informe sobre identificación del paciente y seguridad",
      desc: "Documento de apoyo sobre identificadores, momentos críticos y tecnologías para identificar correctamente al paciente." },
    { file: "OT_uso_seguro_medicacion.txt", org: "OT",
      titulo: "Uso seguro de la medicación: estrategia andaluza y reto global de la OMS",
      desc: "Documento de apoyo sobre medicamentos de alto riesgo, polimedicación, transiciones asistenciales y pasos de administración segura." }
];

const PROT_FAQ_TEMAS = {
    manos: "Higiene de manos",
    notif: "Notificación (notificASP)",
    ident: "Identificación del paciente",
    medic: "Medicación"
};

const PROT_FAQ = [
    /* ---- Higiene de manos ---- */
    { tema: "manos", p: "¿Cuáles son los cinco momentos para la higiene de manos?",
      r: "1) Antes del contacto con el paciente; 2) antes de realizar una tarea limpia o aséptica; 3) después de la exposición a fluidos corporales; 4) después del contacto con el paciente; 5) después del contacto con el entorno del paciente.",
      fuente: "OMS, Manual técnico de referencia para la higiene de las manos", file: "OMS_manual_tecnico.txt" },
    { tema: "manos", p: "¿Cuándo hay que lavarse con agua y jabón y cuándo basta con la solución hidroalcohólica?",
      r: "El lavado con agua y jabón está indicado cuando las manos están visiblemente sucias o manchadas de sangre u otros fluidos corporales, cuando hay fuerte sospecha o evidencia de exposición a organismos formadores de esporas, y después de usar el baño. En el resto de situaciones, la fricción con preparado de base alcohólica es la opción habitual por su rapidez y accesibilidad en el punto de atención.",
      fuente: "OMS, Manual técnico de referencia para la higiene de las manos", file: "OMS_manual_tecnico.txt" },
    { tema: "manos", p: "¿Cuánto debe durar la higiene de manos?",
      r: "La fricción con solución hidroalcohólica requiere unos 20-30 segundos, hasta que las manos estén secas. El lavado con agua y jabón se describe habitualmente de 40 a 60 segundos.",
      fuente: "OMS, Manual técnico (20-30 s) y documento de apoyo OT_higiene_manos (40-60 s)", file: "OMS_manual_tecnico.txt" },
    { tema: "manos", p: "¿Los guantes sustituyen a la higiene de manos?",
      r: "No. El uso de guantes no modifica ni sustituye las indicaciones de higiene de manos: hay que realizarla igualmente cuando corresponda, por ejemplo después de quitarse los guantes.",
      fuente: "OMS, Manual técnico de referencia para la higiene de las manos", file: "OMS_manual_tecnico.txt" },

    /* ---- Notificación ---- */
    { tema: "notif", p: "¿Qué es notificASP y quién puede notificar?",
      r: "Es el sistema de notificación de incidentes de seguridad del paciente del Sistema Sanitario Público de Andalucía. Tiene un formulario para profesionales y otro para la ciudadanía.",
      fuente: "Junta de Andalucía, notificASP: guías de profesionales y de ciudadanía (2023)", file: "JA_notificasp_profesionales.txt" },
    { tema: "notif", p: "¿La notificación es anónima?",
      r: "Sí, tiene carácter anónimo. El correo de contacto es opcional y se borra automáticamente cuando se ha analizado el incidente. Por eso la descripción debe mantener la confidencialidad: no se deben incluir datos personales de pacientes ni de profesionales, ni imágenes que los identifiquen.",
      fuente: "Junta de Andalucía, notificASP: guía de ciudadanía y de profesionales", file: "JA_notificasp_ciudadania.txt" },
    { tema: "notif", p: "¿Se puede notificar un incidente que no llegó al paciente?",
      r: "Sí. El formulario pregunta si el incidente ha llegado al paciente y solo en ese caso se pide la gravedad del daño. Notificar lo que se detectó a tiempo permite aprender y corregir antes de que cause daño.",
      fuente: "Junta de Andalucía, notificASP: cómo hacer una notificación (profesionales)", file: "JA_notificasp_profesionales.txt" },
    { tema: "notif", p: "¿Qué debe contener la descripción del incidente?",
      r: "Qué ha pasado, cómo se produjo, cómo se descubrió y qué medidas se tomaron para reparar las consecuencias. Conviene notificar lo antes posible, porque con el tiempo se olvidan los detalles.",
      fuente: "Junta de Andalucía, notificASP: cómo hacer una notificación (profesionales)", file: "JA_notificasp_profesionales.txt" },
    { tema: "notif", p: "¿Cómo se hace el seguimiento de una notificación?",
      r: "Al iniciar el apartado \"Incidente\" se obtiene un código localizador. Hay que guardarlo: permite retomar una notificación interrumpida y hacer un seguimiento anónimo de su gestión.",
      fuente: "Junta de Andalucía, notificASP: guías de profesionales y de ciudadanía", file: "JA_notificasp_ciudadania.txt" },

    /* ---- Identificación ---- */
    { tema: "ident", p: "¿Qué es la identificación inequívoca del paciente y por qué importa?",
      r: "Es el proceso de relacionar correctamente a cada paciente con las intervenciones previstas y transmitir con fiabilidad su identidad durante toda la atención. Sus fallos pueden causar errores de diagnóstico, pruebas o intervenciones innecesarias o erróneas, o medicación a la persona equivocada.",
      fuente: "Ministerio de Sanidad, Estrategia de Seguridad del Paciente del SNS 2025-2035 (objetivo 2.5)", file: "MS_estrategia_seguridad_2025_2035.txt" },
    { tema: "ident", p: "¿Cuántos identificadores hay que usar y cuáles?",
      r: "Como mínimo dos identificadores inequívocos, por ejemplo nombre y apellidos completos, fecha de nacimiento o número de historia clínica. No se debe usar el número de habitación o de cama, porque no pertenece a la persona y puede cambiar.",
      fuente: "Documento de apoyo OT_identificacion_paciente", file: "OT_identificacion_paciente.txt" },
    { tema: "ident", p: "¿Cuándo hay que verificar la identidad?",
      r: "Antes de administrar medicamentos o sangre y hemoderivados, antes de extraer sangre u otras muestras, antes de cualquier tratamiento o procedimiento y al entregar dietas especiales. Debe hacerse en todos los ámbitos, incluidos ambulatorio, urgencias y quirófano.",
      fuente: "Documento de apoyo OT_identificacion_paciente", file: "OT_identificacion_paciente.txt" },

    /* ---- Medicación ---- */
    { tema: "medic", p: "¿Qué son los \"correctos\" de la administración de medicamentos?",
      r: "Es una lista de comprobación que se amplía a siete: medicamento correcto, paciente correcto, momento correcto, dosis correcta, vía correcta, información dada al paciente y registro de la administración.",
      fuente: "Documento de apoyo OT_uso_seguro_medicacion", file: "OT_uso_seguro_medicacion.txt" },
    { tema: "medic", p: "¿Qué es la conciliación de la medicación?",
      r: "Es la verificación rigurosa de la lista de medicamentos del paciente en cada punto de cambio asistencial (ingreso, traslado, alta), para detectar omisiones, duplicidades o discrepancias.",
      fuente: "Documento de apoyo OT_uso_seguro_medicacion", file: "OT_uso_seguro_medicacion.txt" },
    { tema: "medic", p: "¿Qué prioridades marca el reto mundial \"Medicación sin daño\"?",
      r: "La OMS lanzó en 2017 el tercer Reto Mundial de Seguridad del Paciente \"Medicación sin daño\". Las áreas prioritarias son los medicamentos de alto riesgo, la medicación segura en la polifarmacia y la seguridad en las transiciones asistenciales.",
      fuente: "Documento de apoyo OT_uso_seguro_medicacion (cita a la OMS)", file: "OT_uso_seguro_medicacion.txt" }
];
