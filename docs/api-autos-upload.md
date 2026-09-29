# Subir imágenes de autos

Endpoint interno para cargar imágenes al catálogo desde una máquina externa. Los
archivos se escriben en `public/autos/` y quedan servidos de forma estática en
`/autos/<nombre>`.

> **Uso interno.** No tiene autenticación: está pensado para correr dentro de la
> red interna. No lo expongas a internet.

## Endpoint

```
POST /api/autos/upload
Content-Type: multipart/form-data
```

- **Runtime:** Node (escribe a disco).
- **Destino:** `public/autos/<nombre>`.
- **Persistencia:** válido en el deploy Docker self-hosted. En un FS de solo
  lectura (serverless) no aplica.

## Campos del form-data

| Campo    | Requerido | Descripción                                                        |
| -------- | --------- | ------------------------------------------------------------------ |
| `file`   | sí\*      | Un archivo. Se puede repetir el campo para varios.                 |
| `files`  | sí\*      | Alias de `file`. Se pueden mezclar `file` y `files` en la misma petición. |
| `nombre` | no        | Nombre destino forzado. **Solo aplica cuando mandas un solo archivo.** Si no, se usa el filename de cada archivo. |

\* Al menos uno entre `file` / `files`.

El nombre destino se reduce a *basename* y se sanitiza (solo `A-Z a-z 0-9 . _ -`;
el resto pasa a `_`). Nunca se escribe fuera de `public/autos`.

## Ejemplos

### Subir varias imágenes

```bash
curl -X POST http://172.16.76.186:8006/api/autos/upload \
  -F "files=@13443-1_8_0-6.JPG" \
  -F "files=@13443-2_2_0-12.JPG"
```

### Una imagen con nombre forzado

```bash
curl -X POST http://172.16.76.186:8006/api/autos/upload \
  -F "file=@foto.jpg" \
  -F "nombre=13443-1_2_0-3-DEFAULT.JPG"
```

### Subir todo un directorio (bash)

```bash
args=()
for f in ./autos/*.JPG; do args+=(-F "files=@${f}"); done
curl -X POST http://172.16.76.186:8006/api/autos/upload "${args[@]}"
```

### PowerShell

```powershell
$form = @{ files = Get-Item .\13443-1_8_0-6.JPG }
Invoke-RestMethod -Uri http://172.16.76.186:8006/api/autos/upload -Method Post -Form $form
```

## Respuesta

```json
{
  "ok": 2,
  "fail": 0,
  "total": 2,
  "archivos": [
    { "nombre": "13443-1_8_0-6.JPG", "bytes": 46602, "estado": "ok" },
    { "nombre": "13443-2_2_0-12.JPG", "bytes": 49261, "estado": "ok" }
  ]
}
```

| Campo               | Significado                                    |
| ------------------- | ---------------------------------------------- |
| `ok` / `fail`       | Conteo de archivos escritos / fallidos.        |
| `total`             | Archivos recibidos.                            |
| `archivos[].nombre` | Nombre final ya sanitizado en `public/autos/`. |
| `archivos[].bytes`  | Tamaño escrito.                                |
| `archivos[].estado` | `ok` o `fail` (con `error` si falló).          |

## Códigos de estado

| Código | Cuándo                                                    |
| ------ | --------------------------------------------------------- |
| `201`  | Todos los archivos se escribieron.                        |
| `207`  | Éxito parcial: al menos uno falló (ver `archivos[].estado`). |
| `400`  | form-data ilegible o sin archivos.                        |
| `415`  | El `Content-Type` no es `multipart/form-data`.            |

## Notas

- Si subes un nombre que ya existe, **se sobrescribe** sin aviso.
- El nombre debe respetar la nomenclatura del catálogo para que la UI lo
  encuentre, ej. `13443-1_8_0-6.JPG` (`<id_partida>-<serie>-<n>.JPG`).
- Ajusta host/puerto según el entorno (dev `:8008`, prod detrás de su dominio).
