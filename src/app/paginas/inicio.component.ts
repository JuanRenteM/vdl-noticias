import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaComponent } from '../componentes/tarjeta.component';
import { NoticiasService } from '../servicios/noticias.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, TarjetaComponent],
  template: `<p class="eyebrow">Educación · Tecnología · Turismo · Comercio</p>
    <h1>Una mirada más cercana.</h1><p class="lead">Descubre historias e ideas que conectan con tu día a día.</p>
    @if (destacada(); as noticia) {
      <section class="featured" aria-labelledby="featured-title">
        <div class="featured-copy"><p class="eyebrow">Historia destacada · {{ noticia.categoria }}</p>
          <h2 id="featured-title">{{ noticia.titulo }}</h2><p>{{ noticia.resumen }}</p>
          <a class="button" [routerLink]="['/noticias', noticia.id]">Leer la historia <span aria-hidden="true">→</span></a>
        </div><img [src]="noticia.imagen" [alt]="noticia.textoAlternativo">
      </section>
    } @else if (!datos.cargando() && !datos.error()) { <p class="empty-panel">Todavía no hay noticias publicadas.</p> }
    <div class="section-heading"><h2>Para seguir explorando</h2><a class="text-link" routerLink="/noticias">Todas las noticias <span aria-hidden="true">→</span></a></div>
    <section class="card-grid" aria-label="Más noticias">
      @for (noticia of otras(); track noticia.id) { <app-tarjeta [noticia]="noticia" /> }
    </section>
    <section class="callout"><div><h2>Las buenas historias nos encuentran.</h2><p>Guarda lo que te interesa y vuelve a leerlo cuando quieras.</p></div><a class="text-link" routerLink="/contacto">Hablemos <span aria-hidden="true">→</span></a></section>`
})
export class InicioComponent {
  readonly datos = inject(NoticiasService);
  readonly destacada = computed(() => this.datos.noticias().find(n => n.destacada) ?? this.datos.noticias()[0]);
  readonly otras = computed(() => this.datos.noticias().filter(n => n.id !== this.destacada()?.id));
}
