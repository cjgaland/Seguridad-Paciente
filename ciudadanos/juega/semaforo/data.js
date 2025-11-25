export const CASOS = [
    // --- ROJO: EMERGENCIAS VITALES (112 / URGENCIAS HOSPITAL) ---
    {
        id: 1,
        texto: "ADULTO: Dolor opresivo en el centro del pecho que irradia al brazo izquierdo, con sudor frío y náuseas.",
        respuesta: "rojo",
        explicacion: "¡Correcto! Son síntomas clásicos de infarto. Es una emergencia tiempo-dependiente. Llama al 112."
    },
    {
        id: 2,
        texto: "ADULTO: Dificultad repentina para hablar, boca torcida y pérdida de fuerza en un brazo.",
        respuesta: "rojo",
        explicacion: "¡Muy bien! Son signos de Ictus (Código Ictus). Cada minuto cuenta para salvar el cerebro. Llama al 112."
    },
    {
        id: 3,
        texto: "NIÑO (2 años): Dificultad grave para respirar, se le marcan las costillas al respirar y tiene los labios azulados.",
        respuesta: "rojo",
        explicacion: "¡Urgencia Vital! La dificultad respiratoria grave con cianosis (color azul) requiere atención inmediata hospitalaria."
    },
    {
        id: 4,
        texto: "ANCIANO: Caída en el baño. Está inconsciente y no responde a estímulos.",
        respuesta: "rojo",
        explicacion: "La inconsciencia siempre es una emergencia roja. Hay que asegurar la zona y llamar al 112."
    },
    {
        id: 5,
        texto: "CUALQUIERA: Reacción alérgica súbita tras comer marisco. Se le hinchan los labios y le cuesta respirar (ruido al coger aire).",
        respuesta: "rojo",
        explicacion: "Es una anafilaxia. Compromete la vía aérea. Requiere adrenalina y asistencia inmediata."
    },
    {
        id: 6,
        texto: "ADULTO: Vómitos de sangre roja brillante en gran cantidad.",
        respuesta: "rojo",
        explicacion: "Hemorragia digestiva alta activa. Riesgo de shock. Acude a Urgencias Hospitalarias o llama al 112."
    },
    {
        id: 7,
        texto: "NIÑO: Convulsión que dura más de 5 minutos o no recupera la conciencia.",
        respuesta: "rojo",
        explicacion: "Una convulsión prolongada (status epiléptico) es una emergencia vital."
    },
    {
        id: 8,
        texto: "ACCIDENTE: Corte profundo en el muslo con sangre que sale a chorros rítmicos.",
        respuesta: "rojo",
        explicacion: "Hemorragia arterial. Aplica presión fuerte directa y llama al 112. La vida corre peligro."
    },
    {
        id: 9,
        texto: "ANCIANO: Dolor de cabeza súbito, 'el peor de su vida', con vómitos y rigidez de nuca.",
        respuesta: "rojo",
        explicacion: "Sospecha de hemorragia cerebral. Requiere TAC urgente en hospital."
    },
    {
        id: 10,
        texto: "ADULTO: Intoxicación por humo en un incendio. Tos intensa y esputo negro.",
        respuesta: "rojo",
        explicacion: "Riesgo alto de lesión pulmonar por inhalación. Requiere oxigenoterapia hospitalaria."
    },
    {
        id: 11,
        texto: "NIÑO: Manchas rojas en la piel (petequias) que NO desaparecen al estirar la piel o presionar con un vaso.",
        respuesta: "rojo",
        explicacion: "Signo de alarma de infección grave (Sepsis/Meningitis). Correr a Urgencias Hospitalarias."
    },
    {
        id: 12,
        texto: "EMBARAZADA: Sangrado vaginal abundante y dolor abdominal intenso en el tercer trimestre.",
        respuesta: "rojo",
        explicacion: "Urgencia obstétrica. Riesgo para la madre y el feto."
    },
    {
        id: 13,
        texto: "DIABÉTICO: Sudoración, temblor, confusión y pérdida de consciencia (no puede tragar).",
        respuesta: "rojo",
        explicacion: "Hipoglucemia grave con pérdida de consciencia. No dar nada por boca. Glucagón y 112."
    },
    {
        id: 14,
        texto: "ADULTO: Traumatismo craneal fuerte. Ha vomitado dos veces y está muy somnoliento.",
        respuesta: "rojo",
        explicacion: "Signos de alarma tras un golpe en la cabeza. Requiere observación hospitalaria y pruebas."
    },
    {
        id: 15,
        texto: "ANCIANO: Fiebre y tensión arterial muy baja (sistólica < 90), piel moteada y confusión.",
        respuesta: "rojo",
        explicacion: "Posible Shock Séptico. Es una emergencia tiempo-dependiente."
    },

    // --- ÁMBAR: URGENCIAS NO VITALES (CENTRO DE SALUD / PAC) ---
    {
        id: 16,
        texto: "ADULTO: Fiebre de 38.5ºC y dolor al orinar (escozor) desde ayer. Estado general aceptable.",
        respuesta: "ambar",
        explicacion: "Probable infección de orina. Necesitas antibiótico, pero puedes ir a tu Centro de Salud o Punto de Urgencias."
    },
    {
        id: 17,
        texto: "NIÑO: Dolor de oído intenso (otitis) con fiebre, llora mucho pero respira bien.",
        respuesta: "ambar",
        explicacion: "Duele mucho y requiere valoración médica para ver si necesita antibiótico, pero no es vital. Centro de Salud."
    },
    {
        id: 18,
        texto: "ACCIDENTE: Torcedura de tobillo jugando al pádel. Hinchazón y dolor al apoyar, pero el pie tiene buen color.",
        respuesta: "ambar",
        explicacion: "Esguince. Requiere valoración y quizás radiografía, pero no es una emergencia vital. Urgencias de Atención Primaria."
    },
    {
        id: 19,
        texto: "ANCIANO: Descompensación de azúcar (Glucosa 280) sin síntomas graves, solo mucha sed.",
        respuesta: "ambar",
        explicacion: "Hiperglucemia simple. Acude al Centro de Salud para ajuste de insulina o tratamiento."
    },
    {
        id: 20,
        texto: "CUALQUIERA: Corte en la mano con cuchillo de cocina. Sangra, pero se controla presionando. Parece necesitar puntos.",
        respuesta: "ambar",
        explicacion: "Necesita sutura (puntos), pero si no es arterial, se puede realizar en el Centro de Salud o PAC."
    },
    {
        id: 21,
        texto: "ADULTO: Dolor de muelas muy intenso con flemón (hinchazón de cara).",
        respuesta: "ambar",
        explicacion: "Absceso dental. Necesitas antibiótico y analgesia pautada por médico de cabecera o dentista."
    },
    {
        id: 22,
        texto: "NIÑO: Vómitos y diarrea de 24h de evolución. Bebe suero a sorbos y lo tolera.",
        respuesta: "ambar",
        explicacion: "Gastroenteritis. Si tolera líquidos, valoración en Pediatra/Centro Salud para descartar deshidratación leve."
    },
    {
        id: 23,
        texto: "ADULTO: Cuerpo extraño en el ojo (una viruta o arena) que no sale lavando. Ojo rojo y doloroso.",
        respuesta: "ambar",
        explicacion: "Requiere extracción médica y tinción para ver si hay úlcera. Acude al médico."
    },
    {
        id: 24,
        texto: "ANCIANO: Herpes Zóster (culebrina). Erupción dolorosa con ampollas en un costado.",
        respuesta: "ambar",
        explicacion: "Necesita tratamiento antiviral en las primeras 72h. Pide cita urgente en tu Centro de Salud."
    },
    {
        id: 25,
        texto: "ADULTO: Lumbago fuerte tras coger peso. Te cuesta moverte pero no tienes fiebre ni pérdida de control de esfínteres.",
        respuesta: "ambar",
        explicacion: "Lumbbalgia aguda mecánica. Tratamiento inyectable o pauta analgésica en Centro de Salud."
    },
    {
        id: 26,
        texto: "NIÑO: Fiebre de 39ºC de 24h de evolución. Juega y come aceptablemente cuando le baja la fiebre.",
        respuesta: "ambar",
        explicacion: "Fiebre sin signos de alarma. Valoración por su pediatra en Centro de Salud."
    },
    {
        id: 27,
        texto: "ADULTO: Quemadura doméstica con aceite en el brazo. Ampolla de 3cm y dolor.",
        respuesta: "ambar",
        explicacion: "Quemadura de 2º grado leve. Requiere cura y valoración en enfermería/médico de familia."
    },
    {
        id: 28,
        texto: "ANCIANO: Tensión arterial descompensada (180/100) con leve dolor de cabeza, sin otros síntomas.",
        respuesta: "ambar",
        explicacion: "Crisis hipertensiva urgencia (no emergencia). Acudir al Centro de Salud para medicación oral y reposo."
    },
    {
        id: 29,
        texto: "CUALQUIERA: Picadura de avispa. Dolor e hinchazón local grande, pero respira bien.",
        respuesta: "ambar",
        explicacion: "Reacción local. Puede necesitar corticoide o antihistamínico recetado, pero no es anafilaxia."
    },
    {
        id: 30,
        texto: "ADULTO: Sondaje urinario obstruido. Tienes ganas de orinar y la sonda no drena.",
        respuesta: "ambar",
        explicacion: "Requiere cambio de sonda. Acude a enfermería de tu Centro de Salud o Urgencias de AP."
    },

    // --- VERDE: AUTOCUIDADO / CASA / FARMACIA ---
    {
        id: 31,
        texto: "ADULTO: Resfriado común. Congestión nasal, estornudos y décimas (37.2ºC).",
        respuesta: "verde",
        explicacion: "Proceso viral leve. Líquidos, paracetamol y descanso. No satures las urgencias."
    },
    {
        id: 32,
        texto: "NIÑO: Raspón en la rodilla al caerse en el parque. Sangrado mínimo.",
        respuesta: "verde",
        explicacion: "Lavar con agua y jabón, aplicar antiséptico (Clorhexidina/Betadine) y tapar. Cura doméstica."
    },
    {
        id: 33,
        texto: "ADULTO: Dolor de cabeza tensional tras un día de trabajo. Cede con analgésico habitual.",
        respuesta: "verde",
        explicacion: "Autocuidado. Descanso y analgesia básica."
    },
    {
        id: 34,
        texto: "ANCIANO: Estreñimiento de 3 días sin dolor abdominal intenso.",
        respuesta: "verde",
        explicacion: "Medidas dietéticas, hidratación y laxantes suaves de farmacia. Consulta programada si persiste."
    },
    {
        id: 35,
        texto: "CUALQUIERA: Picadura de mosquito que pica un poco. Sin hinchazón importante.",
        respuesta: "verde",
        explicacion: "Aplicar hielo local o crema para picaduras de venta libre."
    },
    {
        id: 36,
        texto: "ADULTO: Acné o granito en la cara que no duele.",
        respuesta: "verde",
        explicacion: "Problema estético o dermatológico no urgente. Consulta programada o farmacia."
    },
    {
        id: 37,
        texto: "NIÑO: Tos leve y mocos sin fiebre. Come y duerme bien.",
        respuesta: "verde",
        explicacion: "Catarro de vías altas. Lavados nasales y paciencia. No necesita antibiótico."
    },
    {
        id: 38,
        texto: "ADULTO: Resaca tras una fiesta. Dolor de cabeza y náuseas.",
        respuesta: "verde",
        explicacion: "Hidratación y reposo. No es motivo de consulta médica urgente."
    },
    {
        id: 39,
        texto: "ANCIANO: Pequeño hematoma (moratón) en el brazo tras golpearse con una puerta. Sin dolor intenso.",
        respuesta: "verde",
        explicacion: "Aplicar frío local y pomada para golpes. Vigilar evolución."
    },
    {
        id: 40,
        texto: "MUJER: Dolor menstrual habitual que cede con ibuprofeno.",
        respuesta: "verde",
        explicacion: "Autocuidado con analgesia y calor local."
    },
    {
        id: 41,
        texto: "ADULTO: Necesito renovar la receta de mi medicación habitual para la tensión.",
        respuesta: "verde",
        explicacion: "No es una urgencia. Pide cita administrativa o consulta telefónica con tu médico."
    },
    {
        id: 42,
        texto: "NIÑO: Piojos en el colegio. Le pica la cabeza.",
        respuesta: "verde",
        explicacion: "Tratamiento con loción de farmacia y liendrera. No ir al médico."
    },
    {
        id: 43,
        texto: "ADULTO: Quemadura solar en la espalda tras ir a la playa. Piel roja y caliente.",
        respuesta: "verde",
        explicacion: "Hidratación (Aftersun), líquidos y analgesia si duele. Evitar sol."
    },
    {
        id: 44,
        texto: "CUALQUIERA: Hipo que dura media hora.",
        respuesta: "verde",
        explicacion: "Suele ceder solo. Maniobras caseras. Solo consultar si dura >48h."
    },
    {
        id: 45,
        texto: "ADULTO: Sangrado de nariz leve que para al apretarse 5 minutos.",
        respuesta: "verde",
        explicacion: "Epistaxis autolimitada. Compresión y cabeza neutra (no hacia atrás)."
    },
    {
        id: 46,
        texto: "ANCIANO: Sequedad de piel y picor leve en piernas.",
        respuesta: "verde",
        explicacion: "Hidratación intensiva con cremas."
    },
    {
        id: 47,
        texto: "ADULTO: Dolor de garganta leve al despertar por dormir con la boca abierta.",
        respuesta: "verde",
        explicacion: "Beber agua. Cede solo durante la mañana."
    },
    {
        id: 48,
        texto: "NIÑO: Se le ha caído un diente de leche que se movía.",
        respuesta: "verde",
        explicacion: "Proceso natural. Morder una gasa si sangra un poco. Visita al Ratoncito Pérez."
    },
    {
        id: 49,
        texto: "ADULTO: Uña del pie un poco encarnada, molestia leve.",
        respuesta: "verde",
        explicacion: "Higiene, calzado ancho. Si se infecta, pedir cita en enfermería."
    },
    {
        id: 50,
        texto: "CUALQUIERA: Duda sobre cómo tomar un medicamento nuevo.",
        respuesta: "verde",
        explicacion: "Consulta al farmacéutico o lee el prospecto. Pide cita si sigues con dudas."
    }
];