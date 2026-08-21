# API de vehículos — Webservice TRADEIN

Documentación del backend que alimenta el catálogo, la ficha de detalle y el
buscador. Transcrito del PDF **"Webservice API EXT VALUE TRADEIN" v1.1**.

**No es pública ni CORS-friendly.** Vive en una IP interna (requiere VPN/LAN),
exige `Authorization: Bearer` y envuelve el cuerpo en base64. Por eso **todo el
tráfico pasa por route handlers propios** (`/api/*`): el navegador nunca ve el
token ni el host. Local no la alcanza; sólo el servidor desplegado (en la red).

---

## Base

```
TRADEIN_URL="http://172.16.0.206/servicio_api_value_tdin"   # dev (prod = .142)
TRADEIN_TOKEN="<bearer>"                                     # SECRETO, sólo .env.local
```

Resuelto en `src/lib/env.ts` (`TRADEIN_ORIGIN`). El transporte (Bearer + base64)
vive en `src/lib/api/tradein.ts`. Ningún componente conoce el host ni el token.

## Contrato común

- **Método:** `GET` (sólo `LISTADO_CAT_COMPLETO`) o `POST` (el resto).
- **Cabeceras:** `Authorization: Bearer <token>`, `Content-Type: application/json`.
- **Cuerpo POST:** `{ "Content": base64(JSON) }`.
- **Respuesta:** `base64(JSON)` con forma `{ "Status": 1, ... }` o
  `{ "Status": 0, "Body": "<error>" }`. Algunos entornos ya la devuelven como JSON
  plano; el parser soporta ambos.

> Las `clave_*` llegan como **float** (`1.0`) y `anio` como **string** (`"2018"`).

## Endpoints

| Ruta | Método | Uso | Nuestra ruta |
|---|---|---|---|
| `/ENCABEZADO/LISTADO_CAT_COMPLETO` | GET | Todas las facetas sin filtrar | `fetchFiltros()` |
| `/ENCABEZADO/LISTADO_CAT_VEHICULOS` | POST | Listado filtrado + facetas + imágenes | `GET /api/vehiculos` |
| `/ENCABEZADO/LISTADO_BUSQUEDA` | POST | Autocomplete por texto | `GET /api/buscar?q=` |
| `/DETALLE/VEHICULO` | POST | Ficha (specs) + tabla de plazos | ficha `/vehiculos/[slug]` |
| `/ENCABEZADO/AGENDAR_CITA` | POST | Alta de cita | **PENDIENTE** (irá a Odoo) |

### `LISTADO_CAT_VEHICULOS` — cuerpo

```jsonc
{
  "Registro_Incial": 0, "Registro_Final": 12,   // rango de filas (offset), no página
  "Anio": ["2018"], "Color": [2], "Marca": [11],
  "Modelo": [], "Segmento": [1], "Transmision": [1],
  "Precio": { "precio_minimo": 0, "precio_maximo": 99999999 },
  "Kms": { "kms_minimo": 0, "kms_maximo": 99999999 },
  "Texto_Busqueda": "audi"
}
```

Respuesta: `{ Status, Catalogos, Listado: { Total, Vehiculos[], Imagenes[] } }`.
Las **imágenes van en un array aparte** (`Imagenes[]`) con `id_partida` +
`nombre_imagen`; se unen a su vehículo por `id_partida`.

### `DETALLE/VEHICULO`

Cuerpo `{ "id_partida": 10679 }`. Devuelve:
- `Detalle[0]`: specs completas (mismos campos que un vehículo del listado +
  `traccion`, `puertas`, `interiores`, etc.).
- `Precio[]`: tabla de plazos `{ num_mes, monto_mes, enganche, precio_estimado_venta }`
  para 6/12/18/24/36 meses. **Reemplaza el viejo hack de pedir el listado
  completo y filtrar en memoria.**

### `LISTADO_BUSQUEDA`

Cuerpo `{ "busqueda": "au" }`. Devuelve `Posibles_Marcas[]` y
`Posibles_Resultados[]` (con `descripcion`, ej. `"AUDI A5"`).

## Traducción de filtros

`GET /api/vehiculos` acepta los mismos parámetros públicos de siempre y los
traduce al cuerpo de arriba en `src/lib/api/vehiculos-server.ts`.

| Parámetro público | Al webservice | Notas |
|---|---|---|
| `busqueda` | `Texto_Busqueda` | texto libre |
| `marca` / `color` / `segmento` / `transmision` | array de **clave numérica** | `marca=11`, no `AUDI` |
| `anio` | array de año literal | `["2023"]` |
| `precio_min`+`precio_max` | `Precio.precio_minimo/maximo` | el tope que falte se rellena |
| `km_min`+`km_max` | `Kms.kms_minimo/maximo` | igual |
| `pagina`+`cantidad` | `Registro_Incial/Final` | offset = `(pagina-1)*cantidad` |
| `modelo` | — | no se usa (el sidebar no lo ofrece) |

`total_autos` = `Listado.Total`; `paginas` = `ceil(Total / cantidad)`.

## Imágenes — proxy propio

La API devuelve **nombres de archivo** (`"10959-1-CHEVROLET.jpg"`), no URLs, y el
host es la misma IP interna bajo `/thumbnail`. Como el navegador no la alcanza,
se sirven por `GET /api/imagen/[nombre]` (`src/app/api/imagen/[nombre]/route.ts`),
que las trae de `{TRADEIN_ORIGIN}/thumbnail/<nombre>` server-side. `imagenUrl()`
construye la ruta `/api/imagen/…` (relativa), así que sirve en cliente y en SSR.

Validación anti path-traversal: el `nombre` sólo admite `[A-Za-z0-9._-]`.

## Por qué proxy (no llamada directa)

- **Token:** `TRADEIN_TOKEN` es secreto; jamás puede viajar al bundle del cliente.
- **Red:** IP interna, inalcanzable desde el navegador.
- **CORS:** el origen no manda `Access-Control-Allow-Origin`.

El proxy no es abierto: destino fijo (no SSRF), sólo los parámetros conocidos,
y cachea en servidor (`revalidate`). La barrera `import "server-only"` en
`vehiculos-server.ts` hace que el build falle si alguien lo importa desde cliente.

## Integración en este repo

| Archivo | Rol |
|---|---|
| `src/lib/env.ts` | Resuelve `TRADEIN_ORIGIN` (y `PREESTUDIO_ORIGIN`) |
| `src/lib/api/tradein.ts` | Transporte Bearer/base64 + métodos + tipos crudos |
| `src/lib/api/vehiculos.ts` | **Cliente-safe**: tipos, query, normalizadores, `imagenUrl` |
| `src/lib/api/vehiculos-server.ts` | **Server-only**: mappers TRADEIN→UI + fetchers |
| `src/app/api/vehiculos/route.ts` | Proxy del listado (query → TRADEIN) |
| `src/app/api/buscar/route.ts` | Proxy del autocomplete |
| `src/app/api/imagen/[nombre]/route.ts` | Proxy de imágenes |
| `src/hooks/useVehiculos.ts` | `useVehiculos`, `useVehiculosDestacados`, `useVehiculosInfinito` |
| `src/components/sections/SearchForm.tsx` | Buscador con autocomplete |

El fin del scroll infinito se detecta con `paginas`, que la API devuelve; no se
infiere de una página incompleta.

## Notas / pendientes

- **`AGENDAR_CITA` no está conectado.** El agendado en línea será otra lógica
  (caerá en Odoo, ERP aún no disponible), pendiente de aprobación. La página
  `/agendar` muestra un panel "próximamente" con derivación a WhatsApp; el funnel
  completo sigue en `src/components/agendar/AgendarFlow.tsx`, listo para reconectar.
- **`/contacto`** también quedó pendiente (mismo destino Odoo): el submit muestra
  un aviso, no manda a ningún backend.
- **Financiamiento:** la ficha muestra la tabla de plazos real de `DETALLE`. El
  cotizador interactivo (`FinanciamientoAside`) sigue usando el webservice de
  pre-estudio vía `/api/financiamiento` (backend DISTINTO, ver `src/lib/api/preestudio.ts`).
- **Host de imágenes:** se asume `{TRADEIN_ORIGIN}/thumbnail`. Confirmar la ruta
  exacta con Value si algún thumbnail devuelve 404.
