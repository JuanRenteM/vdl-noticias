import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="notice-bar">VDL Noticias · Historias que nos acercan</div>
    <header class="site-header page-width">
      <div class="brand-row"><a class="brand" routerLink="/inicio" aria-label="VDL Noticias, inicio">VDL <span>Noticias</span></a><p class="tagline">Una mirada cercana a lo que nos conecta</p></div>
      <nav class="desktop-nav" aria-label="Navegación principal">
        @for (enlace of enlaces; track enlace.ruta) {
          <a [routerLink]="enlace.ruta" routerLinkActive="active" ariaCurrentWhenActive="page">{{ enlace.nombre }}</a>
        }
      </nav>
      <details class="mobile-nav" #menu><summary>Menú de navegación</summary>
        <nav aria-label="Navegación móvil">
          @for (enlace of enlaces; track enlace.ruta) {
            <a [routerLink]="enlace.ruta" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="menu.open = false">{{ enlace.nombre }}</a>
          }
        </nav>
      </details>
    </header>`
})
export class EncabezadoComponent {
  readonly enlaces = [
    { ruta: '/inicio', nombre: 'Inicio' }, { ruta: '/noticias', nombre: 'Noticias' },
    { ruta: '/favoritos', nombre: 'Favoritos' }, { ruta: '/contacto', nombre: 'Contacto' },
    { ruta: '/gestionar', nombre: 'Gestionar' }
  ];
}
