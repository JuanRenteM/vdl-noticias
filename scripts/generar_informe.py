from pathlib import Path
from xml.sax.saxutils import escape
import argparse
import json
from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, Preformatted
from reportlab.platypus.tableofcontents import TableOfContents

args = argparse.ArgumentParser()
args.add_argument('--video-url', default='')
options = args.parse_args()
if options.video_url and not options.video_url.startswith(('https://www.youtube.com/', 'https://youtube.com/', 'https://youtu.be/')):
    raise ValueError('El enlace del video debe ser una URL de YouTube.')

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent
OUT = PROJECT / 'documentacion/VDL_Noticias_Entrega_Semana_7.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
DOCS = PROJECT / 'documentacion'
DOCS.mkdir(exist_ok=True)
INK = colors.HexColor('#262b23')
PALE = colors.HexColor('#f7f2eb')
ACCENT = colors.HexColor('#8b9a6e')

for name, file in [('TNR', 'times.ttf'), ('TNR-Bold', 'timesbd.ttf'), ('TNR-Italic', 'timesi.ttf'), ('Arial', 'arial.ttf'), ('Arial-Bold', 'arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / file)))
pdfmetrics.registerFontFamily('TNR', normal='TNR', bold='TNR-Bold', italic='TNR-Italic', boldItalic='TNR-Bold')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle('BodyAPA', fontName='TNR', fontSize=12, leading=24, firstLineIndent=36, spaceAfter=0, allowWidows=0, allowOrphans=0))
styles.add(ParagraphStyle('HeadingAPA', fontName='TNR-Bold', fontSize=12, leading=24, alignment=TA_CENTER, spaceBefore=12, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle('SubheadingAPA', fontName='TNR-Bold', fontSize=12, leading=24, spaceBefore=12, keepWithNext=True))
styles.add(ParagraphStyle('CaptionAPA', fontName='TNR', fontSize=11, leading=17, spaceAfter=10, keepWithNext=True))
styles.add(ParagraphStyle('NoteAPA', fontName='TNR-Italic', fontSize=10, leading=16, spaceBefore=9))
styles.add(ParagraphStyle('CellAPA', fontName='TNR', fontSize=10, leading=15))
styles.add(ParagraphStyle('ReferenceAPA', fontName='TNR', fontSize=12, leading=24, leftIndent=36, firstLineIndent=-36, spaceAfter=8))
styles.add(ParagraphStyle('ContentsAPA', fontName='TNR', fontSize=12, leading=21, spaceBefore=3))
styles.add(ParagraphStyle('CodeAPA', fontName='Courier', fontSize=9, leading=15, spaceAfter=10))

class Informe(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name == 'HeadingAPA' and flowable.getPlainText() != 'Contenido':
            title = flowable.getPlainText()
            key = 'section-' + str(self.seq.nextf('section'))
            self.canv.bookmarkPage(key)
            self.notify('TOCEntry', (0, title, self.page, key))

story = [PageBreak()]
editable = ['# VDL Noticias - Aplicación Angular', '', 'Entrega 3 - Semana 7', 'Juan Manuel Renteria Meneses', 'Politécnico Grancolombiano', 'Desarrollo de Front-end - B01 Grupo 22', 'Tutor: John Olarte Ramos', '13 de octubre de 2026', '']

def heading(text, sub=False):
    story.append(Paragraph(escape(text), styles['SubheadingAPA' if sub else 'HeadingAPA']))
    editable.extend([('### ' if sub else '## ') + text, ''])

def body(text):
    story.append(Paragraph(escape(text), styles['BodyAPA']))
    editable.extend([text, ''])

def link(label, url):
    story.append(Paragraph(f'<b>{escape(label)}</b><br/><link href="{escape(url)}" color="#262b23">{escape(url)}</link>', styles['CaptionAPA']))
    editable.extend([f'{label}: {url}', ''])

table_number = 0
def table(rows, widths):
    global table_number
    table_number += 1
    titles = ['Continuidad entre las entregas', 'Organización del código']
    story.append(Paragraph(f'<b>Tabla {table_number}</b><br/><i>{titles[table_number-1]}</i>', styles['CaptionAPA']))
    cells = [[Paragraph(('<b>' if i == 0 else '') + escape(str(cell)) + ('</b>' if i == 0 else ''), styles['CellAPA']) for cell in row] for i, row in enumerate(rows)]
    obj = Table(cells, colWidths=widths, repeatRows=1, hAlign='LEFT')
    obj.setStyle(TableStyle([
        ('VALIGN', (0,0),(-1,-1),'TOP'), ('BACKGROUND', (0,0),(-1,0),PALE),
        ('LINEBELOW',(0,0),(-1,0),.8,ACCENT), ('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#eae2d6')),
        ('LEFTPADDING',(0,0),(-1,-1),7), ('RIGHTPADDING',(0,0),(-1,-1),7),
        ('TOPPADDING',(0,0),(-1,-1),8), ('BOTTOMPADDING',(0,0),(-1,-1),8)
    ]))
    story.extend([Spacer(1,10),obj,Spacer(1,10)])
    editable.extend(['| ' + ' | '.join(map(str, row)) + ' |' for row in rows] + [''])

def figure(number, title, path, note, maxheight=450):
    story.append(Paragraph(f'<b>Figura {number}</b><br/><i>{escape(title)}</i>', styles['CaptionAPA']))
    with PILImage.open(path) as image:
        w,h = image.size
    ratio = min(468/w,maxheight/h)
    story.append(Image(str(path), width=w*ratio, height=h*ratio, hAlign='CENTER'))
    story.append(Paragraph('Nota. ' + escape(note), styles['NoteAPA']))
    editable.extend([f'Figura {number}. {title}', f'Nota. {note}', ''])

def number(canvas, doc):
    canvas.saveState()
    canvas.setFont('TNR',12)
    canvas.drawRightString(540,750,str(doc.page))
    canvas.restoreState()

def cover(canvas, doc):
    number(canvas,doc)
    canvas.saveState()
    canvas.setFillColor(INK)
    logo = PROJECT / 'documentacion/logo-poli.png'
    with PILImage.open(logo) as img: w,h = img.size
    canvas.drawImage(str(logo),206,580,width=200,height=200*h/w,mask='auto')
    for font,size,y,text in [
        ('Arial-Bold',27,490,'VDL Noticias'), ('Arial',14,460,'Aplicación Angular'),
        ('Arial',11,435,'Entrega 3 · Semana 7'), ('Arial-Bold',11,365,'Presentado por'),
        ('Arial',11,334,'Juan Manuel Renteria Meneses'), ('Arial',11,245,'Politécnico Grancolombiano'),
        ('Arial',11,221,'Desarrollo de Front-end'), ('Arial',11,197,'B01 Grupo 22'),
        ('Arial',11,159,'Tutor: John Olarte Ramos'), ('Arial',11,121,'13 de octubre de 2026')
    ]:
        canvas.setFont(font,size); canvas.drawCentredString(306,y,text)
    canvas.setStrokeColor(ACCENT); canvas.setLineWidth(1.5); canvas.line(230,414,382,414)
    canvas.restoreState()

heading('Resumen')
body('Este informe presenta la entrega final de VDL Noticias, un periódico digital de muestra sobre educación, tecnología, turismo y comercio. La aplicación continúa el prototipo de la semana 5 y conserva sus pantallas, estilos, ilustraciones y datos. La versión final utiliza Angular para organizar la navegación, los componentes reutilizables, la carga del catálogo y los formularios. El usuario puede consultar y filtrar noticias, leer su contenido completo, guardar favoritos, validar un formulario de contacto y crear o eliminar publicaciones locales. La implementación se verificó con ocho pruebas automatizadas en Chromium y se desplegó en GitHub Pages. El entregable incluye el código fuente, la compilación estática, capturas reales y un video explicativo de menos de tres minutos. El contacto no transmite información; los cambios del catálogo y los favoritos pertenecen al navegador y origen donde se realizan.')
story.append(Paragraph('<b>Palabras clave:</b> Angular, noticias digitales, componentes, formularios reactivos, JSON, almacenamiento local.', styles['CaptionAPA']))
story.append(PageBreak())
heading('Contenido')
toc = TableOfContents(); toc.levelStyles=[styles['ContentsAPA']]; toc.dotsMinLevel=0
story.append(toc)
story.append(PageBreak())

heading('Introducción')
body('VDL Noticias propone una experiencia sencilla para descubrir historias, consultar su información y conservar lecturas de interés. Los mockups de la semana 3 definieron la identidad visual y la semana 5 convirtió esa propuesta en un prototipo funcional con HTML, CSS y JavaScript. La semana 7 desarrolla la misma experiencia en Angular y publica una versión de producción accesible desde un navegador.')
body('La guía del módulo solicita una aplicación funcional, implementación básica de Angular, código organizado, despliegue, documentación final y un video explicativo de máximo tres minutos (Olarte Ramos, 2026). El informe describe cómo se implementaron las funciones y presenta las evidencias de verificación.')
heading('Objetivo general', True)
body('Completar y desplegar VDL Noticias como una aplicación Angular que mantenga la propuesta de la semana 5 y permita demostrar componentes, binding, navegación, formularios y persistencia local.')
heading('Objetivos específicos', True)
body('Organizar las vistas en componentes reutilizables y centralizar el catálogo y los favoritos en un servicio tipado.')
body('Conservar la consulta, filtros, detalle, favoritos y validaciones; implementar creación y eliminación de publicaciones con confirmación.')
body('Verificar los recorridos en escritorio y móvil, compilar para producción y documentar los enlaces del repositorio y la aplicación.')

heading('Continuidad con la semana 5')
body('El trabajo se realizó en el mismo repositorio. La carpeta prototipo-semana-5 conserva la versión anterior. La aplicación Angular reutiliza las cuatro noticias del JSON, las ilustraciones SVG y los estilos globales, incluida la paleta verde salvia y beige, la tipografía editorial, las tarjetas y las reglas para pantallas pequeñas.')
body('Las claves vdl-noticias-catalogo y vdl-noticias-favoritos se mantienen para recuperar los datos anteriores cuando la aplicación se abre en el mismo origen y navegador. Un sitio publicado y un servidor local tienen almacenamientos separados. Los mockups y las pantallas previas sirvieron como referencia; las figuras de este informe son capturas de la aplicación Angular real.')
table([
    ['Semana 5', 'Semana 7'],
    ['Archivos HTML por vista', 'Componentes y rutas de Angular para las mismas seis vistas.'],
    ['Renderizado mediante JavaScript', 'Interpolación, binding de propiedades, eventos y bloques @if y @for.'],
    ['Fetch para el JSON', 'HttpClient y servicio central de noticias.'],
    ['Validación manual de campos', 'Formularios reactivos con validadores y errores accesibles.'],
    ['Estado global y localStorage', 'Signals, valores derivados y persistencia en las mismas claves.']
], [175,293])
story.append(PageBreak())

heading('Tecnologías y arquitectura')
body('Se utilizó Angular 22.2.2 con TypeScript y Angular CLI. Los componentes reúnen clase y plantilla (Angular, s. f.-a). Encabezado, pie, tarjeta y campo se comparten entre vistas. Angular Router selecciona la página y permite navegar mediante enlaces internos (Angular, s. f.-c).')
body('NoticiasService carga el JSON con HttpClient, valida los datos y centraliza catálogo y favoritos. Signals y computed mantienen el estado y las listas derivadas. La interfaz Noticia tipa las publicaciones. localStorage conserva los datos del origen entre sesiones (MDN contributors, s. f.); si una operación no se puede guardar, se muestra un error.')
body('Contacto y gestión declaran sus controles y validaciones con formularios reactivos (Angular, s. f.-b). Los validadores rechazan vacíos, espacios, correos inválidos y opciones ajenas a las listas permitidas. Las plantillas asocian los errores a cada control.')
table([
    ['Carpeta o archivo', 'Responsabilidad'],
    ['src/app/componentes/', 'Encabezado, pie, tarjeta y campo de formulario.'],
    ['src/app/paginas/', 'Vistas, formularios y validadores de la aplicación.'],
    ['src/app/servicios/', 'Carga HTTP, catálogo, favoritos y almacenamiento.'],
    ['src/app/modelos/', 'Interfaz de noticia y opciones permitidas.'],
    ['public/data/ y public/assets/', 'Catálogo JSON e ilustraciones de semana 5.'],
    ['tests/ y evidencias/', 'Pruebas de recorridos y capturas reales.'],
    ['docs/', 'Versión de producción publicada en GitHub Pages.']
], [170,298])
story.append(PageBreak())

heading('Funcionamiento del aplicativo')
heading('Inicio y navegación', True)
body('El inicio presenta la bienvenida, una noticia destacada y las demás historias en tarjetas. El encabezado permite acceder a las cinco secciones principales y el pie muestra información general. Los llamados a la acción conducen al detalle, al catálogo o al contacto. Si no quedan publicaciones, se muestra un mensaje en lugar de una noticia vacía.')
figure(1,'Página de inicio en Angular',PROJECT/'evidencias/inicio-escritorio.png','Captura real de la aplicación. Se mantiene la composición y la identidad visual del prototipo de semana 5.',380)
story.append(PageBreak())

heading('Listado y filtro por categoría', True)
body('Noticias muestra el catálogo dinámico con imagen, título, categoría, resumen y las acciones de lectura y favorito. Los botones permiten filtrar Educación, Tecnología, Turismo o Comercio. Todas restaura el catálogo. El filtro se guarda en la URL y permanece al recargar. Cuando no hay resultados se informa al lector.')
figure(2,'Catálogo de noticias',PROJECT/'evidencias/noticias-escritorio.png','Las tarjetas se generan a partir del catálogo; no se duplican páginas por categoría.',410)
story.append(PageBreak())

heading('Detalle de la noticia', True)
body('Cada tarjeta abre una ruta con el identificador de la publicación. El detalle presenta el título, resumen, imagen y contenido separado en párrafos. Incluye acciones para guardar o quitar favoritos y enlaces para continuar la navegación. Los identificadores inexistentes muestran una invitación a consultar el listado.')
figure(3,'Vista de detalle',PROJECT/'evidencias/detalle-escritorio.png','El componente reutiliza la misma plantilla para las cuatro noticias originales y las creadas por el usuario.',410)
story.append(PageBreak())

heading('Favoritos', True)
body('Guardar en favoritos registra el identificador de una noticia en localStorage. La lista se recupera al recargar el sitio en el mismo navegador. Quitar de favoritos actualiza el estado del botón y la lista. Si se elimina una noticia desde gestión, también se retira de favoritos. La vista vacía ofrece un enlace para explorar nuevas historias.')
figure(4,'Estado vacío de favoritos',PROJECT/'evidencias/favoritos-escritorio.png','Captura del estado inicial. El recorrido automatizado verificó también guardar, recargar y retirar noticias.',410)
story.append(PageBreak())

heading('Contacto', True)
body('El formulario incluye nombre, correo electrónico, asunto y mensaje. Los campos obligatorios y el correo inválido producen errores junto a los controles; aria-invalid y aria-describedby relacionan el estado y la ayuda con cada campo. Al enviar datos válidos, el formulario se limpia y confirma localmente. La aplicación informa que no envía datos a un servidor.')
figure(5,'Formulario de contacto',PROJECT/'evidencias/contacto-escritorio.png','Formulario reactivo con etiquetas asociadas a los controles. La confirmación es una demostración local.',405)
story.append(PageBreak())

heading('Gestión de noticias', True)
body('Gestionar permite crear una publicación con título, categoría, imagen de muestra, resumen y contenido. Las categorías e imágenes se seleccionan de las opciones incluidas en el proyecto. Al guardar, el servicio actualiza el catálogo y lo conserva localmente. Antes de eliminar, un diálogo identifica la noticia y permite confirmar o cancelar. Cancelar conserva la publicación; confirmar la retira del catálogo y de favoritos.')
figure(6,'Formulario y lista de publicaciones',PROJECT/'evidencias/gestionar-escritorio.png','La creación y eliminación fueron verificadas con recarga del navegador. Las operaciones afectan únicamente al catálogo local.',395)
story.append(PageBreak())

heading('Diseño adaptable y accesibilidad')
body('Las reglas CSS de semana 5 se reutilizaron en Angular. En ventanas de hasta 700 píxeles, la navegación se convierte en un menú desplegable y las tarjetas, artículos y formularios pasan a una columna. Se verificó que las vistas de inicio, listado, contacto y gestión no producen desplazamiento horizontal a 390 píxeles de ancho.')
body('La interfaz incluye enlaces para saltar al contenido, foco visible, textos alternativos en imágenes, encabezados semánticos y mensajes de estado. Los botones de filtro y favoritos exponen su selección mediante aria-pressed. El diálogo de eliminación usa el elemento nativo dialog. Estas mejoras se verificaron en los recorridos principales; no se realizó una auditoría integral de accesibilidad.')
figure(7,'Navegación e inicio en móvil',PROJECT/'evidencias/inicio-movil-menu.png','Captura real a 390 x 844 píxeles. El menú permite acceder a las mismas secciones de escritorio.',290)
story.append(PageBreak())

heading('Ejecución y despliegue')
body('Para desarrollar o compilar se requiere una versión de Node.js compatible con Angular 22.2.2. Se recomienda Node.js 24.15.0 o posterior dentro de esa rama. Se conservan package.json y package-lock.json para instalar las mismas dependencias mediante npm ci. Angular publica los requisitos de instalación en su documentación (Angular, s. f.-d).')
story.append(Preformatted('npm ci\nnpm start\n\n# Compilacion de produccion\nnpm run build\n\n# Preparar la carpeta publicada\nnpm run build:pages',styles['CodeAPA']))
body('El servidor de desarrollo abre la aplicación en http://127.0.0.1:4200. La compilación general queda en dist/vdl-noticias/browser. El comando build:pages configura la base /vdl-noticias/ y copia la compilación a docs. GitHub Pages publica esa carpeta desde la rama main. La dirección pública fue comprobada con respuesta HTTP 200 y con las pruebas de navegación y funcionamiento.')
link('Repositorio del código fuente','https://github.com/JuanRenteM/vdl-noticias')
link('Aplicación desplegada','https://juanrentem.github.io/vdl-noticias/')
body('El repositorio conserva la etapa de semana 5 y contiene la implementación Angular, las instrucciones, las capturas y la documentación final. El ZIP del entregable agrega el PDF y el MP4 para facilitar su descarga y envío. Se excluyen node_modules, archivos temporales y credenciales.')
story.append(PageBreak())

heading('Video explicativo')
video_result = json.loads((PROJECT/'documentacion/video_metadatos.json').read_text(encoding='utf-8'))
secs = video_result['duracion_segundos']
body(f'El paquete incluye VDL_Noticias_Demostracion_Semana_7.mp4, con una duración aproximada de {int(secs)//60} minutos y {round(secs)%60} segundos, inferior al máximo de tres minutos. El video muestra diez escenas de la aplicación real: inicio, catálogo, filtro, detalle, favoritos, validación de contacto, confirmación, creación, eliminación y adaptación móvil. La narración sintética está en español; se adjuntan el guion y un archivo de subtítulos con los títulos de las escenas.')
if options.video_url:
    link('Video en YouTube',options.video_url)
else:
    body('Enlace de YouTube: pendiente de publicación por el estudiante. El archivo MP4 está preparado para subirlo. Antes de entregar el informe en el aula, debe incorporarse la URL real de YouTube; el MP4 local no sustituye ese requisito de la guía.')
heading('Alcance y limitaciones')
body('La aplicación demuestra funciones de front-end con contenido de muestra. No tiene cuentas, autenticación, backend ni base de datos compartida. Las publicaciones y los favoritos se conservan en un único navegador y origen; otros visitantes reciben el catálogo inicial. El formulario de contacto no transmite información. El contenido de las noticias y las ilustraciones son ejemplos académicos.')
body('La eliminación modifica la copia local y no borra el JSON ni el código publicado. Para iniciar de nuevo, se pueden eliminar las dos claves de VDL Noticias desde las herramientas del navegador. Las páginas muestran estados de carga, error, ausencia de contenido y rutas no encontradas para orientar al usuario.')
story.append(PageBreak())

heading('Conclusiones')
body('La implementación final convierte el prototipo de la semana 5 en una aplicación Angular funcional que conserva su identidad visual y sus recorridos. Los componentes compartidos y el servicio de noticias organizan el código, mientras que el binding y los valores derivados mantienen actualizadas las vistas durante las interacciones.')
body('El catálogo JSON, los favoritos y la gestión local permiten demostrar lectura y modificación de información sin infraestructura adicional. Los formularios reactivos incorporan validaciones, errores asociados a los controles y confirmaciones coherentes con el alcance del proyecto.')
body('Las ocho pruebas aprobadas en el servidor local y en el sitio público aportan evidencia de los recorridos principales. GitHub Pages hace accesible la versión de producción y el repositorio conserva tanto la etapa previa como el desarrollo final. La documentación y el video preparado explican su funcionamiento y sus límites.')

story.append(PageBreak())
heading('Referencias')
references = [
    ('Angular. (s. f.-a). Anatomy of a component.', 'https://angular.dev/guide/components'),
    ('Angular. (s. f.-b). Reactive forms.', 'https://angular.dev/guide/forms/reactive-forms'),
    ('Angular. (s. f.-c). Angular routing.', 'https://angular.dev/guide/routing'),
    ('Angular. (s. f.-d). Installation.', 'https://angular.dev/installation'),
    ('MDN contributors. (s. f.). Window: localStorage property.', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage')
]
for text,url in references:
    autor, titulo = text.split('). ', 1)
    story.append(Paragraph(escape(autor) + '). <i>' + escape(titulo) + '</i> Recuperado el 13 de octubre de 2026, de <link href="'+escape(url)+'">'+escape(url)+'</link>',styles['ReferenceAPA']))
    editable.extend([text+' Recuperado el 13 de octubre de 2026, de '+url,''])
story.append(Paragraph('Olarte Ramos, J. (2026, agosto). <i>Orientaciones para las entregas del módulo Front End</i> [Guía del curso]. Politécnico Grancolombiano.',styles['ReferenceAPA']))
editable.extend(['Olarte Ramos, J. (2026, agosto). Orientaciones para las entregas del módulo Front End [Guía del curso]. Politécnico Grancolombiano.',''])

doc = Informe(str(OUT),pagesize=letter,leftMargin=72,rightMargin=72,topMargin=65,bottomMargin=65,title='VDL Noticias - Entrega final, semana 7',author='Juan Manuel Renteria Meneses',subject='Aplicación Angular - Desarrollo de Front-end')
doc.multiBuild(story,onFirstPage=cover,onLaterPages=number)
(DOCS/'informe_editable_semana_7.md').write_text('\n'.join(editable),encoding='utf-8')
print(f'Informe generado: {doc.page} páginas. {OUT}')
