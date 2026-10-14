# VDL Noticias - entrega final, semana 7

Periódico digital académico de Juan Manuel Renteria Meneses para Desarrollo de Front-end, B01 Grupo 22, Politécnico Grancolombiano. Tutor: John Olarte Ramos.

La versión final continúa el prototipo de semana 5: conserva las seis vistas, la identidad visual, las ilustraciones y las cuatro noticias originales. Utiliza Angular 22.2.2, TypeScript, componentes standalone, binding, rutas, formularios reactivos, HttpClient y signals. La versión anterior permanece en `prototipo-semana-5/`.

## Enlaces

- Repositorio: https://github.com/JuanRenteM/vdl-noticias
- Aplicación: https://juanrentem.github.io/vdl-noticias/
- Video: pendiente de adjuntar el enlace de YouTube después de subir el MP4 del entregable.

## Instalar y ejecutar Angular

Requisito: Node.js 24.15.0 o posterior dentro de la rama 24, o Node.js 22.22.3 o posterior dentro de la rama 22. Las versiones compatibles completas están en `package.json`.

```powershell
npm ci
npm start
```

Abre http://127.0.0.1:4200. Si PowerShell bloquea `npm.ps1`, usa `npm.cmd` en los mismos comandos.

```powershell
npm run build
npm run build:pages
```

El primer comando crea producción en `dist/vdl-noticias/browser/`. El segundo usa la base `/vdl-noticias/` y prepara `docs/`, publicada en GitHub Pages desde `main`. Para actualizar el despliegue, ejecuta el segundo comando y sube el código y `docs/` al repositorio.

## Funciones y rutas

| Ruta | Función |
| --- | --- |
| `/#/inicio` | Bienvenida, destacada, tarjetas y llamados a la acción. |
| `/#/noticias` | Catálogo JSON y filtro por las cuatro categorías en la URL. |
| `/#/noticias/:id` | Detalle, imagen, párrafos completos y favoritos. |
| `/#/favoritos` | Lista persistente y estado vacío. |
| `/#/contacto` | Campos obligatorios, correo válido, errores y confirmación local. |
| `/#/gestionar` | Creación y eliminación con confirmación y persistencia. |

Las rutas usan `#` para admitir enlaces directos y recargas en hosting estático. Las rutas desconocidas y los IDs que no existen tienen una vista de recuperación.

## Estructura

```text
src/app/componentes/  Encabezado, pie, tarjeta y campo compartidos
src/app/paginas/      Inicio, noticias, detalle, favoritos, contacto y gestionar
src/app/modelos/      Noticia, categorías e imágenes permitidas
src/app/servicios/    Catálogo, favoritos, carga HTTP y almacenamiento
public/data/         Cuatro noticias de muestra en JSON
public/assets/       Ilustraciones SVG de semana 5
docs/                Compilación publicada por GitHub Pages
tests/               Pruebas de recorridos con Playwright
evidencias/          Capturas reales de escritorio y móvil
documentacion/       Informe, resultados y guion del video
prototipo-semana-5/   Versión HTML/CSS/JavaScript anterior
```

## Datos y alcance

El servicio lee el JSON con HttpClient y recupera el catálogo editado de `localStorage`. Mantiene las claves `vdl-noticias-catalogo` y `vdl-noticias-favoritos` de semana 5; recupera datos previos si se abre en el mismo origen y navegador. Un origen distinto tiene su propio almacenamiento. El catálogo vacío es válido. Los datos guardados con formato incorrecto se descartan y se recuperan las noticias iniciales.

Crear o eliminar actualiza las vistas. Eliminar retira también la noticia de favoritos. Las operaciones avisan si no se puede guardar. Para recuperar el catálogo inicial, elimina ambas claves desde las herramientas del navegador y recarga.

El contacto solo valida y confirma; no envía correo ni datos. No hay cuentas, autenticación, backend ni base de datos. Las noticias y el correo son de muestra. Los cambios se guardan únicamente en ese navegador y origen.

## Verificación

Con la aplicación ejecutándose en otra terminal:

```powershell
npx playwright install chromium
npm run test:e2e
```

Las pruebas cubren filtros, enlaces directos, persistencia, contacto inválido y válido, creación, cancelación y confirmación al borrar, limpieza de favoritos, datos inválidos, catálogo vacío, error HTTP y reintento, almacenamiento bloqueado y navegación móvil. Generan capturas en `evidencias/`. Para otro servidor, define `E2E_BASE_URL`.

## Abrir el prototipo de semana 5

```powershell
cd prototipo-semana-5
py -m http.server 8000
```

Abre http://localhost:8000.

## Referencias técnicas

- Angular. Instalación: https://angular.dev/installation
- Angular. Componentes: https://angular.dev/guide/components
- Angular. Routing: https://angular.dev/guide/routing
- Angular. Formularios reactivos: https://angular.dev/guide/forms/reactive-forms
- MDN. localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

Guía académica: *Orientaciones para las entregas del módulo Front End*, agosto de 2026, de John Olarte Ramos. El informe final describe funcionamiento, tecnologías, conclusiones y referencias.

## Incorporar el enlace de YouTube al PDF

El ZIP incluye el video narrado, de aproximadamente 2:34. Después de subirlo a YouTube, regenera el PDF con la URL real desde la carpeta del proyecto:

```powershell
py -m pip install -r documentacion/requirements.txt
py scripts/generar_informe.py --video-url "https://www.youtube.com/watch?v=IDENTIFICADOR_REAL"
```

El comando actualiza `documentacion/VDL_Noticias_Entrega_Semana_7.pdf` y el informe editable. El generador utiliza las fuentes de Windows, las capturas y el logo incluidos. El enlace debe ser público o no listado y permitir la consulta del tutor.
