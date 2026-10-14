export const CATEGORIAS = ['Educación', 'Tecnología', 'Turismo', 'Comercio'] as const;
export type Categoria = typeof CATEGORIAS[number];
export const IMAGENES = ['assets/educacion.svg', 'assets/tecnologia.svg', 'assets/turismo.svg', 'assets/comercio.svg'] as const;

export interface Noticia {
  id: string;
  titulo: string;
  categoria: Categoria;
  resumen: string;
  contenido: string;
  imagen: string;
  textoAlternativo: string;
  destacada: boolean;
}

export type NuevaNoticia = Pick<Noticia, 'titulo' | 'categoria' | 'resumen' | 'contenido' | 'imagen'>;
