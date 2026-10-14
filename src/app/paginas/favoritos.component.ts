import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaComponent } from '../componentes/tarjeta.component';
import { NoticiasService } from '../servicios/noticias.service';

@Component({
  selector: 'app-favoritos', imports: [RouterLink, TarjetaComponent],
  template: `<p class="eyebrow">Tu colección de historias</p><h1>Para volver a leer.</h1><p class="lead">Las noticias que guardaste, en un solo lugar.</p>
    <div class="section-heading favorites-heading"><h2 role="status">{{ datos.favoritos().length }} noticias guardadas</h2></div>
    <section class="favorites-grid" aria-label="Noticias favoritas">@for (n of datos.favoritos(); track n.id) { <app-tarjeta [noticia]="n" /> }</section>
    @if (!datos.cargando() && !datos.error() && !datos.favoritos().length) {
      <div class="empty-panel"><p class="empty-icon" aria-hidden="true">♡</p><h2>Todavía no tienes favoritos</h2><p>Explora las noticias y guarda las historias que te interesan.</p><a class="button" routerLink="/noticias">Explorar noticias</a></div>
    }`
})
export class FavoritosComponent { readonly datos = inject(NoticiasService); }
