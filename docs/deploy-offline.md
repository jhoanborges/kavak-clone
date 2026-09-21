# Deploy en servidor SIN internet

El servidor de dev/prod no tiene salida a internet. Por eso
`docker compose up --build` **falla ahí**: el `Dockerfile` corre `npm ci`
(baja del registry) y necesita bajar la imagen base `node:22-alpine`.

La solución no es hacer `npm run build` en el server, sino **construir la imagen
completa donde SÍ hay internet y llevar la imagen ya hecha** al server. El server
sólo la carga y la levanta — cero descargas.

```
  MÁQUINA CON INTERNET                 SERVER OFFLINE
  ────────────────────                 ──────────────
  make prod-package                    make prod-deploy
  ├─ docker compose build   ── .tar.gz ─►  ├─ docker load  (carga la imagen)
  └─ docker save | gzip        (copias)    └─ compose up --no-build
                                              (usa la imagen, no baja nada)
```

> Nota: el server ejecuta la imagen ya construida — dentro ya está el resultado de
> `npm run build` con las librerías horneadas. No compila ni instala nada en el server.

---

## 1. En la máquina con internet (build)

Desde una copia del repo con Docker + red:

```bash
make prod-package
```

Eso hace dos cosas:

1. `docker compose -f docker-compose.prod.yml build` — construye `value-arrendadora:prod`.
2. `docker save value-arrendadora:prod | gzip > value-arrendadora-prod.tar.gz`.

Queda un archivo `value-arrendadora-prod.tar.gz` (la imagen entera, comprimida).

### Sin `make` (Windows / PowerShell)

Si la máquina con internet es Windows sin `make`, corre los comandos directo:

```powershell
docker compose -f docker-compose.prod.yml build
docker save value-arrendadora:prod -o value-arrendadora-prod.tar
```

(En Windows omite el `gzip`; sube el `.tar` tal cual, o comprímelo con 7-Zip.)

### Arquitectura

Docker Desktop en Windows/Intel construye imágenes **linux/amd64**, que es lo que
usan los servers. Si construyes en un **Mac con Apple Silicon**, fuerza la
plataforma o el contenedor no arrancará en el server:

```bash
docker compose -f docker-compose.prod.yml build --build-arg BUILDPLATFORM=linux/amd64
# o, más directo:
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose -f docker-compose.prod.yml build
```

---

## 2. Copiar el tarball al server

Por SCP, USB, o lo que uses. Ejemplo SCP:

```bash
scp value-arrendadora-prod.tar.gz usuario@172.16.76.186:/ruta/al/proyecto/
```

El tarball debe quedar en el directorio del repo en el server (junto a
`docker-compose.prod.yml` y el `Makefile`).

---

## 3. En el server offline (deploy)

Requisito previo (una sola vez, no depende de internet): el runtime env.

```bash
cp .env.production .env   # y rellena tokens/IPs reales (ver deploy-development.md §6)
```

Luego:

```bash
make prod-deploy
```

Eso hace:

1. `docker load` de la imagen desde `value-arrendadora-prod.tar.gz`.
2. `docker compose -f docker-compose.prod.yml up -d --no-build`.

`--no-build` es la clave: usa la imagen cargada y **nunca** intenta construir ni
bajar nada. Si la imagen no estuviera cargada, falla de golpe en vez de intentar
descargar.

Verifica:

```bash
make prod-ps
make prod-logs
curl -I http://localhost:${NEXT_PUBLIC_APP_PORT:-8006}
```

---

## 4. Targets del Makefile

| Dónde | Target | Qué hace |
|---|---|---|
| Internet | `make prod-build` | Construye la imagen (baja libs + base) |
| Internet | `make prod-save` | Exporta la imagen a `.tar.gz` |
| Internet | `make prod-package` | `build` + `save` |
| Offline | `make prod-load` | Carga la imagen del `.tar.gz` |
| Offline | `make prod-up` | Levanta con la imagen cargada, sin build |
| Offline | `make prod-deploy` | `load` + `up` |
| Ambos | `make prod-logs` / `prod-ps` / `prod-restart` / `prod-down` | Operación |

Para development hay los mismos con prefijo `dev-` (`make dev-package`,
`make dev-deploy`, …) que usan `docker-compose.development.yml` y la imagen
`value-arrendadora:dev`. `make help` lista todo.

---

## 5. Cuándo repetir el ciclo

Cualquier cambio de **código** o de variables `NEXT_PUBLIC_*` (se hornean en build)
exige rehacer el paquete: `make prod-package` en la máquina con internet → subir →
`make prod-deploy`.

Cambios sólo de variables de **runtime** (sin `NEXT_PUBLIC_`, ej. `TRADEIN_TOKEN`,
`TRADEIN_URL`, `PUSH_BACKEND_URL`) NO exigen reconstruir: edita `.env` en el server
y `make prod-restart` (o `docker compose -f docker-compose.prod.yml up -d --force-recreate`).
Ver la tabla de "¿reconstruir?" en `deploy-development.md` §5.

---

## 6. Diagnóstico

| Síntoma | Causa | Arreglo |
|---|---|---|
| `up` intenta build / se cuelga bajando | Faltó `--no-build` o la imagen no está cargada | `make prod-load` primero, luego `make prod-up` |
| `image ... not found` en `up` | No se cargó el tarball | `make prod-load` |
| `exec format error` al arrancar | Imagen de otra arquitectura (Mac ARM) | Reconstruye con `linux/amd64` (§1) |
| `env file .env not found` | Falta el runtime env | `cp .env.production .env` |
| Cambié código y el server sigue igual | La imagen es la vieja | Rehacer `prod-package` → subir → `prod-deploy` |
