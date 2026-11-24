document.addEventListener('DOMContentLoaded', () => {
    
    const checkboxes = document.querySelectorAll('.chk-task');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressMsg = document.getElementById('progress-msg');
    const successCard = document.getElementById('success-card');
    const checklistContainer = document.querySelector('.checklist-container');

    const totalTasks = checkboxes.length;

    // Mensajes motivacionales según %
    function updateMessage(percent) {
        if (percent === 0) return "¡Empecemos a preparar la mochila!";
        if (percent < 50) return "Bien, sigue así...";
        if (percent < 100) return "¡Ya casi lo tienes!";
        return "¡Perfecto! Todo listo.";
    }

    function updateProgress() {
        const checkedCount = document.querySelectorAll('.chk-task:checked').length;
        const percent = Math.round((checkedCount / totalTasks) * 100);

        // Actualizar barra
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
        
        // Color dinámico
        if (percent < 50) progressFill.style.backgroundColor = "#3b82f6"; // Azul
        else if (percent < 100) progressFill.style.backgroundColor = "#f59e0b"; // Naranja
        else progressFill.style.backgroundColor = "#10b981"; // Verde

        progressMsg.textContent = updateMessage(percent);

        // Fin del juego
        if (percent === 100) {
            setTimeout(() => {
                checklistContainer.style.display = 'none';
                successCard.classList.remove('hidden');
                // Scroll suave al mensaje
                successCard.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }

    // Listeners
    checkboxes.forEach(chk => {
        chk.addEventListener('change', updateProgress);
    });
});