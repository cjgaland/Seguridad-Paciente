document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.flip-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // En móvil, añadimos/quitamos la clase .flipped al tocar
            card.classList.toggle('flipped');
        });
    });
});