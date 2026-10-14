import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Angular's required validator accepts whitespace; editorial fields must contain text.
export function textoObligatorio(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
}

export function opcionPermitida(opciones: readonly string[]): ValidatorFn {
  return control => opciones.includes(control.value) ? null : { opcion: true };
}

export function enfocarError(event: Event): void {
  setTimeout(() => (event.target as HTMLFormElement)?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}
