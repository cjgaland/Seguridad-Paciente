import { GEMINI_API_KEY } from "../../../js/config.js";

// ==========================================
//  CONFIGURACIÓN DE LA BIBLIOTECA
// ==========================================
// Lista aquí todos los archivos .txt que quieras que el bot lea.
// Deben estar en la carpeta: /assets/docs/
const DOCS_PATH = "../../../assets/docs/";
const FILES = [
    "higiene_manos.txt",
    "identificacion_paciente.txt",
    "uso_seguro_medicacion.txt" 
    // Añade aquí tantos como necesites (separados por comas)
];

let documentContext = ""; 

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar el "cerebro" (leemos todos los archivos y los unimos)
    await loadKnowledgeBase();

    const btnSend = document.getElementById('btn-send');
    const userInput = document.getElementById('user-input');

    // Enviar con botón
    btnSend.addEventListener('click', () => handleUserMessage());
    
    // Enviar con Enter (sin Shift)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });
});

async function loadKnowledgeBase() {
    try {
        // Truco pro: Usamos Promise.all para leerlos todos a la vez (en paralelo)
        const promises = FILES.map(fileName => fetch(DOCS_PATH + fileName));
        const responses = await Promise.all(promises);

        // Verificamos que todos cargaron bien
        let combinedText = "";
        for (const [index, response] of responses.entries()) {
            if (!response.ok) {
                console.warn(`No se pudo cargar: ${FILES[index]}`);
                continue;
            }
            const text = await response.text();
            // Añadimos un separador para que la IA distinga documentos
            combinedText += `\n\n--- DOCUMENTO: ${FILES[index]} ---\n${text}`;
        }

        documentContext = combinedText;
        console.log(`Cerebro cargado: ${FILES.length} documentos (${documentContext.length} caracteres).`);

        if (documentContext.length < 50) {
            appendMessage("bot", "⚠️ Alerta: No he podido leer correctamente los documentos. Revisa la carpeta assets/docs.");
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
        alert("El sistema está inicializando la base de datos. Un momento...");
        return;
    }

    // 1. Mostrar mensaje usuario
    appendMessage("user", text);
    input.value = "";
    input.style.height = "50px"; 
    btn.disabled = true;

    // 2. Mostrar "Escribiendo..."
    const loadingId = appendMessage("bot", '<i class="fa-solid fa-circle-notch fa-spin"></i> Consultando bibliografía oficial...');

    try {
        // 3. Consultar a Gemini
        const respuesta = await askGeminiRAG(text);
        
        // 4. Reemplazar loading con respuesta
        updateMessage(loadingId, respuesta);

    } catch (error) {
        updateMessage(loadingId, "Lo siento, ha ocurrido un error de conexión. Inténtalo de nuevo.");
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
            <i class="fa-solid ${isBot ? 'fa-robot' : 'fa-user'}"></i>
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

// LÓGICA RAG
async function askGeminiRAG(preguntaUsuario) {
    const MODEL_NAME = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
        Actúa como un Asistente Experto en Seguridad del Paciente del SAS (Andalucía).
        
        INSTRUCCIONES DE SEGURIDAD:
        1. Tu conocimiento se limita EXCLUSIVAMENTE al siguiente CONTEXTO OFICIAL.
        2. Si la respuesta no está explícitamente en el texto, di: "Lo siento, esa información no aparece en los protocolos cargados actualmente."
        3. No inventes procedimientos médicos.
        
        CONTEXTO OFICIAL CARGADO:
        """
        ${documentContext}
        """

        PREGUNTA DEL USUARIO:
        "${preguntaUsuario}"

        FORMATO DE RESPUESTA:
        - Usa Markdown para estructurar la respuesta (negritas, listas).
        - Sé directo, profesional y empático.
        - IMPORTANTE: NO menciones nombres de archivos (como .txt o .pdf). 
        - Si tienes que citar la fuente, di simplemente: "Según el protocolo vigente..." o "De acuerdo a la guía de la Estrategia...".
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