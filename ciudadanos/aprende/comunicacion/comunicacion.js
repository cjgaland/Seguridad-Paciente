function transformCard(card) {
    // Si ya está resuelta, no hacer nada (o resetear si prefieres)
    if (card.classList.contains('solved')) return;

    // Añadir clase de estado
    card.classList.add('solved');

    // Buscar elementos internos
    const effectiveBubble = card.querySelector('.bubble.effective');
    
    // Mostrar la respuesta correcta
    effectiveBubble.classList.remove('hidden');
}