import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampoComponent } from '../componentes/campo.component';
import { enfocarError, opcionPermitida, textoObligatorio } from './validadores';

@Component({
  selector: 'app-contacto', imports: [ReactiveFormsModule, CampoComponent],
  template: `<p class="eyebrow">Abramos la conversación</p><h1>Queremos leerte.</h1><p class="lead">Comparte una idea, una pregunta o una historia con nosotros.</p>
    <div class="two-column"><form class="form-panel" [formGroup]="form" (ngSubmit)="enviar($event)" novalidate><h2>Escríbenos</h2>
      <p class="small">Todos los campos son obligatorios. El formulario muestra una confirmación local y no envía datos a un servidor.</p>
      <app-campo campoId="nombre" etiqueta="Nombre completo" [control]="form.controls.nombre" [maximo]="100" autocompletar="name" />
      <app-campo campoId="correo" etiqueta="Correo electrónico" tipo="email" [control]="form.controls.correo" autocompletar="email" />
      <app-campo campoId="asunto" etiqueta="Asunto" tipo="select" [control]="form.controls.asunto" [opciones]="asuntos" />
      <app-campo campoId="mensaje" etiqueta="Mensaje" tipo="textarea" [control]="form.controls.mensaje" [maximo]="2000" />
      @if (confirmacion()) { <p class="form-status" role="status">¡Gracias! El formulario es válido. En esta versión de muestra no se envía información.</p> }
      <button class="button" type="submit">Enviar mensaje <span aria-hidden="true">→</span></button>
    </form><aside class="contact-aside"><p class="eyebrow">Cada historia cuenta</p><h2>Detrás de VDL Noticias hay una conversación.</h2><p>Comparte tus comentarios y propuestas sobre el periódico.</p><div class="callout"><strong>Correo de ejemplo</strong><br><a href="mailto:hola@vdlnoticias.example">hola@vdlnoticias.example</a></div></aside></div>`
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly asuntos = ['Proponer una historia', 'Hacer una consulta', 'Reportar un problema'].map(texto => ({ texto, valor: texto }));
  readonly form = this.fb.group({
    nombre: ['', [textoObligatorio, Validators.maxLength(100)]],
    correo: ['', [textoObligatorio, Validators.email]],
    asunto: ['', [textoObligatorio, opcionPermitida(this.asuntos.map(a => a.valor))]],
    mensaje: ['', [textoObligatorio, Validators.maxLength(2000)]]
  });
  readonly confirmacion = signal(false);
  enviar(event: Event): void {
    this.confirmacion.set(false);
    if (this.form.invalid) { this.form.markAllAsTouched(); enfocarError(event); return; }
    this.form.reset(); this.confirmacion.set(true);
  }
}
