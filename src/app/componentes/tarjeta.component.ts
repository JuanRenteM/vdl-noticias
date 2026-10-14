import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../modelos/noticia';
import { NoticiasService } from '../servicios/noticias.service';

@Component({
  selector: 'app-tarjeta',
  imports: [RouterLink],
  template: `<article class="news-card" [class.listing-card]="listado()">
    <a class="card-image" [routerLink]="['/noticias', noticia().id]"><img [src]="noticia().imagen" [alt]="noticia().textoAlternativo" loading="lazy"></a>
    <div class="card-content"><p class="category">{{ noticia().categoria }}</p>
      <h3><a [routerLink]="['/noticias', noticia().id]">{{ noticia().titulo }}</a></h3>
      <p>{{ noticia().resumen }}</p>
      <div class="card-actions"><a class="text-link" [routerLink]="['/noticias', noticia().id]">Leer más <span aria-hidden="true">→</span></a>
        <button class="favorite-button" type="button" [class.is-saved]="datos.esFavorita(noticia().id)" [attr.aria-pressed]="datos.esFavorita(noticia().id)" (click)="datos.alternarFavorito(noticia().id)">
          {{ datos.esFavorita(noticia().id) ? 'Quitar de favoritos' : 'Guardar en favoritos' }}
        </button>
      </div>
    </div>
  </article>`
})
export class TarjetaComponent {
  readonly noticia = input.required<Noticia>();
  readonly listado = input(false);
  readonly datos = inject(NoticiasService);
}
