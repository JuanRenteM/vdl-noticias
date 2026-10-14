import { cp, mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.resolve(root, 'docs');
const origen = path.resolve(root, 'dist/vdl-noticias/browser');
if (destino !== path.join(root, 'docs') || !destino.startsWith(root + path.sep)) throw new Error('Directorio de publicación inválido.');
await mkdir(destino, { recursive: true });
// Remove only previous generated bundles within the verified publication directory.
for (const archivo of await readdir(destino)) {
  if (/^(main|styles|chunk)-[A-Z0-9]+\.(js|css)$/.test(archivo)) await unlink(path.join(destino, archivo));
}
await cp(origen, destino, { recursive: true });
await writeFile(path.join(destino, '.nojekyll'), '');
console.log('Compilación preparada en docs/ para GitHub Pages.');
