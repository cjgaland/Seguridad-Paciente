document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. Quitar activo de todos
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // 2. Activar el actual
            tab.classList.add('active');
            
            const targetId = tab.dataset.target;
            document.getElementById(targetId).classList.add('active');
        });
    });
});