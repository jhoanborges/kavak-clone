# Makefile — despliegue Docker (dev / prod) para el servidor.
# Uso: make dev-up | make dev-down | make prod-up | make prod-down
# Server CON internet: build corre en el propio server (git pull + build + up).
# Requiere Docker + Docker Compose v2. Sin grupo docker -> usa: sudo make <target>

SHELL := /bin/sh

DEV    := docker-compose.development.yml
PROD   := docker-compose.prod.yml
BRANCH := master

.DEFAULT_GOAL := help
.PHONY: help dev-up dev-down dev-logs dev-ps dev-restart \
        prod-up prod-down prod-logs prod-ps prod-restart

## --------------------------- DEV ---------------------------

# Flujo completo dev: pull -> .env -> build -> down -> up (un comando).
# El compose de dev exige `.env` (runtime), por eso se copia de .env.development.
dev-up:
	git pull origin $(BRANCH)
	cp .env.development .env
	docker compose -f $(DEV) build
	docker compose -f $(DEV) down
	docker compose -f $(DEV) up -d
	docker compose -f $(DEV) ps

dev-down:
	docker compose -f $(DEV) down

dev-logs:
	docker compose -f $(DEV) logs -f web

dev-ps:
	docker compose -f $(DEV) ps

dev-restart:
	docker compose -f $(DEV) restart web

## -------------------------- PROD ---------------------------

# Flujo completo prod: pull -> .env -> build -> down -> up.
# prod lee runtime desde .env (copiado de .env.production).
prod-up:
	git pull origin $(BRANCH)
	cp .env.production .env
	docker compose -f $(PROD) build
	docker compose -f $(PROD) down
	docker compose -f $(PROD) up -d
	docker compose -f $(PROD) ps

prod-down:
	docker compose -f $(PROD) down

prod-logs:
	docker compose -f $(PROD) logs -f web

prod-ps:
	docker compose -f $(PROD) ps

prod-restart:
	docker compose -f $(PROD) restart web

## --------------------------------------------------------

help:
	@echo "Targets:"
	@echo "  make dev-up       pull + .env + build + down + up (development)"
	@echo "  make dev-down     baja development"
	@echo "  make dev-logs     logs -f (development)"
	@echo "  make dev-ps       estado (development)"
	@echo "  make dev-restart  reinicia development"
	@echo "  make prod-up      pull + .env + build + down + up (production)"
	@echo "  make prod-down    baja production"
	@echo "  make prod-logs    logs -f (production)"
	@echo "  make prod-ps      estado (production)"
	@echo "  make prod-restart reinicia production"
