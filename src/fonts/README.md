# Fuentes

Las tres familias del Design System VALUE viven aquí, en `.woff2`, y se cargan
con `next/font/local` desde `src/app/layout.tsx`.

**El build no toca la red.** No se usa `next/font/google` a propósito: aunque
self-hostea el resultado, descarga desde `fonts.gstatic.com` en build time y
rompe cualquier build sin internet (Docker aislado, CI offline, red corporativa).

| Familia | Rol en el DS | Variable CSS | Licencia |
|---|---|---|---|
| `avenir/` | Títulos (`font-heading`) | `--font-avenir` | Comercial - Monotype/Linotype |
| `museo-sans/` | Cuerpo (`font-sans`) | `--font-museo` | Comercial - exljbris |
| `raleway/` | Etiquetas y números (`font-label`) | `--font-raleway` | SIL OFL 1.1 |

Los tokens se consumen sólo desde `@theme` en `src/app/globals.css`. Cambiar una
familia se hace **únicamente** en `layout.tsx`.

## Originales

`public/fonts/` guarda los `.otf` (Museo Sans) y `.ttf` (Avenir) tal como los
entregó el cliente, como fuente de verdad para futuras conversiones. Están
excluidos de la imagen Docker vía `.dockerignore` (~3.7 MB que no se sirven).

## Convertir nuevos originales a woff2

```bash
npm i wawoff2 --no-save
node -e '
const w=require("wawoff2"),fs=require("fs");
const f=process.argv[1];
w.compress(fs.readFileSync(f)).then(o=>fs.writeFileSync(f.replace(/\.(otf|ttf)$/,".woff2"),o));
' ruta/al/archivo.otf
```

Reducción típica: −78% en OTF, −67% en TTF.

## Actualizar Raleway

Es la única que viene de un origen público. Para traer una versión nueva:

```bash
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
curl -A "$UA" "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
```

Del CSS que devuelve, tomar las dos URLs del bloque comentado `/* latin */`
(una `font-style: normal`, otra `italic`) y guardarlas como
`Raleway-Variable.woff2` y `Raleway-Variable-Italic.woff2`.

El subset `latin` (`U+0000-00FF` + puntuación) cubre todo el español: acentos,
`ñ`, `¿`, `¡` y `€`. No hacen falta los subsets cyrillic / greek / vietnamese.

## Pesos disponibles

- **Avenir** - Light 300 · Roman 400 · Medium 500 · Heavy 700 · Black 900, con
  obliques. `Avenir-Book` (45) existe en `public/fonts/avenir/` pero el DS no lo
  lista, así que no está cableado.
- **Museo Sans** - 100 · 300 · 500 · 700 · 900, con itálicas.
  `Museo-Sans-Regular` / `Museo-Sans-Medium` quedaron fuera: son de otro subset
  (300 KB+ vs 60 KB) y su peso real es ambiguo frente a los numerados.
- **Raleway** - variable 100-900 en un solo archivo por estilo.
