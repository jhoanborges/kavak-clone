# API de vehículos — Value Autos

Documentación del endpoint que alimenta el catálogo.

**Es una API pública.** Responde correctamente desde cualquier navegador. Sólo
rechaza peticiones desde IPs de datacenter (WAF de Imperva → `403` + challenge
JS), así que no se puede probar desde CI ni desde un sandbox — pero **sí funciona
desde el navegador del usuario final**, que es donde corre nuestra integración.

El contrato de abajo está transcrito de una respuesta real.

---

## Base

```
NEXT_PUBLIC_API_URL="https://www.valueautos.com.mx"
NEXT_PUBLIC_IMAGES_URL="https://www.valueautos.com.mx/img/autos"   # ⚠️ ruta sin confirmar
```

El resto se concatena en `src/lib/api/vehiculos.ts`. Ningún componente conoce el
host.

```
GET {NEXT_PUBLIC_API_URL}/api/vehiculos?<params>
```

## Parámetros

| Parámetro | Tipo | Notas |
|---|---|---|
| `busqueda` | string | Texto libre. Ej. `audi` |
| `segmento` | string | SUVs, Sedan, Coupe, Hatchback, Camionetas |
| `transmision` | string | Automático, Manual |
| `marca` / `modelo` | string | |
| `anio` | string | |
| `color` | string | |
| `precio_min` / `precio_max` | number \| "" | Home manda `0`/`9999999`; el listado, `""` |
| `km_min` / `km_max` | number \| "" | Igual |
| `pagina` | number | 1-indexado |
| `cantidad` | number | Tamaño de página |
| `_` | number | Cache-buster de jQuery. **No lo usamos** |

### Sobre `_=<timestamp>`

El sitio original lo añade porque jQuery lo hace por defecto con `cache: false`.
Nuestro cliente lo **omite a propósito**: cambiaría la clave de SWR en cada
render y mataría caché y deduplicación. Si el backend cacheara de más, se
resuelve con `Cache-Control`.

## Respuesta

```jsonc
{
  "query": "",
  "autos": [ /* … */ ],
  "total_autos": 29,
  "paginas": 8,          // = ceil(total_autos / cantidad)
  "filters": 1,
  "filtros": { /* facetas con conteos */ }
}
```

### Objeto `auto`

```jsonc
{
  "id_row": 1,
  "id_partida": 12577,              // ← identificador real
  "anio": "2016",                   // string, no número
  "clave_marca": 2,
  "marca": "CHEVROLET",
  "clave_modelo": 6,
  "modelo": "SUBURBAN",
  "modelo_string": "SUBURBAN",
  "clave_tipo": 5,
  "tipo": "5p HD V8/6.0 Aut 4WD",   // ← versión / trim, NO el segmento
  "kms": 115118,
  "precio_estimado_venta": 440000,
  "clave_segmento": 1,
  "segmento": "SUVs",
  "clave_tipo_combustible": 1,
  "tipo_combustible": "Gasolina",
  "clave_color": 10,
  "color": "PLATA",
  "clave_transmision": 1,
  "transmision": "Automático",
  "monto_mes": 11586.629999999999,  // ruido de float: redondear
  "meses": 36,
  "imagenes": ["12577-1_2_0-3-DEFAULT.JPG"]   // nombres de archivo, NO URLs
}
```

**Trampas del contrato:**

1. El array es `autos`, no `vehiculos` / `data` / `items`.
2. El id es `id_partida`. `id_row` es sólo el índice dentro de la página.
3. `tipo` es la **versión**, no la carrocería. La carrocería es `segmento`.
4. `anio` llega como **string**.
5. `monto_mes` trae ruido de coma flotante (`11586.629999999999`) →
   `Math.round()` antes de pintarlo.
6. `imagenes` son **nombres de archivo sueltos**, hay que prefijarlos con
   `NEXT_PUBLIC_IMAGES_URL`.

> ⚠️ **La ruta de imágenes está sin confirmar.** Sácala del `src` de cualquier
> `<img>` del catálogo original y ajusta `NEXT_PUBLIC_IMAGES_URL`. Hasta
> entonces las fotos no cargan (la tarjeta muestra su estado "Sin imagen").

### `filtros` — facetas con conteos

Viene en **cada** respuesta, sin pedirla. Sirve para construir el sidebar de
filtros sin un segundo endpoint:

| Clave | Forma |
|---|---|
| `marcas` | `{clave_marca, marca, total_clave_marca, modelos:[{clave_modelo, modelo, total_clave_modelo}]}` |
| `anios` | `{anio, total_anio}` |
| `segmentos` | `{clave_segmento, segmento, total_clave_segmento}` |
| `transmisiones` | `{clave_transmision, transmision, total_clave_transmision}` |
| `colores` | `{clave_color, color, total_clave_color}` |

Los `modelos` van anidados dentro de su marca, así que el filtro
marca → modelo es dependiente sin trabajo extra.

## Las tres llamadas del sitio

### 1. Home — "Ofertas destacadas"

```
/api/vehiculos?busqueda=&segmento=&transmision=&marca=&modelo=&anio=&color=
  &precio_min=0&precio_max=9999999&km_min=0&km_max=999999&pagina=1&cantidad=4
```

**No son destacadas.** Es una búsqueda sin ningún filtro recortada a 4
resultados; el orden lo decide el backend. El endpoint no expone ningún concepto
de "destacado".

> Implicación de producto: hoy la sección promete una curaduría que no existe.
> Para tener destacados de verdad hace falta un campo nuevo (`destacado`,
> `orden`) o un endpoint aparte.

`VEHICULOS_PRESETS.destacados(4)`

### 2. Listado paginado / scroll infinito

```
/api/vehiculos?precio_min=&precio_max=&km_min=&km_max=&pagina=1&cantidad=12
```

Filtros **vacíos**, no en cero. `VEHICULOS_PRESETS.listado(pagina, 12)`

### 3. Búsqueda por texto

```
/api/vehiculos?busqueda=audi&precio_min=&precio_max=&km_min=&km_max=&pagina=1&cantidad=12
```

`VEHICULOS_PRESETS.busqueda(termino, pagina, 12)`

## CORS — por qué hay un proxy

El origen **no manda `Access-Control-Allow-Origin`**, así que el navegador
bloquea cualquier `fetch` directo desde nuestro dominio:

```
Access to fetch at 'https://www.valueautos.com.mx/api/vehiculos?…'
from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Esto no se arregla desde el cliente.** CORS lo aplica el navegador a propósito;
`mode: 'no-cors'` devuelve una respuesta opaca e ilegible, y los proxies
públicos (corsproxy.io y similares) meten a un tercero en medio del tráfico.

### Solución actual: proxy servidor-a-servidor

`src/app/api/vehiculos/route.ts` reenvía la petición desde nuestro servidor.
Servidor-a-servidor no aplica CORS. **Verificado funcionando** contra el origen
real.

No es un proxy abierto:

- El destino está fijado (`UPSTREAM_ORIGIN` + ruta fija). El cliente no elige a
  dónde se conecta el servidor — eso sería un SSRF.
- Sólo se reenvían los parámetros de la allowlist (`VEHICULOS_PARAMS`).
- Sólo GET. No se propagan cabeceras del cliente, ni cookies ni auth.
- Cachea 300 s en servidor, para no golpear un upstream que está tras un WAF.

### Solución correcta: que Value habilite CORS

Cuando añadan `Access-Control-Allow-Origin` con nuestro dominio:

```
NEXT_PUBLIC_API_PROXY=false
```

Y listo — vuelve a llamada directa sin tocar un solo componente.

> **Nota sobre Imperva:** el WAF bloquea IPs de datacenter. Desde una máquina de
> desarrollo el proxy pasa sin problema (verificado). **En producción hay que
> confirmar que la IP del servidor esté permitida**, o el proxy devolverá 502
> con el aviso correspondiente. Es la razón principal para preferir CORS: en ese
> modo quien llama es el navegador del usuario final, que nunca está bloqueado.

## Pendiente de confirmar

- **Ruta base real de las imágenes** (bloquea que se vean las fotos). Nuestra
  suposición es `NEXT_PUBLIC_IMAGES_URL=https://www.valueautos.com.mx/img/autos`.
  Comprobación de 5 segundos: abre en el navegador
  `https://www.valueautos.com.mx/img/autos/12577-1_2_0-3-DEFAULT.JPG`.
  Si da 404, saca la ruta buena del `src` de cualquier `<img>` del catálogo
  original. Las imágenes van por `<img>`, que NO sufre CORS: no necesitan proxy.
- Convención de sufijos en los nombres: `-DEFAULT.JPG`, `_1_8_0-6`, `_2_2-10`
  sugieren variantes de tamaño. Si hay thumbnails, conviene usarlos en la
  tarjeta en lugar de la imagen completa.
- **CORS**: ¿`Access-Control-Allow-Origin` incluye nuestro dominio? Si no, el
  fetch desde el navegador fallará pese a que la API sea pública, y habría que
  pasar por un route handler propio. **Es lo primero que hay que probar al
  levantar el sitio.**
- Comportamiento al pedir `pagina` > `paginas`.

## Integración en este repo

| Archivo | Rol |
|---|---|
| `src/lib/api/vehiculos.ts` | URLs, tipos, normalizadores, fetcher |
| `src/lib/swr-provider.tsx` | `SWRConfig` global, montado en el root layout |
| `src/hooks/useVehiculos.ts` | `useVehiculos`, `useVehiculosDestacados`, `useVehiculosInfinito` |
| `src/components/catalog/VehiculoCard.tsx` | Tarjeta con carrusel Embla multi-imagen |
| `src/components/catalog/VehiculoCardSkeleton.tsx` | Reserva el mismo alto → sin CLS |
| `src/components/catalog/VehiculosEstado.tsx` | Estados de error y vacío |
| `src/components/sections/OfertasDestacadas.tsx` | Sección del home |
| `src/components/sections/CatalogoInfinito.tsx` | Scroll infinito — **para /compra, no para el home** |
| `src/app/api/vehiculos/route.ts` | Proxy servidor-a-servidor (rodea CORS) |

El fin del scroll infinito se detecta con `paginas`, que la API devuelve de
verdad; no se infiere de una página incompleta.

### Defaults de SWR y por qué

| Opción | Valor | Motivo |
|---|---|---|
| `revalidateOnFocus` | `false` | Volver a la pestaña no debe reordenar el listado bajo el cursor |
| `dedupingInterval` | 60 s | Varias tarjetas con la misma URL → una sola petición |
| `errorRetryCount` | 2 | Reintentar contra un WAF sólo empeora las cosas |
| `keepPreviousData` | `true` | Al paginar/buscar la lista no se vacía → sin salto de layout |
| `shouldRetryOnError` | sólo ≥500 | Un 4xx no se arregla reintentando |
| `revalidateFirstPage` | `false` | Evita repedir la página 1 cada vez que se carga otra |
