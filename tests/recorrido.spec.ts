import { test, expect, Page } from '@playwright/test';

async function abrir(page: Page, ruta = 'inicio') {
  await page.goto(`./#/${ruta}`);
  await expect(page.getByText('Cargando noticias...', { exact: true })).toHaveCount(0);
}

test('catálogo, categorías, detalle y enlaces directos', async ({ page }) => {
  const errores: string[] = [];
  page.on('pageerror', error => errores.push(error.message));
  await abrir(page);
  await expect(page.locator('.featured')).toBeVisible();
  await expect(page.locator('app-tarjeta')).toHaveCount(3);
  await abrir(page, 'noticias');
  await expect(page.locator('app-tarjeta')).toHaveCount(4);
  for (const categoria of ['Educación', 'Tecnología', 'Turismo', 'Comercio']) {
    await page.getByRole('button', { name: categoria, exact: true }).click();
    await expect(page.locator('app-tarjeta')).toHaveCount(1);
    await expect(page.locator('app-tarjeta .category')).toHaveText(categoria);
    await page.reload();
    await expect(page.locator('app-tarjeta')).toHaveCount(1);
  }
  await page.getByRole('button', { name: 'Todas', exact: true }).click();
  await expect(page.locator('app-tarjeta')).toHaveCount(4);
  const titulo = await page.locator('app-tarjeta h3').first().innerText();
  await page.getByRole('link', { name: 'Leer más' }).first().click();
  await expect(page.locator('h1')).toHaveText(titulo);
  await expect(page.locator('.article-body p')).not.toHaveCount(0);
  await page.reload();
  await expect(page.locator('h1')).toHaveText(titulo);
  await abrir(page, 'noticias/no-existe');
  await expect(page.getByRole('heading', { name: 'No encontramos esa noticia' })).toBeVisible();
  await abrir(page, 'ruta-inexistente');
  await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
  expect(errores).toEqual([]);
});

test('favoritos persistentes, quitar y estado vacío', async ({ page }) => {
  await abrir(page, 'favoritos');
  await expect(page.getByRole('heading', { name: 'Todavía no tienes favoritos' })).toBeVisible();
  await abrir(page, 'noticias');
  await page.getByRole('button', { name: 'Guardar en favoritos' }).first().click();
  await abrir(page, 'favoritos');
  await expect(page.locator('app-tarjeta')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('app-tarjeta')).toHaveCount(1);
  await page.getByRole('button', { name: 'Quitar de favoritos' }).click();
  await expect(page.locator('app-tarjeta')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Todavía no tienes favoritos' })).toBeVisible();
});

test('contacto rechaza vacíos y correo incorrecto y confirma localmente', async ({ page }) => {
  await abrir(page, 'contacto');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText('Este campo es obligatorio.')).toHaveCount(4);
  await expect(page.getByLabel('Nombre completo')).toBeFocused();
  await page.getByLabel('Nombre completo').fill('   ');
  await page.getByLabel('Correo electrónico').fill('correo-invalido');
  await page.getByLabel('Asunto').selectOption('Proponer una historia');
  await page.getByLabel('Mensaje', { exact: true }).fill('Una historia para el portal.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText('Escribe un correo electrónico válido.')).toBeVisible();
  await page.getByLabel('Nombre completo').fill('Juan Manuel');
  await page.getByLabel('Correo electrónico').fill('juan@example.com');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText('¡Gracias! El formulario es válido.', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Nombre completo')).toHaveValue('');
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
});

test('crear, persistir, cancelar eliminación y retirar favorito al eliminar', async ({ page }) => {
  await abrir(page, 'gestionar');
  await page.getByRole('button', { name: 'Crear noticia' }).click();
  await expect(page.getByText('Este campo es obligatorio.')).toHaveCount(5);
  const titulo = 'Nueva historia de prueba <script>texto</script>';
  await page.getByLabel('Título', { exact: true }).fill(titulo);
  await page.getByLabel('Categoría', { exact: true }).selectOption('Tecnología');
  await page.getByLabel('Imagen de muestra').selectOption('assets/tecnologia.svg');
  await page.getByLabel('Descripción breve').fill('Resumen de una nueva noticia.');
  await page.getByLabel('Contenido completo').fill('Primer párrafo.\n\nSegundo párrafo.');
  await page.getByRole('button', { name: 'Crear noticia' }).click();
  await expect(page.locator('.manage-row')).toHaveCount(5);
  await page.reload();
  await expect(page.locator('.manage-row')).toHaveCount(5);
  await abrir(page, 'noticias');
  const tarjeta = page.locator('app-tarjeta').filter({ hasText: titulo });
  await tarjeta.getByRole('button', { name: 'Guardar en favoritos' }).click();
  await tarjeta.getByRole('link', { name: 'Leer más' }).click();
  await expect(page.locator('h1')).toHaveText(titulo);
  await expect(page.locator('.article-body p')).toHaveCount(2);
  await abrir(page, 'gestionar');
  const fila = page.locator('.manage-row').filter({ hasText: titulo });
  await fila.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(fila).toBeVisible();
  await fila.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Eliminar', exact: true }).click();
  await expect(page.locator('.manage-row')).toHaveCount(4);
  await page.reload();
  await expect(page.locator('.manage-row')).toHaveCount(4);
  await abrir(page, 'favoritos');
  await expect(page.locator('app-tarjeta')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('vdl-noticias-favoritos') || '[]'))).toEqual([]);
});

test('recuperación de almacenamiento inválido y catálogo vacío', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vdl-noticias-catalogo', '[{"titulo":"incompleta"}]');
    localStorage.setItem('vdl-noticias-favoritos', '{invalido');
  });
  await abrir(page, 'noticias');
  await expect(page.locator('app-tarjeta')).toHaveCount(4);
  await page.evaluate(() => localStorage.setItem('vdl-noticias-catalogo', '[]'));
  // Use a new context page without the init script to check intentional empty catalogs.
  const nueva = await page.context().newPage();
  await nueva.goto('./#/inicio');
  await nueva.evaluate(() => localStorage.setItem('vdl-noticias-catalogo', '[]'));
  await nueva.reload();
  // Init script is page-specific; new page retains the explicitly empty catalog.
  await expect(nueva.getByText('Todavía no hay noticias publicadas.')).toBeVisible();
  await nueva.close();
});

test('error de carga y reintento', async ({ page }) => {
  await page.route('**/data/noticias.json', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await abrir(page, 'gestionar');
  await expect(page.getByRole('alert')).toContainText('No fue posible cargar las noticias');
  await expect(page.getByRole('button', { name: 'Crear noticia' })).toBeDisabled();
  await page.unroute('**/data/noticias.json');
  await page.getByRole('button', { name: 'Volver a intentar' }).click();
  await expect(page.locator('.manage-row')).toHaveCount(4);
});

test('almacenamiento bloqueado no simula favoritos guardados', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Sin espacio', 'QuotaExceededError'); };
  });
  await abrir(page, 'noticias');
  await page.getByRole('button', { name: 'Guardar en favoritos' }).first().click();
  await expect(page.getByText('No se pudo guardar el favorito.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Quitar de favoritos' })).toHaveCount(0);
});

test('navegación móvil y capturas de las seis vistas reales', async ({ page }) => {
  await abrir(page);
  await page.screenshot({ path: 'evidencias/inicio-escritorio.png', fullPage: true });
  for (const ruta of ['noticias', 'favoritos', 'contacto', 'gestionar']) {
    await abrir(page, ruta);
    await page.screenshot({ path: `evidencias/${ruta}-escritorio.png`, fullPage: true });
  }
  await abrir(page, 'noticias');
  await page.getByRole('link', { name: 'Leer más' }).first().click();
  await page.screenshot({ path: 'evidencias/detalle-escritorio.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const ruta of ['inicio', 'noticias', 'contacto', 'gestionar']) {
    await abrir(page, ruta);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `evidencias/${ruta}-movil.png`, fullPage: true });
  }
  await page.getByText('Menú de navegación', { exact: true }).click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('link', { name: 'Favoritos' }).click();
  await expect(page.locator('h1')).toHaveText('Para volver a leer.');
  await expect(page.locator('details')).not.toHaveAttribute('open');
});
