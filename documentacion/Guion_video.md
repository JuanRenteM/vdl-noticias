# Guion del video - VDL Noticias, semana 7

Video de demostración con capturas de la aplicación real y narración sintética en español.

## 0:00 - VDL Noticias - Semana 7

VDL Noticias es un periódico digital académico de Juan Manuel Renteria Meneses. Esta entrega final continúa el prototipo de la semana cinco y lo implementa en Angular. Conserva su diseño, las ilustraciones y las noticias originales.

## 0:14 - Catálogo dinámico

El listado carga cuatro noticias desde un archivo JSON local. Cada tarjeta presenta imagen, categoría, título, resumen y enlaces para leer el contenido o guardarlo. Angular reutiliza el mismo componente de tarjeta en las distintas páginas.

## 0:30 - Filtro por categoría

Los botones filtran educación, tecnología, turismo y comercio. Aquí se muestra únicamente tecnología. La categoría queda en la dirección de la página y se conserva al recargar. Todas permite recuperar el catálogo completo.

## 0:46 - Detalle de la noticia

La vista de detalle usa el identificador de la noticia para mostrar su información completa. Incluye una imagen, varios párrafos y accesos a otras secciones. El botón lateral permite agregar o retirar la noticia de favoritos.

## 1:00 - Favoritos persistentes

Favoritos reúne las historias guardadas. Sus identificadores se conservan en el almacenamiento local del navegador, por eso permanecen al recargar. Al quitar la última noticia aparece un estado vacío que invita a explorar el catálogo.

## 1:15 - Validación de contacto

El formulario de contacto utiliza formularios reactivos de Angular. Los campos vacíos muestran errores y el primer campo incorrecto recibe el foco. También se valida el correo electrónico. Una entrada formada solo por espacios no se acepta.

## 1:30 - Confirmación local

Al completar datos válidos se muestra una confirmación y se limpia el formulario. Este proyecto es una demostración de front end: el contacto no envía correos ni datos a un servidor. La confirmación lo indica de manera explícita.

## 1:44 - Creación de noticias

Gestionar permite crear una noticia con título, categoría, imagen, resumen y contenido. El formulario valida todos los campos. La nueva publicación se guarda localmente y queda disponible en inicio, listado y detalle, incluso después de recargar.

## 2:01 - Eliminación con confirmación

Antes de borrar una noticia se abre un diálogo de confirmación. Cancelar conserva la publicación. Confirmar la retira del catálogo y de favoritos. El servicio centraliza estos cambios para que las páginas muestren siempre el mismo estado.

## 2:16 - Diseño móvil y entrega

En celular el menú se despliega y el contenido se organiza en una columna. La aplicación fue verificada con ocho pruebas automatizadas y compilada para producción. El entregable incluye código, informe y este video. GitHub Pages permite consultar el proyecto publicado.
