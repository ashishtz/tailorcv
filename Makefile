# Resume Builder - Docker Management
# Usage: make [target]

.PHONY: help build build-fresh up down restart logs logs-nextjs logs-nginx shell status health clean prune dev

# Default target
help:
	@echo "Resume Builder - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Build:"
	@echo "  build        Build containers (cached)"
	@echo "  build-fresh  Build containers without cache"
	@echo ""
	@echo "Run:"
	@echo "  up           Start all containers"
	@echo "  down         Stop and remove containers"
	@echo "  restart      Restart all containers"
	@echo ""
	@echo "Logs:"
	@echo "  logs         Follow logs for all containers"
	@echo "  logs-nextjs  Follow logs for Next.js container"
	@echo "  logs-nginx   Follow logs for nginx container"
	@echo ""
	@echo "Debug:"
	@echo "  shell        Open shell in Next.js container"
	@echo "  status       Show container status"
	@echo "  health       Check health endpoint"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean        Stop containers and remove images"
	@echo "  prune        Remove all unused Docker resources"
	@echo ""
	@echo "Development:"
	@echo "  dev          Run Next.js in development mode (no Docker)"

# Unset local env vars that might conflict with .env.docker
DOCKER_ENV = unset NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY NEXT_PUBLIC_URL OPENROUTER_API_KEY &&

# Build containers with cache
build:
	$(DOCKER_ENV) docker-compose --env-file .env.docker build

# Build containers without cache
build-fresh:
	$(DOCKER_ENV) docker-compose --env-file .env.docker build --no-cache

# Start containers
up:
	$(DOCKER_ENV) docker-compose --env-file .env.docker up -d

# Stop and remove containers
down:
	$(DOCKER_ENV) docker-compose --env-file .env.docker down

# Restart containers
restart:
	$(DOCKER_ENV) docker-compose --env-file .env.docker down
	$(DOCKER_ENV) docker-compose --env-file .env.docker up -d

# Follow all logs
logs:
	docker-compose --env-file .env.docker logs -f

# Follow Next.js logs
logs-nextjs:
	docker logs -f resume-nextjs

# Follow nginx logs
logs-nginx:
	docker logs -f resume-nginx

# Open shell in Next.js container
shell:
	docker exec -it resume-nextjs /bin/sh

# Show container status
status:
	@echo "=== Container Status ==="
	@docker-compose --env-file .env.docker ps
	@echo ""
	@echo "=== Resource Usage ==="
	@docker stats --no-stream resume-nextjs resume-nginx 2>/dev/null || true

# Check health endpoint
health:
	@echo "Health check: http://resume.local/api/health"
	@curl -s http://localhost/api/health | jq . 2>/dev/null || curl -s http://localhost/api/health

# Stop containers and remove images
clean:
	docker-compose --env-file .env.docker down --rmi local
	@echo "Containers stopped and local images removed"

# Remove all unused Docker resources (dangerous!)
prune:
	@echo "This will remove all unused Docker resources (containers, networks, images, volumes)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] && docker system prune -af || echo "Cancelled"

# Run development mode (no Docker)
dev:
	npm run dev
