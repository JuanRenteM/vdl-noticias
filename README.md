# vdl-noticias

Prototipo académico del portal VDL Noticias, construido a partir de los mockups de la entrega de semana 3.

## Abrir el prototipo

El catálogo se carga desde un archivo JSON. Para que el navegador pueda leerlo, sirve la carpeta con un servidor local:

```powershell
cd prototipo-semana-5
py -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Detén el servidor con `Ctrl+C`.

## Funcionalidades disponibles

- Inicio con noticia destacada y tarjetas cargadas desde `data/noticias.json`.
- Listado de noticias con filtro por categoría y detalle por identificador.
- Favoritos persistentes en `localStorage`.
- Formulario de contacto con validación de campos y confirmación visual. No se envían mensajes.
- Gestión local de noticias: creación y eliminación con confirmación. El catálogo editado se conserva en `localStorage`.
- Diseño adaptable para escritorio y móvil.

Los favoritos, las noticias creadas y las eliminaciones pertenecen al navegador local. No hay un servidor ni una base de datos.
