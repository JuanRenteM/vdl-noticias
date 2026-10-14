import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EncabezadoComponent } from './componentes/encabezado.component';
import { PieComponent } from './componentes/pie.component';
import { NoticiasService } from './servicios/noticias.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EncabezadoComponent, PieComponent],
  template: `<a class="skip-link" href="#contenido" (click)="saltar($event)">Saltar al contenido</a>
    <app-encabezado />
    <main id="contenido" class="page-width section-page" tabindex="-1">
      @if (datos.cargando()) { <p class="loading-message" role="status">Cargando noticias...</p> }
      @if (datos.error()) { <div class="status-message error-message" role="alert"><p>{{ datos.error() }}</p><button class="button" (click)="datos.cargar()">Volver a intentar</button></div> }
      @if (datos.aviso()) { <p class="form-status" role="status" aria-live="polite">{{ datos.aviso() }}</p> }
      <router-outlet />
    </main>
    <app-pie />`
})
export class AppComponent {
  readonly datos = inject(NoticiasService);
  saltar(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('contenido');
    main?.focus(); main?.scrollIntoView();
  }
}
