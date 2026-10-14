# Verificación de la semana 7

Fecha: 13 de octubre de 2026, hora de Colombia.

La aplicación se compiló para producción con Angular 22.2.2 y Node.js 24.15.0. Los archivos iniciales suman 346,49 kB; Angular CLI estima 89,84 kB para transferencia comprimida.

Se ejecutaron ocho recorridos de Playwright en Chromium contra el servidor local y contra https://juanrentem.github.io/vdl-noticias/. Resultado: **8 aprobados en cada entorno**.

1. Catálogo, cuatro categorías, filtro persistente en la URL, detalle, recarga y rutas desconocidas.
2. Favoritos: guardar, recargar, retirar y estado vacío.
3. Contacto: vacíos, espacios, correo inválido, foco en el primer error y confirmación local.
4. Gestión: creación, persistencia, contenido como texto, cancelar y confirmar borrado, y limpieza de favoritos.
5. Recuperación de datos locales inválidos y conservación de un catálogo intencionalmente vacío.
6. Fallo HTTP, creación deshabilitada y reintento satisfactorio.
7. Escritura en localStorage bloqueada: error visible y favorito sin falso éxito.
8. Menú móvil, capturas de las seis vistas y ausencia de desplazamiento horizontal a 390 píxeles en inicio, listado, contacto y gestión.

Las capturas en `evidencias/` proceden de la versión Angular publicada. El informe incluye imágenes reales, no mockups. El sitio devuelve HTTP 200 y usa `main/docs` en GitHub Pages.

La verificación se limita a Chromium y a tamaños de ventana simulados. No se declara compatibilidad exhaustiva con todos los navegadores, dispositivos físicos o tecnologías de asistencia.

El video adjunto utiliza diez escenas reales y narración sintética en español. Su duración es aproximadamente 2 minutos y 34 segundos. El enlace de YouTube debe adjuntarse después de subirlo; no se inventó una URL.
