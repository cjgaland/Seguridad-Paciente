import { GEMINI_API_KEY } from "../../../js/config.js";

// ==========================================
//  CONFIGURACIÓN (PROFESIONALES)
// ==========================================
const DOCS_PATH = "../../../assets/docs/";

const FILES = [
    // --- BLOQUE JUNTA DE ANDALUCÍA (3 Archivos) ---
    "JA_estrategia_seguridad_paciente.txt",
    "JA_manual_notificasp_completo.txt",
    "JA_recomendaciones_analisis_incidentes.txt",
    
    // --- BLOQUE MINISTERIO DE SANIDAD (3 Archivos) ---
    "MS_estrategia_seguridad_2025_2035_resumen.txt",
    "MS_notificacion_legal_y_sinasp.txt",
    "MS_programas_especificos_higiene_pediatria.txt",

    // --- BLOQUE OMS (2 Archivos) ---
    "OMS_higiene_manos_tecnica_y_estrategia.txt",
    "OMS_marco_prevencion_infecciones_IPC.txt",

    // --- BLOQUE OTROS (1 Archivo unificado) ---
    "OT_manual_basico_seguridad.txt"
];
let documentContext = ""; 

document.addEventListener('DOMContentLoaded', async () => {
    await loadKnowledgeBase();

    const btnSend = document.getElementById('btn-send');
    const userInput = document.getElementById('user-input');

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
            combinedText += `\n\n<<< FUENTE: ${FILES[index]} >>>\n${text}`;
            loadedCount++;
        }

        documentContext = combinedText;
        console.log(`Cerebro Profesional cargado: ${loadedCount} documentos.`);

        if (loadedCount === 0) {
            appendMessage("bot", "⚠️ Error: No se ha podido cargar ninguna documentación.");
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

    appendMessage("user", text);
    input.value = "";
    input.style.height = "50px"; 
    btn.disabled = true;

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
    
    // Contenido del mensaje
    let htmlContent = `
        <div class="msg-icon">
            <i class="fa-solid ${isBot ? 'fa-user-doctor' : 'fa-user'}"></i>
        </div>
        <div class="msg-content">
            ${isBot ? text : text.replace(/\n/g, '<br>')}
        </div>
    `;

    // AÑADIR BOTÓN DE COPIAR (Solo si es el bot y no es el mensaje de carga)
    if (isBot && !text.includes('fa-spin')) {
        htmlContent += `
            <div class="copy-btn-container">
                <button class="btn-copy" onclick="copiarAlPortapapeles('${msgId}')">
                    <i class="fa-regular fa-copy"></i> Copiar
                </button>
            </div>
        `;
    }
    
    msgDiv.innerHTML = htmlContent;
    history.appendChild(msgDiv);
    history.scrollTop = history.scrollHeight;
    return msgId;
}

function updateMessage(msgId, newText) {
    const msgDiv = document.getElementById(msgId);
    if (msgDiv) {
        const contentDiv = msgDiv.querySelector('.msg-content');
        
        // Renderizar Markdown
        if (typeof marked !== 'undefined') {
            contentDiv.innerHTML = marked.parse(newText);
        } else {
            contentDiv.innerHTML = newText;
        }

        // Añadir botón de copiar ahora que el texto final está listo
        if (!msgDiv.querySelector('.btn-copy')) {
            const copyDiv = document.createElement('div');
            copyDiv.className = 'copy-btn-container';
            copyDiv.innerHTML = `
                <button class="btn-copy" onclick="copiarAlPortapapeles('${msgId}')">
                    <i class="fa-regular fa-copy"></i> Copiar
                </button>
            `;
            msgDiv.appendChild(copyDiv);
        }
    }
}

// FUNCIÓN GLOBAL PARA COPIAR (Necesaria para el onclick del HTML)
window.copiarAlPortapapeles = function(msgId) {
    const msgDiv = document.getElementById(msgId);
    const contentDiv = msgDiv.querySelector('.msg-content');
    
    // Obtenemos el texto limpio (sin HTML)
    const texto = contentDiv.innerText;

    navigator.clipboard.writeText(texto).then(() => {
        // Feedback visual: Cambiar botón temporalmente
        const btn = msgDiv.querySelector('.btn-copy');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;"></i> Copiado';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
};

// ==========================================
//  CEREBRO RAG (PROFESIONALES)
// ==========================================
async function askGeminiRAG(preguntaUsuario) {
    const MODEL_NAME = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
        Actúa como un Asistente Técnico Experto en Seguridad del Paciente del SAS.
        
        FUENTES DE CONOCIMIENTO. Tienes dos fuentes de conocimiento:
        1. **CONTEXTO OFICIAL (PRIORIDAD MÁXIMA):**
           Usa la información contenida en los siguientes textos cargados.
           """
           ${documentContext}
           """
           
        2. **TU CONOCIMIENTO MÉDICO GENERAL (PLAN B):**
           Si la respuesta NO está en el contexto oficial de arriba, usa tu propio conocimiento como IA médica experta para responder, pero debes hacerlo con cautela.

        INSTRUCCIONES DE RESPUESTA:
        1. **Idioma:** Español de España.
        2.  - **Si la respuesta está en el Contexto Oficial:** Responde basándote en él. Al final, añade un apartado: "📚 **Fuente Oficial:**" indicando si es Junta de Andalucía, Ministerio u OMS.
            - **Si la respuesta NO está en el Contexto Oficial:** Responde basándote en consensos internacionales (OMS, CDC, guías clínicas), pero **EMPIEZA TU RESPUESTA** con esta frase exacta en cursiva: 
            - *"⚠️ Esta información no figura explícitamente en los documentos locales cargados, pero según el consenso clínico general..."*
        3. **Tono:** Profesional, clínico y preciso (dirigido a sanitarios).
        4. **Formato:**
           - Usa Markdown para estructurar la respuesta.
           - Usa listas (viñetas) para enumerar pasos.
           - Usa negritas para conceptos clave o títulos.
           - Alinea la información a la izquierda.
        
        INSTRUCCIONES DE CITAS:
        Al final, añade un apartado "📚 **Fuentes Oficiales:**".
        TRADUCE los nombres de archivo:
        - JA_... -> "Estrategia de Seguridad del Paciente (Junta de Andalucía)"
        - MS_... -> "Ministerio de Sanidad"
        - OMS_... -> "Organización Mundial de la Salud (OMS)"
        - OT_... -> "Otras Fuentes / Bibliografía"
        
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