// IMPORTAMOS LA CLAVE DESDE EL ARCHIVO DE CONFIGURACIÓN CENTRAL
import { GEMINI_API_KEY } from "../../../js/config.js";

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnTraducir');
    const input = document.getElementById('medicalInput');
    const resultSection = document.getElementById('resultSection');
    const output = document.getElementById('iaOutput');

    btn.addEventListener('click', async () => {
        const texto = input.value.trim();
        
        if (!texto) {
            alert("Por favor, escribe algo para traducir.");
            return;
        }

        if (texto.length < 3) {
            alert("El texto es demasiado corto.");
            return;
        }

        // UI Loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Pensando...';
        resultSection.classList.add('hidden');
        output.innerHTML = ""; 

        try {
            const respuestaIA = await consultarGemini(texto);
            
            // Renderizar con Markdown
            if (typeof marked !== 'undefined') {
                 output.innerHTML = marked.parse(respuestaIA);
            } else {
                 output.innerHTML = respuestaIA.replace(/\n/g, "<br>");
            }
            
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("Error completo:", error);
            alert(`Error de conexión: ${error.message}`);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Traducir a Lenguaje Sencillo';
        }
    });
});

async function consultarGemini(textoUsuario) {
    // MODELO 2.0 FLASH
    const MODEL_NAME = "gemini-2.0-flash";
    // USAMOS LA VARIABLE IMPORTADA GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // PROMPT DE "ENFERMERO AMABLE"
    const promptSistema = `
        Actúa como un enfermero experto, paciente y muy amable.
        Tu misión es "traducir" el siguiente texto médico para que un paciente (sin conocimientos sanitarios) lo entienda perfectamente.
        
        Texto del paciente: "${textoUsuario}"
        
        Instrucciones:
        1. Explica el significado en lenguaje llano y cotidiano en español de España. Evita tecnicismos.
        2. Si menciona medicamentos, explica brevemente para qué suelen servir.
        3. Usa un tono tranquilizador y empático.
        4. Usa formato Markdown (negritas, listas) para facilitar la lectura.
        5. Termina siempre recordando que, ante cualquier duda importante, consulte a su médico.
        
        Responde directamente al paciente.
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
        // Captura de errores mejorada
        const errorData = await response.json().catch(() => ({}));
        const mensajeError = errorData.error?.message || response.statusText;
        throw new Error(`API Error ${response.status}: ${mensajeError}`);
    }

    const json = await response.json();
    
    if (!json.candidates || !json.candidates.length) {
        throw new Error("La IA no devolvió ninguna respuesta.");
    }

    return json.candidates[0].content.parts[0].text;
}