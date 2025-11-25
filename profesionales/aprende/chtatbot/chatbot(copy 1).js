import { GEMINI_API_KEY } from "../../../js/config.js";

// ==========================================
//  CONFIGURACIÓN DE LA BIBLIOTECA
// ==========================================
const DOCS_PATH = "../../../assets/docs/";

// Lista completa de tus 21 documentos oficiales
const FILES = [
    "JA_estrategia_seguridad_paciente.txt",
    "JA_notificasp_ciudadania.txt",
    "JA_notificasp_como_gestionar_incidente.txt",
    "JA_notificasp_faq.txt",
    "JA_notificasp_funcionalidades_gestores.txt",
    "JA_notificasp_profesionales.txt",
    "JA_recomendaciones_analisis_incidentes.txt",
    "MS_atencion_segura_recien_nacidos_ninos.txt",
    "MS_estrategia_seguridad_2025_2035.txt",
    "MS_estudio_incremento_conocimiento.txt",
    "MS_experiencias_gestion_sistemas_notificacion_2025.txt",
    "MS_indicadores_higiene_manos_2024.txt",
    "MS_informe_sinasp_notificaciones_2024.txt",
    "MS_mejora_higiene_manos_centros_residenciales.txt",
    "OMS_consideraciones_recursos_higiene_manos.txt",
    "OMS_guia_aplicacion.txt",
    "OMS_manual_tecnico.txt",
    "OMS_WHO_IPC_TOOL_2023_2_eng.txt",
    "OT_higiene_manos.txt",
    "OT_identificacion_paciente.txt",
    "OT_uso_seguro_medicacion.txt"
];

let documentContext = ""; 

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar el cerebro
    await loadKnowledgeBase();

    const btnSend = document.getElementById('btn-send');
    const userInput = document.getElementById('user-input');

    // Eventos de envío
    btnSend.addEventListener('click', () => handleUserMessage());
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });
});

async function loadKnowledgeBase() {
    try {
        const promises = FILES.map(fileName => fetch(DOCS_PATH + fileName));
        const responses = await Promise.all(promises);

        let combinedText = "";
        let loadedCount = 0;

        for (const [index, response] of responses.entries()) {
            if (!response.ok) {
                console.warn(`No se pudo cargar: ${FILES[index]}`);
                continue;
            }
            const text = await response.text();
            // Etiquetamos cada bloque con su nombre de archivo para que la IA sepa el origen
            combinedText += `\n\n<<< FUENTE: ${FILES[index]} >>>\n${text}`;
            loadedCount++;
        }

        documentContext = combinedText;
        console.log(`Cerebro cargado: ${loadedCount} de ${FILES.length} documentos.`);

        if (loadedCount === 0) {
            appendMessage("bot", "⚠️ Error: No se ha podido cargar ninguna documentación. Revisa la carpeta assets/docs.");
        }

    } catch (error) {
        console.error("Error cargando contexto:", error);
        appendMessage("bot", "⚠️ Error crítico cargando documentación.");
    }
}

async function handleUserMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    const btn = document.getElementById('btn-send');

    if (!text) return;
    if (!documentContext) {
        alert("El sistema está procesando la base de conocimiento. Un momento...");
        return;
    }

    // UI: Mensaje usuario
    appendMessage("user", text);
    input.value = "";
    input.style.height = "50px"; 
    btn.disabled = true;

    // UI: Loading
    const loadingId = appendMessage("bot", '<i class="fa-solid fa-circle-notch fa-spin"></i> Consultando evidencia científica...');

    try {
        const respuesta = await askGeminiRAG(text);
        updateMessage(loadingId, respuesta);
    } catch (error) {
        updateMessage(loadingId, "Lo siento, ha ocurrido un error de conexión con el servidor de IA.");
        console.error(error);
    } finally {
        btn.disabled = false;
        input.focus();
    }
}

function appendMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    const isBot = sender === 'bot';
    const msgId = 'msg-' + Date.now();
    
    msgDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    msgDiv.id = msgId;
    
    msgDiv.innerHTML = `
        <div class="msg-icon">
            <i class="fa-solid ${isBot ? 'fa-user-doctor' : 'fa-user'}"></i>
        </div>
        <div class="msg-content">
            ${isBot ? text : text.replace(/\n/g, '<br>')}
        </div>
    `;
    
    history.appendChild(msgDiv);
    history.scrollTop = history.scrollHeight;
    return msgId;
}

function updateMessage(msgId, newText) {
    const msgDiv = document.getElementById(msgId);
    if (msgDiv) {
        const contentDiv = msgDiv.querySelector('.msg-content');
        if (typeof marked !== 'undefined') {
            contentDiv.innerHTML = marked.parse(newText);
        } else {
            contentDiv.innerHTML = newText;
        }
    }
}

// ==========================================
//  CEREBRO RAG (PROFESIONALES)
// ==========================================
async function askGeminiRAG(preguntaUsuario) {
    const MODEL_NAME = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
        Actúa como un Asistente Técnico Experto en Seguridad del Paciente.
        
        TU CONOCIMIENTO:
        Tu única fuente de información es el siguiente CONTEXTO DOCUMENTAL.
        Cada documento comienza con la etiqueta "<<< FUENTE: Nombre_Archivo >>>".
        
        CONTEXTO DOCUMENTAL:
        """
        ${documentContext}
        """

        INSTRUCCIONES DE RESPUESTA:
        1. **Idioma:** Responde estrictamente en **español de España**.
        2. **Contenido:** Responde basándote SOLO en el texto proporcionado. Si no está en los textos, di que no tienes esa información oficial.
        3. **Tono:** Profesional, clínico y preciso. Dirigido a médicos y enfermeros.
        4. **Estructura:** Usa Markdown (negritas para conceptos clave, listas para enumeraciones).
        
        INSTRUCCIONES DE CITAS (CRÍTICO):
        Al final de tu respuesta, añade SIEMPRE un apartado llamado "📚 Fuentes consultadas:" indicando de dónde has sacado la información.
        Debes traducir los nombres de los archivos según esta regla:
        - Si el archivo empieza por "JA_" -> Escribe: "Estrategia de Seguridad del Paciente (Junta de Andalucía)"
        - Si el archivo empieza por "MS_" -> Escribe: "Ministerio de Sanidad (Gobierno de España)"
        - Si el archivo empieza por "OMS_" -> Escribe: "Organización Mundial de la Salud (OMS)"
        - Si el archivo empieza por "OT_" -> Escribe: "Otras Fuentes / Bibliografía General"
        
        NO menciones el nombre del archivo (ej: no digas "JA_notifica.txt"), usa el nombre de la institución.

        PREGUNTA DEL PROFESIONAL:
        "${preguntaUsuario}"
    `;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) throw new Error("Error API Gemini");
    const json = await response.json();
    return json.candidates[0].content.parts[0].text;
}