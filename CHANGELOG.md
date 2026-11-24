# Historial de versiones

## 2.3.0 — 24/11/2026
- Buscador de protocolos: lector de documentos dentro de la pantalla; los resultados llevan al punto del documento. «Buscar solo en este documento» pasa a un botón aparte.
- Higiene de manos (Ciudadanía): panel propio de los 5 momentos; se retira la infografía con erratas (`Archivo/imagenes_retiradas`).
- Diccionario: 20 textos corregidos (ver `Documentación/Revision_textos_medicos_24_11_2026.md`).
- Ayuda: botones «Ver» y «Descargar» el manual; logotipo en la portada del manual.
- Edición para el SAS sin enlaces externos: `scripts/crear_edicion_sas.sh`.

## 2.2.0 — 24/11/2026
- Rediseño de escritorio (`css/escritorio.css`): las 44 pantallas caben enteras a 1280×720, 1440×900 y 1920×1080, repartidas en columnas. El móvil no cambia.
- Infografías de higiene de manos ampliables.
- Manual de usuario en PDF (se regenera con `Documentación/Manual/fuentes/generar_manual.sh`).

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
