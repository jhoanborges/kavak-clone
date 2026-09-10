# Alta del entorno DEVELOPMENT (`docker-compose.development.yml`)

Guía para levantar la app en el servidor de **desarrollo** con Docker Compose.
Pensada para devops: qué archivos tocar, qué puerto se expone y **qué cambios
exigen reconstruir la imagen** (no basta con reiniciar).

Público objetivo: quien da de alta el contenedor en el host de dev.

---

## 1. Qué es cada compose

| Archivo | Imagen | Puerto host por defecto | `BUILD_ENV` | Uso |
|---|---|---|---|---|
| `docker-compose.local.yml` | `value-arrendadora:local` | `8008` | `development` | Prueba en la máquina del dev |
| `docker-compose.development.yml` | `value-arrendadora:dev` | `8006` | `development` | **Servidor de desarrollo** |
| `docker-compose.prod.yml` | `value-arrendadora:prod` | `8006` | `production` | Servidor de producción |

Los tres usan el mismo `Dockerfile`. Lo único que cambia es de qué archivo `.env.*`
se hornean los valores `NEXT_PUBLIC_*` en build y qué puerto se publica.

---

## 2. Requisitos del host

- **Docker Engine + Compose v2 ≥ 2.24.** El compose usa la sintaxis larga de
  `env_file` (`- path: .env.local` / `required: false`), que versiones anteriores
  rechazan. Verifica con `docker compose version`.
- **Acceso de red a los backends internos** (`172.16.0.x`): VPN o LAN de Value.
  Sin eso el contenedor arranca pero el catálogo responde error.
- **Puerto `8006` libre.** Es el único puerto que el servidor de desarrollo
  (`172.16.76.186`) tiene abierto para este proyecto. Ver sección 4.

---

## 3. Alta paso a paso

```bash
# 1. Código
git clone <repo> value-arrendadora && cd value-arrendadora

# 2. Runtime env — OBLIGATORIO. El compose declara `- .env` sin `required: false`,
#    así que si el archivo no existe `docker compose up` falla de entrada.
cp .env.development .env

# 3. Edita .env: puerto, IPs de backend y SECRETOS (tokens).
#    .env está en .gitignore — es el único lugar con valores reales.
vi .env

# 4. Build + arranque
docker compose -f docker-compose.development.yml up -d --build

# 5. Verifica
docker compose -f docker-compose.development.yml ps
docker compose -f docker-compose.development.yml logs -f web
curl -I http://localhost:${NEXT_PUBLIC_APP_PORT:-8006}
```

`restart: unless-stopped` ya está puesto: el contenedor vuelve solo tras un
reinicio del host.

### Precedencia de variables en runtime

El compose carga, **en este orden** (el último gana):

1. `.env`
2. `.env.development`
3. `.env.local` (opcional, overrides personales)

⚠️ Esto aplica al **runtime del contenedor**. La interpolación del propio YAML
(`${NEXT_PUBLIC_APP_PORT}`) funciona distinto — ver sección 4.

---

## 4. Puerto — la parte que más se toca

### Dos puertos, no uno

```
    host:8006  ──►  contenedor:3000
       ▲                  ▲
  configurable        FIJO. No tocar.
```

- **Dentro del contenedor Next siempre escucha en `3000`.** Está fijado en el
  `Dockerfile` (`ENV PORT=3000`, `ENV HOSTNAME=0.0.0.0`, `EXPOSE 3000`). No lo
  cambies: no aporta nada y rompe el mapeo.
- **El puerto publicado en el host es el configurable.** Sale del mapeo:

```yaml
ports:
  - '${NEXT_PUBLIC_APP_PORT:-8006}:3000'
```

### Configuración actual de development

El servidor de desarrollo (`172.16.76.186`) tiene **sólo el puerto 8006 abierto**
para este proyecto. Por eso development quedó en 8006, no en 8008:

```dotenv
NEXT_PUBLIC_APP_PORT=8006
NEXT_PUBLIC_APP_URL=http://172.16.76.186:8006
```

URL final del entorno: **http://172.16.76.186:8006**

Coincide con el puerto de producción (`docker-compose.prod.yml` también usa 8006),
pero son hosts distintos: no hay colisión.

`NEXT_PUBLIC_APP_URL` lleva la IP del servidor, **no `localhost`**. Es la URL que
ve el navegador del usuario y la que Next hornea como origen canónico. Con
`localhost` los canonical, Open Graph y el sitemap apuntarían a la máquina del
visitante.

### Cómo cambiar el puerto del host

⚠️ En este servidor cambiar el puerto **requiere que infraestructura abra el nuevo
puerto en el firewall**. Editar el `.env` solo no basta: el contenedor arrancaría
y quedaría inalcanzable desde fuera del host.

1. Comprueba que el nuevo puerto está libre y abierto:
   ```bash
   ss -ltnp | grep :8006
   ```
2. Edita **`.env`** (no `.env.development`):
   ```dotenv
   NEXT_PUBLIC_APP_PORT=<nuevo>
   NEXT_PUBLIC_APP_URL=http://172.16.76.186:<nuevo>
   ```
3. Replica el mismo cambio en `.env.development` — de ahí se hornea
   `NEXT_PUBLIC_APP_URL` en build.
4. Recrea el contenedor:
   ```bash
   docker compose -f docker-compose.development.yml up -d --build
   ```

### Tres trampas del puerto

**a) Compose sólo interpola desde `.env`.** Para sustituir `${NEXT_PUBLIC_APP_PORT}`
en el YAML, Docker Compose lee **únicamente** el archivo `.env` del directorio del
proyecto. Las entradas de `env_file:` (`.env.development`, `.env.local`) llegan al
proceso de dentro, pero **no** a la interpolación del YAML. Si defines el puerto
sólo en `.env.development`, el mapeo cae al default `8006` y parecerá que el
cambio "no se aplicó". Confirma siempre con:

```bash
docker compose -f docker-compose.development.yml config | grep -A2 ports
```

**b) `NEXT_PUBLIC_APP_URL` se hornea en build.** Es `NEXT_PUBLIC_*`: Next la
inlinea en el bundle durante `yarn build`, no se lee en runtime. La consume
`src/lib/seo.ts` para el origen canónico (metadata, Open Graph, sitemap). Si
cambias puerto o dominio y sólo haces `restart`, el sitio sigue anunciando la URL
vieja. **Siempre `--build`.** Si la imagen quedó con cachés sucias:

```bash
docker compose -f docker-compose.development.yml build --no-cache
docker compose -f docker-compose.development.yml up -d
```

**c) Si algún día se pone un reverse proxy, `NEXT_PUBLIC_APP_URL` es el origen
PÚBLICO.** El puerto interno (`8006`) deja de aparecer en la URL:

```dotenv
NEXT_PUBLIC_APP_PORT=8006                       # lo que escucha Nginx por detrás
NEXT_PUBLIC_APP_URL=https://dev.value.com.mx    # lo que ve el navegador
```

```nginx
location / {
    proxy_pass http://127.0.0.1:8006;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Hoy no hay proxy: se publica por HTTP plano en LAN y el puerto **sí** va en la URL.

---

## 5. Cambio de IPs de backend

Los backends viven en IPs internas y cambian entre entornos
(dev `172.16.0.206`, prod `172.16.0.142`). **No todas se comportan igual:**

| Variable | Alcance | ¿Reconstruir? | Qué sirve |
|---|---|---|---|
| `TRADEIN_URL` | Sólo servidor (runtime) | No — basta `restart` | Catálogo, detalle, citas |
| `NEXT_PUBLIC_PREESTUDIO_URL` | `NEXT_PUBLIC_*` (horneada) | **Sí — `--build`** | Pre-estudio / BC, cotizador |
| `PUSH_BACKEND_URL` | Sólo servidor (runtime) | No — basta `restart` | Suscripciones y envío de push |

Regla corta: **toda variable con prefijo `NEXT_PUBLIC_` se hornea en la imagen y
exige rebuild.** Las demás se leen en cada arranque del proceso.

Cambio sólo de variables de runtime:

```bash
vi .env
docker compose -f docker-compose.development.yml up -d --force-recreate
```

Cambio que toca alguna `NEXT_PUBLIC_*`:

```bash
vi .env .env.development   # los NEXT_PUBLIC_* se hornean desde .env.development
docker compose -f docker-compose.development.yml up -d --build
```

> `.env.development` está **commiteado** a propósito: sólo lleva valores públicos
> y hosts no secretos, y el `Dockerfile` lo necesita en build. Los tokens van en
> `.env`, que está en `.gitignore` y excluido en `.dockerignore` para que no
> acaben en una capa de la imagen.

### `host.docker.internal`

El compose declara `extra_hosts: host.docker.internal:host-gateway`. Si un backend
corre **en el mismo host** que el contenedor, apúntalo a ese nombre en vez de a
`localhost` (dentro del contenedor `localhost` es el propio contenedor):

```dotenv
PUSH_BACKEND_URL=http://host.docker.internal:9000
```

---

## 6. Secretos que hay que llenar en `.env`

| Variable | Nota |
|---|---|
| `TRADEIN_TOKEN` | Bearer del catálogo. Sólo servidor |
| `PREESTUDIO_TOKEN` | Bearer del webservice pre-estudio / BC. Sólo servidor |
| `RECAPTCHA_SECRET_KEY` | Sólo si `NEXT_PUBLIC_RECAPTCHA_ENABLED=true` |
| `PUSH_BACKEND_TOKEN` | Bearer hacia el backend de push |
| `WEBHOOK_SIGNING_SECRET` | HMAC-SHA256 del webhook `/api/events`. Genera con `openssl rand -hex 32` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Pública, pero **horneada**: cambiarla exige rebuild |

Nunca pongas prefijo `NEXT_PUBLIC_` a un secreto: Next lo publicaría en el bundle
del cliente.

---

## 7. Operación diaria

```bash
C=docker-compose.development.yml

docker compose -f $C logs -f web            # logs
docker compose -f $C restart web            # reinicio simple
docker compose -f $C up -d --force-recreate # aplicar cambios de runtime
docker compose -f $C up -d --build          # aplicar cambios NEXT_PUBLIC_* o de código
docker compose -f $C down                   # bajar
docker compose -f $C config                 # ver el YAML ya resuelto (puertos incluidos)
docker compose -f $C exec web env | sort    # ver el env real dentro del contenedor
```

---

## 8. Diagnóstico

| Síntoma | Causa probable | Arreglo |
|---|---|---|
| `env file .env not found` al arrancar | Falta el runtime env | `cp .env.development .env` |
| Cambié el puerto y sigue en 8006 | Puerto definido fuera de `.env` | Ponlo en `.env` y verifica con `docker compose config` |
| `bind: address already in use` | Puerto ocupado en el host | `ss -ltnp \| grep :<puerto>`, elige otro |
| Canonical / OG con la URL vieja | `NEXT_PUBLIC_APP_URL` horneada | `up -d --build` |
| Cambié `NEXT_PUBLIC_PREESTUDIO_URL` y no aplica | Variable horneada | `up -d --build` |
| Catálogo vacío o timeout | Sin VPN/LAN, o `TRADEIN_URL`/`TRADEIN_TOKEN` mal | Prueba desde el host: `curl -I http://172.16.0.206/servicio_api_value_tdin` |
| Contenedor arriba pero `curl` al host falla | Mapeo mal o firewall | `docker compose ps` y revisa la columna PORTS |
| Build falla en `yarn install --immutable` | `yarn.lock` desincronizado | Corre `yarn install` en local y commitea el lock |
