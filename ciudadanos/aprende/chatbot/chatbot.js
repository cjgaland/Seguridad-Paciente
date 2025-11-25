import { GEMINI_API_KEY } from "../../../js/config.js";

// ==========================================
//  CONFIGURACIÓN (CIUDADANOS)
// ==========================================
const DOCS_PATH = "../../../assets/docs/";

// LISTA CORREGIDA Y OPTIMIZADA (IDÉNTICA A LA DE PROFESIONALES)
// Solo usamos los 9 archivos maestros resúmidos para evitar errores y lentitud.
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

    // --- BLOQUE OTROS (1 Archivo) ---
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
            // Etiqueta interna para que la IA sepa de dónde viene el dato
            combinedText += `\n\n<<< FUENTE_INTERNA: ${FILES[index]} >>>\n${text}`;
            loadedCount++;
        }

        documentContext = combinedText;
        console.log(`Cerebro Ciudadano cargado: ${loadedCount} documentos.`);

    } catch (error) {
        console.error("Error cargando contexto:", error);
        appendMessage("bot", "⚠️ Lo siento, tengo problemas para acceder a mi biblioteca ahora mismo.");
    }
}

async function handleUserMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    const btn = document.getElementById('btn-send');

    if (!text) return;
    if (!documentContext) {
        alert("Un momento, estoy terminando de leer las guías de salud...");
        return;
    }

    appendMessage("user", text);
    input.value = "";
    input.style.height = "50px"; 
    btn.disabled = true;

    const loadingId = appendMessage("bot", '<i class="fa-solid fa-circle-notch fa-spin"></i> Consultando guías fiables...');

    try {
        const respuesta = await askGeminiRAG(text);
        updateMessage(loadingId, respuesta);
    } catch (error) {
        updateMessage(loadingId, "Lo siento, he tenido un pequeño error de conexión. ¿Me lo puedes preguntar otra vez?");
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
    
    let htmlContent = `
        <div class="msg-icon">
            <i class="fa-solid ${isBot ? 'fa-user-nurse' : 'fa-user'}"></i>
        </div>
        <div class="msg-content">
            ${isBot ? text : text.replace(/\n/g, '<br>')}
        </div>
    `;

    // Botón copiar solo para el bot
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
        // Protección contra el fallo de 'marked' si el navegador bloquea el script
        if (typeof marked !== 'undefined') {
            contentDiv.innerHTML = marked.parse(newText);
        } else {
            // Fallback: Si falla marked.js, muestra texto plano con saltos de línea
            contentDiv.innerHTML = newText.replace(/\n/g, "<br>");
        }

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

// Función global para copiar
window.copiarAlPortapapeles = function(msgId) {
    const msgDiv = document.getElementById(msgId);
    const contentDiv = msgDiv.querySelector('.msg-content');
    const texto = contentDiv.innerText;

    navigator.clipboard.writeText(texto).then(() => {
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
    }).catch(err => console.error('Error al copiar:', err));
};

// ==========================================
//  CEREBRO RAG HÍBRIDO (CIUDADANOS)
// ==========================================
async function askGeminiRAG(preguntaUsuario) {
    const MODEL_NAME = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
        Actúa como un experto en Seguridad del Paciente, muy amable, empático y paciente.
        Estás atendiendo a un ciudadano que no tiene conocimientos médicos.
        
        TIENES DOS FUENTES DE INFORMACIÓN (en orden de prioridad):
        
        1. **CONTEXTO OFICIAL (PRIORIDAD MÁXIMA):**
           Usa la información contenida en los siguientes textos cargados.
           """
           ${documentContext}
           """
           
        2. **TU CONOCIMIENTO MÉDICO GENERAL (PLAN B):**
           Si la respuesta NO está en el contexto oficial de arriba, usa tu propio conocimiento general de salud para responder, pero siempre aconsejando consultar al médico para casos específicos.

        INSTRUCCIONES DE RESPUESTA:
        1. **Tono:** Cercano, tranquilizador y claro. Evita tecnicismos (o explícalos: ej. en vez de "nosocomial" di "infección cogida en el hospital").
        2. **Si la respuesta está en el Contexto Oficial:** Responde basándote en él. Al final, añade: "📚 **Fuente Oficial:**" indicando si es Junta de Andalucía, Ministerio u OMS (no pongas nombres de archivo, traduce el código JA/MS/OMS/OT a la institución).
        3. **Si la respuesta NO está en el Contexto Oficial:** Responde basándote en el consenso general de salud, pero **EMPIEZA TU RESPUESTA** con esta frase en cursiva: 
          *"⚠️ Esta información es un consejo general de salud, no aparece específicamente en las guías de la Estrategia cargadas, pero..."*
        
        FORMATO:
        - Español de España.
        - Usa negritas para las ideas clave.
        - Listas para pasos a seguir.

        PREGUNTA DEL CIUDADANO:
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