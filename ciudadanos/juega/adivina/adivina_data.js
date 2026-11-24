export const PREGUNTAS = [
    // --- BLOQUE 1: BÁSICOS (1-10) ---
    {
        id: 1,
        pregunta: "El médico te ha recetado **Paracetamol de 1 gramo**. ¿Cuál de estas cajas debes tomar?",
        opciones: [
            { id: "a", texto: "Paracetamol 500 mg", icon: "fa-pills", color: "#3b82f6" },
            { id: "b", texto: "Paracetamol 1 g", icon: "fa-tablets", color: "#10b981", correcta: true },
            { id: "c", texto: "Paracetamol Jarabe", icon: "fa-prescription-bottle", color: "#f59e0b" }
        ],
        explicacion: "¡Fíjate siempre en el número! A veces las cajas son idénticas y solo cambia la dosis. Tomar menos no te alivia, y tomar más puede ser tóxico para el hígado."
    },
    {
        id: 2,
        pregunta: "Acabas de comprar **Insulina** y aún **NO la has abierto**. ¿Dónde la guardas?",
        opciones: [
            { id: "a", texto: "En el congelador", icon: "fa-snowflake", color: "#3b82f6" },
            { id: "b", texto: "En el botiquín del baño", icon: "fa-kit-medical", color: "#f59e0b" },
            { id: "c", texto: "En la nevera", icon: "fa-temperature-low", color: "#10b981", correcta: true }
        ],
        explicacion: "La insulina sin abrir debe conservarse en nevera (2-8ºC). Nunca en el congelador. Una vez abierta, puede estar fuera (hasta 30ºC) durante un mes."
    },
    {
        id: 3,
        pregunta: "Tienes que ponerte gotas en los **OJOS** (Colirio). ¿Qué envase eliges?",
        opciones: [
            { id: "a", texto: "Vía Ótica", icon: "fa-ear-listen", color: "#f59e0b" },
            { id: "b", texto: "Vía Oftálmica", icon: "fa-eye", color: "#10b981", correcta: true },
            { id: "c", texto: "Vía Nasal", icon: "fa-head-side-cough", color: "#3b82f6" }
        ],
        explicacion: "Los botes se parecen mucho. Lee siempre: 'Oftálmico' es para los ojos. Echar gotas de oído en el ojo puede causar quemaduras graves."
    },
    {
        id: 4,
        pregunta: "Vas a recortar un blíster para llevar una pastilla en el bolso. ¿Cómo lo haces?",
        opciones: [
            { id: "a", texto: "Corto ajustado al borde", icon: "fa-scissors", color: "#ef4444" },
            { id: "b", texto: "Dejo ver nombre y fecha", icon: "fa-calendar-check", color: "#10b981", correcta: true },
            { id: "c", texto: "La envuelvo en papel", icon: "fa-scroll", color: "#f59e0b" }
        ],
        explicacion: "Nunca recortes la fecha de caducidad ni el nombre. Si encuentras una pastilla suelta o caducada dentro de un mes, no sabrás qué es."
    },
    {
        id: 5,
        pregunta: "El jarabe dice: 'Tomar 5 ml'. ¿Qué usas para medirlo?",
        opciones: [
            { id: "a", texto: "Cuchara de postre", icon: "fa-spoon", color: "#f59e0b" },
            { id: "b", texto: "Un vaso pequeño", icon: "fa-glass-water", color: "#3b82f6" },
            { id: "c", texto: "Jeringa de la caja", icon: "fa-syringe", color: "#10b981", correcta: true }
        ],
        explicacion: "Las cucharas de cocina varían de tamaño. Usa siempre la jeringa o vasito dosificador que viene en la caja para evitar errores de dosis."
    },
    {
        id: 6,
        pregunta: "Ves un triángulo rojo con un coche ⚠️🚗 en la caja. ¿Qué significa?",
        opciones: [
            { id: "a", texto: "Prohibido viajar", icon: "fa-plane-slash", color: "#ef4444" },
            { id: "b", texto: "Puede dar sueño", icon: "fa-car-side", color: "#10b981", correcta: true },
            { id: "c", texto: "Guardar en el coche", icon: "fa-car", color: "#3b82f6" }
        ],
        explicacion: "Este símbolo alerta de que el medicamento puede reducir tus reflejos o provocar somnolencia. Ten precaución si vas a conducir."
    },
    {
        id: 7,
        pregunta: "Te mandaron antibiótico 7 días, pero al 3º ya estás bien. ¿Qué haces?",
        opciones: [
            { id: "a", texto: "Lo dejo ya", icon: "fa-ban", color: "#ef4444" },
            { id: "b", texto: "Termino los 7 días", icon: "fa-calendar-week", color: "#10b981", correcta: true },
            { id: "c", texto: "Tomo la mitad", icon: "fa-percent", color: "#f59e0b" }
        ],
        explicacion: "Si paras el antibiótico antes, las bacterias pueden hacerse resistentes y la infección volverá. Cumple siempre el ciclo completo."
    },
    {
        id: 8,
        pregunta: "Tu pastilla habitual ha cambiado de color o forma. ¿Qué haces?",
        opciones: [
            { id: "a", texto: "No la tomo", icon: "fa-xmark", color: "#ef4444" },
            { id: "b", texto: "Me la tomo igual", icon: "fa-check", color: "#f59e0b" },
            { id: "c", texto: "Pregunto en farmacia", icon: "fa-question", color: "#10b981", correcta: true }
        ],
        explicacion: "Puede ser un cambio de marca (genérico) o un error. Antes de tomarla, pregunta a tu farmacéutico para confirmar que es la correcta."
    },
    {
        id: 9,
        pregunta: "¿Cuál es el mejor sitio para guardar el botiquín?",
        opciones: [
            { id: "a", texto: "El baño", icon: "fa-sink", color: "#3b82f6" },
            { id: "b", texto: "La cocina", icon: "fa-kitchen-set", color: "#f59e0b" },
            { id: "c", texto: "Armario seco y alto", icon: "fa-box-archive", color: "#10b981", correcta: true }
        ],
        explicacion: "La humedad del baño y el calor de la cocina estropean los medicamentos. Busca un sitio seco, fresco y lejos del alcance de los niños."
    },
    {
        id: 10,
        pregunta: "Medicinas caducadas. ¿Dónde se tiran?",
        opciones: [
            { id: "a", texto: "Punto SIGRE", icon: "fa-recycle", color: "#10b981", correcta: true },
            { id: "b", texto: "Basura orgánica", icon: "fa-trash-can", color: "#3b82f6" },
            { id: "c", texto: "Desagüe", icon: "fa-toilet", color: "#f59e0b" }
        ],
        explicacion: "Los medicamentos contaminan el medio ambiente. Llévalos al Punto SIGRE de la farmacia para un reciclaje seguro."
    },

    // --- BLOQUE 2: AVANZADOS Y SEGURIDAD (11-20) ---
    {
        id: 11,
        pregunta: "Ves un símbolo de un **Sol y una Nube** ☀️☁️ en la caja. ¿Qué indica?",
        opciones: [
            { id: "a", texto: "Tomar de día", icon: "fa-sun", color: "#f59e0b" },
            { id: "b", texto: "Fotosensibilidad", icon: "fa-umbrella-beach", color: "#10b981", correcta: true },
            { id: "c", texto: "Guardar a oscuras", icon: "fa-moon", color: "#3b82f6" }
        ],
        explicacion: "Significa que el medicamento reacciona con el sol y puede provocarte quemaduras o manchas en la piel. Usa protector solar alto."
    },
    {
        id: 12,
        pregunta: "Usas un **inhalador de corticoides**. ¿Qué debes hacer justo después?",
        opciones: [
            { id: "a", texto: "Tumbarme", icon: "fa-bed", color: "#3b82f6" },
            { id: "b", texto: "Enjuagarme la boca", icon: "fa-glass-water", color: "#10b981", correcta: true },
            { id: "c", texto: "Comer algo", icon: "fa-burger", color: "#f59e0b" }
        ],
        explicacion: "Los corticoides inhalados pueden dejar restos en la boca y provocar hongos (candidiasis). Enjuágate siempre con agua después."
    },
    {
        id: 13,
        pregunta: "Te recetan una pastilla **efervescente**. ¿Cómo la tomas?",
        opciones: [
            { id: "a", texto: "La trago entera", icon: "fa-pills", color: "#ef4444" },
            { id: "b", texto: "La chupo", icon: "fa-face-surprise", color: "#f59e0b" },
            { id: "c", texto: "Disuelta en agua", icon: "fa-glass-water", color: "#10b981", correcta: true }
        ],
        explicacion: "Las efervescentes deben disolverse completamente antes de beberlas. Tragarlas enteras es peligroso y muy doloroso para el estómago."
    },
    {
        id: 14,
        pregunta: "Tienes que preparar un **antibiótico en jarabe (polvo + agua)** para tu hijo. ¿Qué haces antes de cada dosis?",
        opciones: [
            { id: "a", texto: "Calentarlo", icon: "fa-fire", color: "#ef4444" },
            { id: "b", texto: "Agitarlo bien", icon: "fa-shake", color: "#10b981", correcta: true },
            { id: "c", texto: "Añadir azúcar", icon: "fa-cube", color: "#3b82f6" }
        ],
        explicacion: "Las suspensiones se posan en el fondo. Si no agitas, al principio tomará solo agua y al final una dosis tóxica de medicina."
    },
    {
        id: 15,
        pregunta: "Usas **parches** para el dolor. Te toca ponerte uno nuevo. ¿Qué haces primero?",
        opciones: [
            { id: "a", texto: "Poner el nuevo", icon: "fa-plus", color: "#f59e0b" },
            { id: "b", texto: "Quitar el viejo", icon: "fa-minus", color: "#10b981", correcta: true },
            { id: "c", texto: "Limpiar con alcohol", icon: "fa-pump-medical", color: "#3b82f6" }
        ],
        explicacion: "¡Error muy común! Si olvidas quitar el parche anterior, estás doblando la dosis y puede ser peligroso. Revisa siempre la piel."
    },
    {
        id: 16,
        pregunta: "Te duele la cabeza. Tienes 'Gelocatil' y 'Paracetamol' en casa. ¿Te tomas uno de cada?",
        opciones: [
            { id: "a", texto: "Sí, para más efecto", icon: "fa-thumbs-up", color: "#ef4444" },
            { id: "b", texto: "No, es lo mismo", icon: "fa-equals", color: "#10b981", correcta: true },
            { id: "c", texto: "Solo si duele mucho", icon: "fa-face-dizzy", color: "#f59e0b" }
        ],
        explicacion: "¡Cuidado con las marcas! Gelocatil ES Paracetamol. Si tomas los dos, estás tomando el doble de dosis y dañarás tu hígado."
    },
    {
        id: 17,
        pregunta: "Abres un bote de **colirio**. ¿Cuánto tiempo puedes usarlo?",
        opciones: [
            { id: "a", texto: "Hasta que se acabe", icon: "fa-infinity", color: "#ef4444" },
            { id: "b", texto: "1 año", icon: "fa-calendar-days", color: "#3b82f6" },
            { id: "c", texto: "4 semanas (1 mes)", icon: "fa-clock", color: "#10b981", correcta: true }
        ],
        explicacion: "Los colirios pierden la esterilidad al abrirse. Anota la fecha de apertura en la caja y deséchalo al mes, aunque quede líquido."
    },
    {
        id: 18,
        pregunta: "Una pastilla **NO tiene ranura** en medio. ¿Puedes partirla?",
        opciones: [
            { id: "a", texto: "No", icon: "fa-ban", color: "#10b981", correcta: true },
            { id: "b", texto: "Sí, con un cuchillo", icon: "fa-utensils", color: "#f59e0b" },
            { id: "c", texto: "Sí, mordiéndola", icon: "fa-teeth", color: "#ef4444" }
        ],
        explicacion: "Si no tiene ranura, suele ser porque tiene una capa especial (liberación retardada o protección gástrica). Si la partes, pierdes ese efecto."
    },
    {
        id: 19,
        pregunta: "Estás tomando tranquilizantes o pastillas para dormir. ¿Puedes beber alcohol?",
        opciones: [
            { id: "a", texto: "Solo cerveza", icon: "fa-beer-mug-empty", color: "#f59e0b" },
            { id: "b", texto: "Nunca", icon: "fa-ban", color: "#10b981", correcta: true },
            { id: "c", texto: "Si ceno bien, sí", icon: "fa-utensils", color: "#3b82f6" }
        ],
        explicacion: "El alcohol potencia el efecto sedante. Mezclarlo puede provocar caídas, mareos graves o parada respiratoria."
    },
    {
        id: 20,
        pregunta: "Ves este símbolo 🤰🚫 (Mujer embarazada tachada). ¿Qué significa?",
        opciones: [
            { id: "a", texto: "Solo para hombres", icon: "fa-mars", color: "#3b82f6" },
            { id: "b", texto: "No tomar si embarazo", icon: "fa-person-pregnant", color: "#10b981", correcta: true },
            { id: "c", texto: "Produce náuseas", icon: "fa-face-flushed", color: "#f59e0b" }
        ],
        explicacion: "Indica que el medicamento puede dañar al feto (teratogénico). Si estás embarazada o podrías estarlo, no lo tomes y consulta al médico."
    },

    // --- BLOQUE 3: SITUACIONES COTIDIANAS (21-30) ---
    {
        id: 21,
        pregunta: "El tapón del jarabe de tu hijo gira pero no se abre. ¿Qué pasa?",
        opciones: [
            { id: "a", texto: "Está roto", icon: "fa-heart-crack", color: "#ef4444" },
            { id: "b", texto: "Es de seguridad", icon: "fa-shield-halved", color: "#10b981", correcta: true },
            { id: "c", texto: "Necesito un abrelatas", icon: "fa-gears", color: "#3b82f6" }
        ],
        explicacion: "Es un cierre de seguridad para niños. Tienes que apretar hacia abajo y girar a la vez para abrirlo."
    },
    {
        id: 22,
        pregunta: "Se te olvidó tomar la pastilla de la mañana. Ahora es de noche. ¿Qué haces?",
        opciones: [
            { id: "a", texto: "Tomo doble dosis", icon: "fa-xmark", color: "#ef4444" },
            { id: "b", texto: "Espero a mañana", icon: "fa-calendar-day", color: "#10b981", correcta: true },
            { id: "c", texto: "Tomo la mitad", icon: "fa-percent", color: "#f59e0b" }
        ],
        explicacion: "Nunca tomes doble dosis para compensar un olvido. Sáltate la toma olvidada y sigue con tu horario normal."
    },
    {
        id: 23,
        pregunta: "A tu vecina le duele la cabeza igual que a ti. ¿Le das de tu medicina?",
        opciones: [
            { id: "a", texto: "Claro, es eficaz", icon: "fa-hand-holding-heart", color: "#f59e0b" },
            { id: "b", texto: "No, nunca", icon: "fa-user-shield", color: "#10b981", correcta: true },
            { id: "c", texto: "Solo si es adulta", icon: "fa-user", color: "#3b82f6" }
        ],
        explicacion: "Lo que es bueno para ti puede ser veneno para ella (alergias, interacción con otras pastillas). Nunca compartas medicación recetada."
    },
    {
        id: 24,
        pregunta: "Tienes que preparar un antibiótico en suspensión (líquido). ¿Dónde lo guardas?",
        opciones: [
            { id: "a", texto: "En la nevera", icon: "fa-temperature-low", color: "#10b981", correcta: true },
            { id: "b", texto: "En la mesita", icon: "fa-table", color: "#ef4444" },
            { id: "c", texto: "Al sol", icon: "fa-sun", color: "#f59e0b" }
        ],
        explicacion: "La mayoría de antibióticos líquidos para niños, una vez mezclados con agua, deben guardarse en la nevera para que no se estropeen."
    },
    {
        id: 25,
        pregunta: "Te han recetado un **Supositorio**. ¿Por dónde se administra?",
        opciones: [
            { id: "a", texto: "Vía Oral (Boca)", icon: "fa-face-smile", color: "#ef4444" },
            { id: "b", texto: "Vía Rectal", icon: "fa-arrow-down", color: "#10b981", correcta: true },
            { id: "c", texto: "Disuelto en agua", icon: "fa-glass-water", color: "#3b82f6" }
        ],
        explicacion: "Aunque parezca obvio, ocurren errores. Los supositorios son para vía rectal. Ingerirlos puede ser ineficaz o peligroso."
    },
    {
        id: 26,
        pregunta: "Usas una crema con cortisona. ¿Qué haces al terminar de dártela?",
        opciones: [
            { id: "a", texto: "Lavarme las manos", icon: "fa-hands-bubbles", color: "#10b981", correcta: true },
            { id: "b", texto: "Secarme en la toalla", icon: "fa-rug", color: "#f59e0b" },
            { id: "c", texto: "Tocarme los ojos", icon: "fa-eye", color: "#ef4444" }
        ],
        explicacion: "Lávate siempre las manos después de aplicar cremas medicamentosas para no absorber medicina por tus manos ni tocarte ojos/boca por error."
    },
    {
        id: 27,
        pregunta: "Tu hijo tiene fiebre. ¿Le das Aspirina?",
        opciones: [
            { id: "a", texto: "Sí, es buenísimo", icon: "fa-check", color: "#ef4444" },
            { id: "b", texto: "No, mejor Paracetamol", icon: "fa-child", color: "#10b981", correcta: true },
            { id: "c", texto: "Media pastilla", icon: "fa-star-half-stroke", color: "#f59e0b" }
        ],
        explicacion: "La Aspirina en niños con virus puede causar el Síndrome de Reye (muy grave). Usa Paracetamol o Ibuprofeno pediátrico."
    },
    {
        id: 28,
        pregunta: "Tomas **Sintrom** (anticoagulante). ¿Qué debes vigilar en la comida?",
        opciones: [
            { id: "a", texto: "El agua", icon: "fa-bottle-water", color: "#3b82f6" },
            { id: "b", texto: "Verduras hoja verde", icon: "fa-leaf", color: "#10b981", correcta: true },
            { id: "c", texto: "El pan", icon: "fa-bread-slice", color: "#f59e0b" }
        ],
        explicacion: "Las verduras de hoja verde tienen Vitamina K, que puede alterar el efecto del Sintrom. Mantén una dieta estable y consulta a tu enfermera."
    },
    {
        id: 29,
        pregunta: "Te mandan una pastilla **Sublingual** para un dolor fuerte de pecho. ¿Dónde la pones?",
        opciones: [
            { id: "a", texto: "Debajo de la lengua", icon: "fa-turn-down", color: "#10b981", correcta: true },
            { id: "b", texto: "La trago con agua", icon: "fa-glass-water", color: "#f59e0b" },
            { id: "c", texto: "La mastico", icon: "fa-teeth", color: "#ef4444" }
        ],
        explicacion: "Sublingual significa 'debajo de la lengua'. Ahí se absorbe rapidísimo. Si la tragas, tardará mucho más en hacer efecto."
    },
    {
        id: 30,
        pregunta: "Te vas de viaje en coche en verano. ¿Dónde llevas las medicinas?",
        opciones: [
            { id: "a", texto: "En la guantera", icon: "fa-car", color: "#ef4444" },
            { id: "b", texto: "En el maletero", icon: "fa-suitcase", color: "#f59e0b" },
            { id: "c", texto: "Conmigo en cabina", icon: "fa-person-seat", color: "#10b981", correcta: true }
        ],
        explicacion: "La guantera y el maletero alcanzan temperaturas extremas que 'cuecen' las medicinas. Llévalas contigo en la zona climatizada."
    }
];