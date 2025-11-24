// --- CAMBIO CLAVE: Importamos desde config.js ---
import { GEMINI_API_KEY } from "../../../js/config.js";

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnAnalizar');
    const input = document.getElementById('incidenteInput');
    const resultSection = document.getElementById('resultSection');
    const output = document.getElementById('iaOutput');

    btn.addEventListener('click', async () => {
        const texto = input.value.trim();
        
        if (!texto) {
            alert("Por favor, describe el incidente primero.");
            return;
        }

        if (texto.length < 10) {
            alert("La descripción es demasiado breve para un análisis fiable.");
            return;
        }

        // UI Loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Analizando caso clínico...';
        resultSection.classList.add('hidden');
        output.innerHTML = ""; 

        try {
            const respuestaIA = await consultarGemini(texto);
            
            // Renderizar respuesta
            if (typeof marked !== 'undefined') {
                 output.innerHTML = marked.parse(respuestaIA);
            } else {
                 output.innerHTML = respuestaIA.replace(/\n/g, "<br>");
            }
            
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("Error completo:", error);
            alert(`Error de conexión con IA: ${error.message}`);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Analizar Incidente con IA';
        }
    });
});

async function consultarGemini(descripcionIncidente) {
    const MODEL_NAME = "gemini-2.0-flash";
    // --- CAMBIO CLAVE: Usamos la variable importada ---
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const promptSistema = `
        Actúa como un Experto en Calidad Asistencial y Seguridad del Paciente.
        Analiza la siguiente notificación de incidente sanitario.
        Por favor responde en español de España.
        
        Devuelve un análisis técnico estructurado en formato Markdown con estos 3 apartados:
        1. **Clasificación del Incidente:** (Incidente sin daño, Evento Adverso o Centinela) y justificación.
        2. **Factores Contribuyentes:** (Lista con viñetas) Factores latentes, humanos o del sistema.
        3. **Recomendaciones:** (Lista con viñetas) Medidas preventivas concretas.
        
        Texto del incidente: "${descripcionIncidente}"
    `;

    const data = {
        contents: [{
            parts: [{ text: promptSistema }]
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const mensajeError = errorData.error?.message || response.statusText;
        throw new Error(`API Error ${response.status}: ${mensajeError}`);
    }

    const json = await response.json();
    
    if (!json.candidates || !json.candidates.length) {
        throw new Error("La IA no devolvió ninguna respuesta válida.");
    }

    return json.candidates[0].content.parts[0].text;
}