document.addEventListener("DOMContentLoaded", () => {
    const btnProfesionales = document.getElementById("btnProfesionales");
    const btnCiudadanos = document.getElementById("btnCiudadanos");

    if (btnProfesionales) {
        btnProfesionales.addEventListener("click", () => {
            window.location.href = "profesionales.html";
        });
    }

    if (btnCiudadanos) {
        btnCiudadanos.addEventListener("click", () => {
            window.location.href = "ciudadanos.html";
        });
    }
});
