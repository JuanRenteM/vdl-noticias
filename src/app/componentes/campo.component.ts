import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-campo',
  imports: [ReactiveFormsModule],
  template: `<div class="field">
    <label [for]="id()">{{ etiqueta() }}</label>
    @if (tipo() === 'select') {
      <select [id]="id()" [formControl]="control()" required [attr.aria-invalid]="invalido" [attr.aria-describedby]="id() + '-error'">
        <option value="">Seleccionar</option>
        @for (opcion of opciones(); track opcion.valor) { <option [value]="opcion.valor">{{ opcion.texto }}</option> }
      </select>
    } @else if (tipo() === 'textarea') {
      <textarea [id]="id()" [formControl]="control()" required rows="5" [attr.maxlength]="maximo()" [attr.aria-invalid]="invalido" [attr.aria-describedby]="id() + '-error'"></textarea>
    } @else {
      <input [id]="id()" [type]="tipo()" [formControl]="control()" required [attr.maxlength]="maximo()" [attr.autocomplete]="autocompletar()" [attr.aria-invalid]="invalido" [attr.aria-describedby]="id() + '-error'">
    }
    <span class="field-error" [id]="id() + '-error'">{{ invalido ? mensajeError : '' }}</span>
  </div>`
})
export class CampoComponent {
  readonly control = input.required<FormControl<string>>();
  readonly id = input.required<string>({ alias: 'campoId' });
  readonly etiqueta = input.required<string>();
  readonly tipo = input('text');
  readonly maximo = input<number | null>(null);
  readonly autocompletar = input<string | null>(null);
  readonly opciones = input<{ valor: string; texto: string }[]>([]);
  get invalido(): boolean { return this.control().touched && this.control().invalid; }
  get mensajeError(): string {
    const errores: ValidationErrors = this.control().errors ?? {};
    if (errores['required']) return 'Este campo es obligatorio.';
    if (errores['email']) return 'Escribe un correo electrónico válido.';
    if (errores['maxlength']) return `Usa máximo ${errores['maxlength'].requiredLength} caracteres.`;
    return 'Selecciona una opción válida.';
  }
}
