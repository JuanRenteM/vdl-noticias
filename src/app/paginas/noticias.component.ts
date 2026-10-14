import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CATEGORIAS } from '../modelos/noticia';
import { TarjetaComponent } from '../componentes/tarjeta.component';
import { NoticiasService } from '../servicios/noticias.service';

@Component({
  selector: 'app-noticias', imports: [TarjetaComponent],
  template: `<p class="eyebrow">Historias para descubrir</p><h1>Noticias que nos conectan.</h1>
    <p class="lead">Explora educación, tecnología, turismo y comercio.</p>
    <div class="category-list" role="group" aria-label="Filtrar por categoría">
      @for (categoria of categorias; track categoria) {
        <button class="category-chip" [attr.aria-pressed]="seleccionada() === categoria" (click)="filtrar(categoria)">{{ categoria || 'Todas' }}</button>
      }
    </div>
    <div class="section-heading listing-heading"><h2>{{ seleccionada() || 'Todas las historias' }}</h2><p class="small" role="status">{{ visibles().length }} noticias</p></div>
    <section class="listing-grid" aria-label="Listado de noticias">
      @for (noticia of visibles(); track noticia.id) { <app-tarjeta [noticia]="noticia" [listado]="true" /> }
    </section>
    @if (!datos.cargando() && !datos.error() && !visibles().length) { <p class="empty-panel">No hay noticias en esta categoría por ahora.</p> }`
})
export class NoticiasComponent {
  readonly datos = inject(NoticiasService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly parametros = toSignal(this.ruta.queryParamMap, { initialValue: this.ruta.snapshot.queryParamMap });
  readonly categorias: readonly string[] = ['', ...CATEGORIAS];
  readonly seleccionada = computed(() => {
    const categoria = this.parametros().get('categoria') ?? '';
    return this.categorias.includes(categoria) ? categoria : '';
  });
  readonly visibles = computed(() => this.datos.noticias().filter(n => !this.seleccionada() || n.categoria === this.seleccionada()));
  filtrar(categoria: string): void { void this.router.navigate([], { relativeTo: this.ruta, queryParams: { categoria: categoria || null } }); }
}
