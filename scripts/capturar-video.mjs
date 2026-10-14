import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const carpeta = path.resolve('../tmp/video-semana-7');
await mkdir(carpeta, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const escenas = [];
async function abrir(ruta) {
  await page.goto(`http://127.0.0.1:4200/#/${ruta}`);
  await page.locator('.loading-message').waitFor({ state: 'hidden' });
}
async function escena(titulo, texto) {
  await page.screenshot({ path: path.join(carpeta, `${String(escenas.length + 1).padStart(2, '0')}.png`) });
  escenas.push({ titulo, texto });
}
await abrir('inicio');
await escena('VDL Noticias - Semana 7', 'VDL Noticias es un periódico digital académico de Juan Manuel Renteria Meneses. Esta entrega final continúa el prototipo de la semana cinco y lo implementa en Angular. Conserva su diseño, las ilustraciones y las noticias originales.');
await abrir('noticias');
await escena('Catálogo dinámico', 'El listado carga cuatro noticias desde un archivo JSON local. Cada tarjeta presenta imagen, categoría, título, resumen y enlaces para leer el contenido o guardarlo. Angular reutiliza el mismo componente de tarjeta en las distintas páginas.');
await page.getByRole('button', { name: 'Tecnología', exact: true }).click();
await escena('Filtro por categoría', 'Los botones filtran educación, tecnología, turismo y comercio. Aquí se muestra únicamente tecnología. La categoría queda en la dirección de la página y se conserva al recargar. Todas permite recuperar el catálogo completo.');
await page.getByRole('link', { name: 'Leer más' }).click();
await escena('Detalle de la noticia', 'La vista de detalle usa el identificador de la noticia para mostrar su información completa. Incluye una imagen, varios párrafos y accesos a otras secciones. El botón lateral permite agregar o retirar la noticia de favoritos.');
await page.getByRole('button', { name: 'Guardar en favoritos' }).click();
await abrir('favoritos');
await escena('Favoritos persistentes', 'Favoritos reúne las historias guardadas. Sus identificadores se conservan en el almacenamiento local del navegador, por eso permanecen al recargar. Al quitar la última noticia aparece un estado vacío que invita a explorar el catálogo.');
await abrir('contacto');
await page.getByRole('button', { name: 'Enviar mensaje' }).click();
await escena('Validación de contacto', 'El formulario de contacto utiliza formularios reactivos de Angular. Los campos vacíos muestran errores y el primer campo incorrecto recibe el foco. También se valida el correo electrónico. Una entrada formada solo por espacios no se acepta.');
await page.getByLabel('Nombre completo').fill('Juan Manuel');
await page.getByLabel('Correo electrónico').fill('juan@example.com');
await page.getByLabel('Asunto').selectOption('Proponer una historia');
await page.getByLabel('Mensaje', { exact: true }).fill('Me gustaría compartir una historia de mi comunidad.');
await page.getByRole('button', { name: 'Enviar mensaje' }).click();
await page.locator('form button').scrollIntoViewIfNeeded();
await escena('Confirmación local', 'Al completar datos válidos se muestra una confirmación y se limpia el formulario. Este proyecto es una demostración de front end: el contacto no envía correos ni datos a un servidor. La confirmación lo indica de manera explícita.');
await abrir('gestionar');
await page.getByLabel('Título', { exact: true }).fill('Una nueva historia de la comunidad');
await page.getByLabel('Categoría', { exact: true }).selectOption('Educación');
await page.getByLabel('Imagen de muestra').selectOption('assets/educacion.svg');
await page.getByLabel('Descripción breve').fill('Un espacio para aprender y compartir nuevas ideas.');
await page.getByLabel('Contenido completo').fill('La comunidad organiza un nuevo encuentro educativo.\n\nEsta publicación demuestra la creación local de noticias.');
await page.locator('form button').scrollIntoViewIfNeeded();
await escena('Creación de noticias', 'Gestionar permite crear una noticia con título, categoría, imagen, resumen y contenido. El formulario valida todos los campos. La nueva publicación se guarda localmente y queda disponible en inicio, listado y detalle, incluso después de recargar.');
await page.getByRole('button', { name: 'Crear noticia' }).click();
await page.locator('.manage-row').filter({ hasText: 'Una nueva historia de la comunidad' }).getByRole('button', { name: 'Eliminar' }).click();
await escena('Eliminación con confirmación', 'Antes de borrar una noticia se abre un diálogo de confirmación. Cancelar conserva la publicación. Confirmar la retira del catálogo y de favoritos. El servicio centraliza estos cambios para que las páginas muestren siempre el mismo estado.');
await page.getByRole('button', { name: 'Cancelar' }).click();
await page.setViewportSize({ width: 390, height: 844 });
await abrir('inicio');
await page.getByText('Menú de navegación', { exact: true }).click();
await escena('Diseño móvil y entrega', 'En celular el menú se despliega y el contenido se organiza en una columna. La aplicación fue verificada con ocho pruebas automatizadas y compilada para producción. El entregable incluye código, informe y este video. GitHub Pages permite consultar el proyecto publicado.');
await writeFile(path.join(carpeta, 'escenas.json'), JSON.stringify(escenas, null, 2));
await browser.close();
console.log(`Capturadas ${escenas.length} escenas reales.`);
