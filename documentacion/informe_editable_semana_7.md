# VDL Noticias - Aplicación Angular

Entrega 3 - Semana 7
Juan Manuel Renteria Meneses
Politécnico Grancolombiano
Desarrollo de Front-end - B01 Grupo 22
Tutor: John Olarte Ramos
13 de octubre de 2026

## Resumen

Este informe presenta la entrega final de VDL Noticias, un periódico digital de muestra sobre educación, tecnología, turismo y comercio. La aplicación continúa el prototipo de la semana 5 y conserva sus pantallas, estilos, ilustraciones y datos. La versión final utiliza Angular para organizar la navegación, los componentes reutilizables, la carga del catálogo y los formularios. El usuario puede consultar y filtrar noticias, leer su contenido completo, guardar favoritos, validar un formulario de contacto y crear o eliminar publicaciones locales. La implementación se verificó con ocho pruebas automatizadas en Chromium y se desplegó en GitHub Pages. El entregable incluye el código fuente, la compilación estática, capturas reales y un video explicativo de menos de tres minutos. El contacto no transmite información; los cambios del catálogo y los favoritos pertenecen al navegador y origen donde se realizan.

## Contenido

## Introducción

VDL Noticias propone una experiencia sencilla para descubrir historias, consultar su información y conservar lecturas de interés. Los mockups de la semana 3 definieron la identidad visual y la semana 5 convirtió esa propuesta en un prototipo funcional con HTML, CSS y JavaScript. La semana 7 desarrolla la misma experiencia en Angular y publica una versión de producción accesible desde un navegador.

La guía del módulo solicita una aplicación funcional, implementación básica de Angular, código organizado, despliegue, documentación final y un video explicativo de máximo tres minutos (Olarte Ramos, 2026). El informe describe cómo se implementaron las funciones y presenta las evidencias de verificación.

### Objetivo general

Completar y desplegar VDL Noticias como una aplicación Angular que mantenga la propuesta de la semana 5 y permita demostrar componentes, binding, navegación, formularios y persistencia local.

### Objetivos específicos

Organizar las vistas en componentes reutilizables y centralizar el catálogo y los favoritos en un servicio tipado.

Conservar la consulta, filtros, detalle, favoritos y validaciones; implementar creación y eliminación de publicaciones con confirmación.

Verificar los recorridos en escritorio y móvil, compilar para producción y documentar los enlaces del repositorio y la aplicación.

## Continuidad con la semana 5

El trabajo se realizó en el mismo repositorio. La carpeta prototipo-semana-5 conserva la versión anterior. La aplicación Angular reutiliza las cuatro noticias del JSON, las ilustraciones SVG y los estilos globales, incluida la paleta verde salvia y beige, la tipografía editorial, las tarjetas y las reglas para pantallas pequeñas.

Las claves vdl-noticias-catalogo y vdl-noticias-favoritos se mantienen para recuperar los datos anteriores cuando la aplicación se abre en el mismo origen y navegador. Un sitio publicado y un servidor local tienen almacenamientos separados. Los mockups y las pantallas previas sirvieron como referencia; las figuras de este informe son capturas de la aplicación Angular real.

| Semana 5 | Semana 7 |
| Archivos HTML por vista | Componentes y rutas de Angular para las mismas seis vistas. |
| Renderizado mediante JavaScript | Interpolación, binding de propiedades, eventos y bloques @if y @for. |
| Fetch para el JSON | HttpClient y servicio central de noticias. |
| Validación manual de campos | Formularios reactivos con validadores y errores accesibles. |
| Estado global y localStorage | Signals, valores derivados y persistencia en las mismas claves. |

## Tecnologías y arquitectura

Se utilizó Angular 22.2.2 con TypeScript y Angular CLI. Los componentes reúnen clase y plantilla (Angular, s. f.-a). Encabezado, pie, tarjeta y campo se comparten entre vistas. Angular Router selecciona la página y permite navegar mediante enlaces internos (Angular, s. f.-c).

NoticiasService carga el JSON con HttpClient, valida los datos y centraliza catálogo y favoritos. Signals y computed mantienen el estado y las listas derivadas. La interfaz Noticia tipa las publicaciones. localStorage conserva los datos del origen entre sesiones (MDN contributors, s. f.); si una operación no se puede guardar, se muestra un error.

Contacto y gestión declaran sus controles y validaciones con formularios reactivos (Angular, s. f.-b). Los validadores rechazan vacíos, espacios, correos inválidos y opciones ajenas a las listas permitidas. Las plantillas asocian los errores a cada control.

| Carpeta o archivo | Responsabilidad |
| src/app/componentes/ | Encabezado, pie, tarjeta y campo de formulario. |
| src/app/paginas/ | Vistas, formularios y validadores de la aplicación. |
| src/app/servicios/ | Carga HTTP, catálogo, favoritos y almacenamiento. |
| src/app/modelos/ | Interfaz de noticia y opciones permitidas. |
| public/data/ y public/assets/ | Catálogo JSON e ilustraciones de semana 5. |
| tests/ y evidencias/ | Pruebas de recorridos y capturas reales. |
| docs/ | Versión de producción publicada en GitHub Pages. |

## Funcionamiento del aplicativo

### Inicio y navegación

El inicio presenta la bienvenida, una noticia destacada y las demás historias en tarjetas. El encabezado permite acceder a las cinco secciones principales y el pie muestra información general. Los llamados a la acción conducen al detalle, al catálogo o al contacto. Si no quedan publicaciones, se muestra un mensaje en lugar de una noticia vacía.

Figura 1. Página de inicio en Angular
Nota. Captura real de la aplicación. Se mantiene la composición y la identidad visual del prototipo de semana 5.

### Listado y filtro por categoría

Noticias muestra el catálogo dinámico con imagen, título, categoría, resumen y las acciones de lectura y favorito. Los botones permiten filtrar Educación, Tecnología, Turismo o Comercio. Todas restaura el catálogo. El filtro se guarda en la URL y permanece al recargar. Cuando no hay resultados se informa al lector.

Figura 2. Catálogo de noticias
Nota. Las tarjetas se generan a partir del catálogo; no se duplican páginas por categoría.

### Detalle de la noticia

Cada tarjeta abre una ruta con el identificador de la publicación. El detalle presenta el título, resumen, imagen y contenido separado en párrafos. Incluye acciones para guardar o quitar favoritos y enlaces para continuar la navegación. Los identificadores inexistentes muestran una invitación a consultar el listado.

Figura 3. Vista de detalle
Nota. El componente reutiliza la misma plantilla para las cuatro noticias originales y las creadas por el usuario.

### Favoritos

Guardar en favoritos registra el identificador de una noticia en localStorage. La lista se recupera al recargar el sitio en el mismo navegador. Quitar de favoritos actualiza el estado del botón y la lista. Si se elimina una noticia desde gestión, también se retira de favoritos. La vista vacía ofrece un enlace para explorar nuevas historias.

Figura 4. Estado vacío de favoritos
Nota. Captura del estado inicial. El recorrido automatizado verificó también guardar, recargar y retirar noticias.

### Contacto

El formulario incluye nombre, correo electrónico, asunto y mensaje. Los campos obligatorios y el correo inválido producen errores junto a los controles; aria-invalid y aria-describedby relacionan el estado y la ayuda con cada campo. Al enviar datos válidos, el formulario se limpia y confirma localmente. La aplicación informa que no envía datos a un servidor.

Figura 5. Formulario de contacto
Nota. Formulario reactivo con etiquetas asociadas a los controles. La confirmación es una demostración local.

### Gestión de noticias

Gestionar permite crear una publicación con título, categoría, imagen de muestra, resumen y contenido. Las categorías e imágenes se seleccionan de las opciones incluidas en el proyecto. Al guardar, el servicio actualiza el catálogo y lo conserva localmente. Antes de eliminar, un diálogo identifica la noticia y permite confirmar o cancelar. Cancelar conserva la publicación; confirmar la retira del catálogo y de favoritos.

Figura 6. Formulario y lista de publicaciones
Nota. La creación y eliminación fueron verificadas con recarga del navegador. Las operaciones afectan únicamente al catálogo local.

## Diseño adaptable y accesibilidad

Las reglas CSS de semana 5 se reutilizaron en Angular. En ventanas de hasta 700 píxeles, la navegación se convierte en un menú desplegable y las tarjetas, artículos y formularios pasan a una columna. Se verificó que las vistas de inicio, listado, contacto y gestión no producen desplazamiento horizontal a 390 píxeles de ancho.

La interfaz incluye enlaces para saltar al contenido, foco visible, textos alternativos en imágenes, encabezados semánticos y mensajes de estado. Los botones de filtro y favoritos exponen su selección mediante aria-pressed. El diálogo de eliminación usa el elemento nativo dialog. Estas mejoras se verificaron en los recorridos principales; no se realizó una auditoría integral de accesibilidad.

Figura 7. Navegación e inicio en móvil
Nota. Captura real a 390 x 844 píxeles. El menú permite acceder a las mismas secciones de escritorio.

## Ejecución y despliegue

Para desarrollar o compilar se requiere una versión de Node.js compatible con Angular 22.2.2. Se recomienda Node.js 24.15.0 o posterior dentro de esa rama. Se conservan package.json y package-lock.json para instalar las mismas dependencias mediante npm ci. Angular publica los requisitos de instalación en su documentación (Angular, s. f.-d).

El servidor de desarrollo abre la aplicación en http://127.0.0.1:4200. La compilación general queda en dist/vdl-noticias/browser. El comando build:pages configura la base /vdl-noticias/ y copia la compilación a docs. GitHub Pages publica esa carpeta desde la rama main. La dirección pública fue comprobada con respuesta HTTP 200 y con las pruebas de navegación y funcionamiento.

Repositorio del código fuente: https://github.com/JuanRenteM/vdl-noticias

Aplicación desplegada: https://juanrentem.github.io/vdl-noticias/

El repositorio conserva la etapa de semana 5 y contiene la implementación Angular, las instrucciones, las capturas y la documentación final. El ZIP del entregable agrega el PDF y el MP4 para facilitar su descarga y envío. Se excluyen node_modules, archivos temporales y credenciales.

## Alcance y limitaciones

La aplicación demuestra funciones de front-end con contenido de muestra. No tiene cuentas, autenticación, backend ni base de datos compartida. Las publicaciones y los favoritos se conservan en un único navegador y origen; otros visitantes reciben el catálogo inicial. El formulario de contacto no transmite información. El contenido de las noticias y las ilustraciones son ejemplos académicos.

La eliminación modifica la copia local y no borra el JSON ni el código publicado. Para iniciar de nuevo, se pueden eliminar las dos claves de VDL Noticias desde las herramientas del navegador. Las páginas muestran estados de carga, error, ausencia de contenido y rutas no encontradas para orientar al usuario.

## Conclusiones

La implementación final convierte el prototipo de la semana 5 en una aplicación Angular funcional que conserva su identidad visual y sus recorridos. Los componentes compartidos y el servicio de noticias organizan el código, mientras que el binding y los valores derivados mantienen actualizadas las vistas durante las interacciones.

El catálogo JSON, los favoritos y la gestión local permiten demostrar lectura y modificación de información sin infraestructura adicional. Los formularios reactivos incorporan validaciones, errores asociados a los controles y confirmaciones coherentes con el alcance del proyecto.

Las ocho pruebas aprobadas en el servidor local y en el sitio público aportan evidencia de los recorridos principales. GitHub Pages hace accesible la versión de producción y el repositorio conserva tanto la etapa previa como el desarrollo final. La documentación y el video preparado explican su funcionamiento y sus límites.

## Referencias

Angular. (s. f.-a). Anatomy of a component. Recuperado el 13 de octubre de 2026, de https://angular.dev/guide/components

Angular. (s. f.-b). Reactive forms. Recuperado el 13 de octubre de 2026, de https://angular.dev/guide/forms/reactive-forms

Angular. (s. f.-c). Angular routing. Recuperado el 13 de octubre de 2026, de https://angular.dev/guide/routing

Angular. (s. f.-d). Installation. Recuperado el 13 de octubre de 2026, de https://angular.dev/installation

MDN contributors. (s. f.). Window: localStorage property. Recuperado el 13 de octubre de 2026, de https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

Olarte Ramos, J. (2026, agosto). Orientaciones para las entregas del módulo Front End [Guía del curso]. Politécnico Grancolombiano.
