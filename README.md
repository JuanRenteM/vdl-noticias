# vdl-noticias

Prototipo académico del portal VDL Noticias, construido a partir de los mockups de la entrega de semana 3.

## Abrir el prototipo

El catálogo se carga desde un archivo JSON. Para que el navegador pueda leerlo, sirve la carpeta con un servidor local:

```powershell
cd prototipo-semana-5
py -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Detén el servidor con `Ctrl+C`.

## Avance actual

- Inicio con noticia destacada y tarjetas cargadas desde `data/noticias.json`.
- Listado de noticias con filtro por categoría.
- Vista de detalle reutilizable por identificador: `detalle.html?id=biblioteca-barrio`.
- Navegación adaptable entre Inicio, Noticias, Favoritos, Contacto y Gestionar.

Favoritos, validaciones del formulario y gestión de publicaciones se completarán en los siguientes commits.
