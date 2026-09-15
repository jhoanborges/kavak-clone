# ─────────────────────────────────────────────────────────────────────────────
# Deploy SIN internet.
#
# El server de dev/prod no tiene salida a internet, así que `docker compose build`
# (que corre el Dockerfile: `yarn install` desde npm + pull de node:22-alpine)
# falla ahí. El flujo es:
#
#   MÁQUINA CON INTERNET            SERVER OFFLINE
#   ───────────────────            ──────────────
#   make prod-package     ── tar ─►  make prod-deploy
#   (build + save)          copia     (load + up, cero descargas)
#
# La imagen se construye una vez donde hay red, se exporta a un .tar.gz, se sube al
# server y ahí sólo se carga y se levanta. El contenedor arranca con las librerías
# ya horneadas en la imagen; no baja nada.
#
# Requisitos en el server (no dependen de internet):
#   - Docker Engine + Compose v2 ≥ 2.24
#   - `.env` presente (cp .env.production .env / cp .env.development .env y rellenar)
# ─────────────────────────────────────────────────────────────────────────────

SHELL := /bin/sh

# ── producción ──────────────────────────────────────────────────────────────
PROD_COMPOSE := docker-compose.prod.yml
PROD_IMAGE   := value-arrendadora:prod
PROD_TAR     := value-arrendadora-prod.tar.gz

# ── desarrollo ──────────────────────────────────────────────────────────────
DEV_COMPOSE  := docker-compose.development.yml
DEV_IMAGE    := value-arrendadora:dev
DEV_TAR      := value-arrendadora-dev.tar.gz

.PHONY: help \
        prod-build prod-save prod-package prod-load prod-up prod-deploy \
        prod-down prod-logs prod-ps prod-restart \
        dev-build dev-save dev-package dev-load dev-up dev-deploy \
        dev-down dev-logs dev-ps dev-restart

help: ## Lista los targets
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		sort | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# ═══════════════ MÁQUINA CON INTERNET (build) ═══════════════

prod-build: ## [internet] Construye la imagen de prod (baja libs + base)
	docker compose -f $(PROD_COMPOSE) build

prod-save: ## [internet] Exporta la imagen de prod a un .tar.gz para subir
	docker save $(PROD_IMAGE) | gzip > $(PROD_TAR)
	@echo "Creado $(PROD_TAR) ($$(du -h $(PROD_TAR) | cut -f1)). Súbelo al server."

prod-package: prod-build prod-save ## [internet] build + save en un paso

# ═══════════════ SERVER OFFLINE (deploy) ═══════════════

prod-load: ## [offline] Carga la imagen desde el .tar.gz (sin red)
	gunzip -c $(PROD_TAR) | docker load

prod-up: ## [offline] Levanta con la imagen cargada, SIN build ni descargas
	docker compose -f $(PROD_COMPOSE) up -d --no-build

prod-deploy: prod-load prod-up ## [offline] load + up
	docker compose -f $(PROD_COMPOSE) ps

# ═══════════════ operación ═══════════════

prod-down: ## Baja el contenedor de prod
	docker compose -f $(PROD_COMPOSE) down
prod-logs: ## Sigue los logs de prod
	docker compose -f $(PROD_COMPOSE) logs -f web
prod-ps: ## Estado del contenedor de prod
	docker compose -f $(PROD_COMPOSE) ps
prod-restart: ## Reinicia prod (sin recrear)
	docker compose -f $(PROD_COMPOSE) restart web

# ═══════════════ development (mismo flujo) ═══════════════

dev-build: ## [internet] Construye la imagen de development
	docker compose -f $(DEV_COMPOSE) build
dev-save: ## [internet] Exporta la imagen de development a .tar.gz
	docker save $(DEV_IMAGE) | gzip > $(DEV_TAR)
	@echo "Creado $(DEV_TAR) ($$(du -h $(DEV_TAR) | cut -f1)). Súbelo al server."
dev-package: dev-build dev-save ## [internet] build + save
dev-load: ## [offline] Carga la imagen de development
	gunzip -c $(DEV_TAR) | docker load
dev-up: ## [offline] Levanta development sin build
	docker compose -f $(DEV_COMPOSE) up -d --no-build
dev-deploy: dev-load dev-up ## [offline] load + up
	docker compose -f $(DEV_COMPOSE) ps
dev-down: ## Baja development
	docker compose -f $(DEV_COMPOSE) down
dev-logs: ## Logs de development
	docker compose -f $(DEV_COMPOSE) logs -f web
dev-ps: ## Estado de development
	docker compose -f $(DEV_COMPOSE) ps
dev-restart: ## Reinicia development
	docker compose -f $(DEV_COMPOSE) restart web
