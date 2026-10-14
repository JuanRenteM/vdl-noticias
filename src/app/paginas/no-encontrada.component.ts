import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrada', imports: [RouterLink],
  template: `<div class="empty-panel"><h1>Página no encontrada</h1><p>El enlace no corresponde a una sección del periódico.</p><a class="button" routerLink="/inicio">Volver al inicio</a></div>`
})
export class NoEncontradaComponent {}
