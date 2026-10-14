import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio.component';
import { NoticiasComponent } from './paginas/noticias.component';
import { DetalleComponent } from './paginas/detalle.component';
import { FavoritosComponent } from './paginas/favoritos.component';
import { ContactoComponent } from './paginas/contacto.component';
import { GestionarComponent } from './paginas/gestionar.component';
import { NoEncontradaComponent } from './paginas/no-encontrada.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioComponent, title: 'Inicio | VDL Noticias' },
  { path: 'noticias', component: NoticiasComponent, title: 'Noticias | VDL Noticias' },
  { path: 'noticias/:id', component: DetalleComponent, title: 'Detalle | VDL Noticias' },
  { path: 'favoritos', component: FavoritosComponent, title: 'Favoritos | VDL Noticias' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | VDL Noticias' },
  { path: 'gestionar', component: GestionarComponent, title: 'Gestionar | VDL Noticias' },
  { path: '**', component: NoEncontradaComponent, title: 'Página no encontrada | VDL Noticias' }
];
