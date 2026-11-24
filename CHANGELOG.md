# Historial de versiones

## 2.1.0 — 24/11/2026
- Ordenador: la página no se desplaza (cabecera fija; solo se mueve la caja de contenido). Juegos de imagen en dos columnas.
- Imágenes optimizadas: de 28 MB a 8,5 MB (originales en `Archivo/imagenes_originales`).
- Accesibilidad común (`js/core/accesibilidad.js`): teclado, saltar al contenido, foco visible, textos alternativos, contraste.
- Página `ayuda/legal.html`: aviso legal, privacidad y declaración de accesibilidad (texto provisional).
- Móvil: corregidos los desbordes laterales.
- Manual de usuario descargable desde la Ayuda.
- Fusión con la versión publicada en GitHub (nov. 2025): se conservan sus mejoras (panel Aprende de Ciudadanía, estadísticas, tema de Ciudadanía) y se retiran sus funciones de IA (asistente de ciudadanía y analistas de estadísticas).

## 2.0.0 — 24/11/2026
- Retirada por completo la Inteligencia Artificial (asistente de protocolos, analista de incidentes, traductor) y su clave de API.
- Nuevas herramientas sin IA: Diccionario de términos médicos, Guía de análisis de incidentes, Buscador de protocolos y documentos.
- Puntuaciones y encuestas guardadas solo en el dispositivo (`js/core/almacen.js`), con modo remoto preparado para un servidor del SAS. Se elimina Firebase.
- Arreglados los juegos «Adivina la medicina», «Semáforo» y «La mochila» (no arrancaban por una ruta errónea).
- Corregidos 153 enlaces rotos a logos e iconos. Errata «Branden» → «Braden».
- Nuevo bloque de Ayuda (manual, versiones, privacidad) y aviso de nueva versión.
- Proyecto reordenado: App / Documentación / Multimedia / Archivo / Backup.

## 1.0.0 — 25/11/2025
- Primera versión: itinerarios Aprende · Practica · Juega para Profesionales y Ciudadanía.
