function toggleAccordion(button) {
    // 1. Alternar clase active en el botón
    button.classList.toggle('active');

    // 2. Seleccionar el contenido (el div hermano siguiente)
    const content = button.nextElementSibling;

    // 3. Calcular altura para animar
    if (content.style.maxHeight) {
        // Si está abierto, cerrar
        content.style.maxHeight = null;
    } else {
        // Si está cerrado, abrir (scrollHeight es la altura real del contenido)
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

// Opcional: Abrir el primero por defecto al cargar
document.addEventListener('DOMContentLoaded', () => {
    const firstHeader = document.querySelector('.timeline-header');
    if(firstHeader) {
        // Simular clic para abrir
        toggleAccordion(firstHeader);
    }
});