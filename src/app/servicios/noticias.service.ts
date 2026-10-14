import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CATEGORIAS, IMAGENES, Noticia, NuevaNoticia } from '../modelos/noticia';

const CATALOGO = 'vdl-noticias-catalogo';
const FAVORITOS = 'vdl-noticias-favoritos';

function esNoticia(value: unknown): value is Noticia {
  if (!value || typeof value !== 'object') return false;
  const n = value as Noticia;
  return ['id', 'titulo', 'resumen', 'contenido', 'textoAlternativo'].every(key => typeof (n as unknown as Record<string, unknown>)[key] === 'string')
    && !!n.id && !!n.titulo.trim() && CATEGORIAS.includes(n.categoria)
    && IMAGENES.includes(n.imagen as typeof IMAGENES[number]) && typeof n.destacada === 'boolean';
}

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly catalogo = signal<Noticia[]>([]);
  private readonly ids = signal<string[]>([]);
  readonly noticias = this.catalogo.asReadonly();
  readonly favoritos = computed(() => this.noticias().filter(n => this.ids().includes(n.id)));
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly aviso = signal('');

  constructor() { this.cargar(); }

  // Reuses week 5 keys so existing catalog changes and favorites survive migration.
  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.http.get<unknown>('data/noticias.json').subscribe({
      next: data => {
        if (!Array.isArray(data) || !data.every(esNoticia)) {
          this.falloCarga();
          return;
        }
        let catalogo: Noticia[] = data;
        let ids: string[] = [];
        try {
          const raw = localStorage.getItem(CATALOGO);
          if (raw !== null) {
            const saved: unknown = JSON.parse(raw);
            if (Array.isArray(saved) && saved.every(esNoticia) && new Set(saved.map(n => n.id)).size === saved.length) catalogo = saved;
            else this.aviso.set('El catálogo guardado no era válido. Se cargaron las noticias originales.');
          }
        } catch { this.aviso.set('No se pudo leer el catálogo guardado. Se cargaron las noticias originales.'); }
        try {
          const saved: unknown = JSON.parse(localStorage.getItem(FAVORITOS) ?? '[]');
          if (Array.isArray(saved)) ids = [...new Set(saved.filter((id): id is string => typeof id === 'string'))];
        } catch { this.aviso.set('No se pudieron recuperar los favoritos guardados.'); }
        this.catalogo.set(catalogo);
        this.ids.set(ids.filter(id => catalogo.some(n => n.id === id)));
        this.cargando.set(false);
      },
      error: () => this.falloCarga()
    });
  }

  private falloCarga(): void {
    this.error.set('No fue posible cargar las noticias. Comprueba la conexión y vuelve a intentar.');
    this.cargando.set(false);
  }

  esFavorita(id: string): boolean { return this.ids().includes(id); }

  alternarFavorito(id: string): void {
    if (!this.noticias().some(n => n.id === id)) return;
    const estaba = this.esFavorita(id);
    const ids = estaba ? this.ids().filter(i => i !== id) : [...this.ids(), id];
    try {
      localStorage.setItem(FAVORITOS, JSON.stringify(ids));
      this.ids.set(ids);
      this.aviso.set(estaba ? 'Noticia retirada de favoritos.' : 'Noticia guardada en favoritos.');
    } catch { this.aviso.set('No se pudo guardar el favorito. Revisa el almacenamiento del navegador.'); }
  }

  crear(datos: NuevaNoticia): boolean {
    if (this.cargando() || this.error()) return false;
    const noticia: Noticia = {
      ...datos,
      titulo: datos.titulo.trim(), resumen: datos.resumen.trim(), contenido: datos.contenido.trim(),
      id: `noticia-${crypto.randomUUID()}`,
      textoAlternativo: `Ilustración de ${datos.categoria.toLowerCase()}`, destacada: false
    };
    return this.guardar([...this.noticias(), noticia]);
  }

  eliminar(id: string): boolean {
    const catalogo = this.noticias().filter(n => n.id !== id);
    if (catalogo.length === this.noticias().length || !this.guardar(catalogo)) return false;
    const ids = this.ids().filter(i => i !== id);
    this.ids.set(ids);
    try { localStorage.setItem(FAVORITOS, JSON.stringify(ids)); }
    catch { this.aviso.set('La noticia fue eliminada. No se pudo actualizar el almacenamiento de favoritos.'); }
    return true;
  }

  private guardar(catalogo: Noticia[]): boolean {
    try {
      localStorage.setItem(CATALOGO, JSON.stringify(catalogo));
      this.catalogo.set(catalogo);
      return true;
    } catch {
      this.aviso.set('No se pudo guardar el catálogo. Revisa el almacenamiento del navegador.');
      return false;
    }
  }
}
