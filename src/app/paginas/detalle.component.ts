import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NoticiasService } from '../servicios/noticias.service';

@Component({
  selector: 'app-detalle', imports: [RouterLink],
  template: `@if (noticia(); as n) {
    <p class="breadcrumb"><a routerLink="/noticias">Noticias</a> <span aria-hidden="true">/</span> {{ n.categoria }}</p>
    <div class="article-layout"><article class="article-content"><p class="category">{{ n.categoria }}</p><h1>{{ n.titulo }}</h1>
      <p class="article-summary">{{ n.resumen }}</p><img class="article-image" [src]="n.imagen" [alt]="n.textoAlternativo">
      <div class="article-body">@for (parrafo of parrafos(); track $index) { <p>{{ parrafo }}</p> }</div>
    </article><aside class="article-sidebar"><h2>Continúa explorando</h2><p>Descubre más historias de educación, tecnología, turismo y comercio.</p>
      <button class="favorite-button" [class.is-saved]="datos.esFavorita(n.id)" [attr.aria-pressed]="datos.esFavorita(n.id)" (click)="datos.alternarFavorito(n.id)">{{ datos.esFavorita(n.id) ? 'Quitar de favoritos' : 'Guardar en favoritos' }}</button>
      <a class="button" routerLink="/noticias">Ver todas las noticias</a><a class="text-link" routerLink="/contacto">Comparte una idea</a>
    </aside></div>
  } @else if (!datos.cargando() && !datos.error()) {
    <div class="empty-panel"><h1>No encontramos esa noticia</h1><p>Explora el listado para ver las historias disponibles.</p><a class="button" routerLink="/noticias">Ver noticias</a></div>
  }`
})
export class DetalleComponent {
  readonly datos = inject(NoticiasService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly parametros = toSignal(this.ruta.paramMap, { initialValue: this.ruta.snapshot.paramMap });
  readonly noticia = computed(() => this.datos.noticias().find(n => n.id === this.parametros().get('id')));
  readonly parrafos = computed(() => (this.noticia()?.contenido ?? '').split(/\n\s*\n/).filter(Boolean));
}
