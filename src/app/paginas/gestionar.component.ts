import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CampoComponent } from '../componentes/campo.component';
import { CATEGORIAS, Categoria, IMAGENES, Noticia } from '../modelos/noticia';
import { NoticiasService } from '../servicios/noticias.service';
import { enfocarError, opcionPermitida, textoObligatorio } from './validadores';

@Component({
  selector: 'app-gestionar', imports: [ReactiveFormsModule, CampoComponent, RouterLink],
  template: `<p class="eyebrow">Espacio de edición · demostración local</p><h1>Historias por compartir.</h1><p class="lead">Crea una noticia o revisa las publicaciones de muestra.</p>
    <div class="management-layout"><form class="form-panel" [formGroup]="form" (ngSubmit)="crear($event)" novalidate><h2>Nueva noticia</h2>
      <app-campo campoId="titulo" etiqueta="Título" [control]="form.controls.titulo" [maximo]="100" />
      <app-campo campoId="categoria" etiqueta="Categoría" tipo="select" [control]="form.controls.categoria" [opciones]="categorias" />
      <app-campo campoId="imagen" etiqueta="Imagen de muestra" tipo="select" [control]="form.controls.imagen" [opciones]="imagenes" />
      <app-campo campoId="resumen" etiqueta="Descripción breve" [control]="form.controls.resumen" [maximo]="180" />
      <app-campo campoId="contenido-noticia" etiqueta="Contenido completo" tipo="textarea" [control]="form.controls.contenido" [maximo]="10000" />
      @if (estado()) { <p class="form-status" role="status">{{ estado() }}</p> }
      <button class="button" type="submit" [disabled]="datos.cargando() || !!datos.error()">Crear noticia</button>
    </form><section class="management-list" aria-labelledby="publicadas"><h2 id="publicadas">Publicaciones</h2><p class="small" role="status">{{ datos.noticias().length }} publicaciones</p>
      @for (n of datos.noticias(); track n.id) {
        <article class="manage-row"><div><p class="category">{{ n.categoria }}</p><h3><a [routerLink]="['/noticias', n.id]">{{ n.titulo }}</a></h3><p>{{ n.resumen }}</p></div><button class="delete-button" (click)="pedirEliminar(n)">Eliminar</button></article>
      } @empty { @if (!datos.cargando() && !datos.error()) { <p class="empty-list-message">No hay publicaciones. Crea la primera noticia.</p> } }
    </section></div>
    <dialog #dialogo class="confirm-dialog" aria-labelledby="delete-heading" (close)="pendiente.set(null)">
      <h2 id="delete-heading">¿Eliminar noticia?</h2><p>Se eliminará “{{ pendiente()?.titulo }}” de las publicaciones de este navegador.</p>
      <div class="dialog-actions"><button class="button secondary" (click)="cerrar()">Cancelar</button><button class="button danger" (click)="eliminar()">Eliminar</button></div>
    </dialog>`
})
export class GestionarComponent {
  readonly datos = inject(NoticiasService);
  private readonly fb = inject(FormBuilder).nonNullable;
  @ViewChild('dialogo') private dialogo!: ElementRef<HTMLDialogElement>;
  readonly categorias = CATEGORIAS.map(texto => ({ texto, valor: texto }));
  readonly imagenes = IMAGENES.map((valor, i) => ({ valor, texto: ['Biblioteca', 'Tecnología', 'Paisaje', 'Mercado'][i] }));
  readonly pendiente = signal<Noticia | null>(null);
  readonly estado = signal('');
  readonly form = this.fb.group({
    titulo: ['', [textoObligatorio, Validators.maxLength(100)]],
    categoria: ['', [textoObligatorio, opcionPermitida(CATEGORIAS)]],
    imagen: ['', [textoObligatorio, opcionPermitida(IMAGENES)]],
    resumen: ['', [textoObligatorio, Validators.maxLength(180)]],
    contenido: ['', [textoObligatorio, Validators.maxLength(10000)]]
  });
  crear(event: Event): void {
    this.estado.set('');
    if (this.form.invalid) { this.form.markAllAsTouched(); enfocarError(event); return; }
    const valores = this.form.getRawValue();
    if (this.datos.crear({ ...valores, categoria: valores.categoria as Categoria })) {
      this.form.reset(); this.estado.set('Noticia creada y guardada en este navegador.');
    } else this.estado.set('No se pudo guardar la noticia. Vuelve a intentar.');
  }
  pedirEliminar(noticia: Noticia): void { this.pendiente.set(noticia); this.dialogo.nativeElement.showModal(); }
  cerrar(): void { this.dialogo.nativeElement.close(); }
  eliminar(): void {
    const noticia = this.pendiente();
    if (noticia && this.datos.eliminar(noticia.id)) { this.estado.set(`Se eliminó “${noticia.titulo}” del catálogo.`); this.cerrar(); }
    else { this.cerrar(); this.estado.set('No se pudo eliminar la noticia. Vuelve a intentar.'); }
  }
}
