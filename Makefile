# Bereshit
# Manage Docker

.PHONY: help build up down start stop restart logs clean shell exec

# Default command - show help
help:
	@echo "Available commands:"
	@echo "  up       - Start containers in background"
	@echo "  start    - Start containers in background (alias for up)"
	@echo "  down     - Stop and remove containers"
	@echo "  stop     - Stop containers (alias for down)"
	@echo "  restart  - Restart containers"
	@echo "  logs     - Show container logs"
	@echo "  clean    - Remove unused containers, images and volumes"
	@echo "  status   - Show container status"
	@echo "  shell    - Enter container with bash shell"

# Start containers in background
up:
	docker-compose -f infra/docker-compose.yml up -d --build

# Alias for up
start: up

# Stop and remove containers
down:
	docker-compose -f infra/docker-compose.yml down

# Alias for down
stop: down

# Restart containers
restart: down up

# Show container logs
logs:
	docker-compose -f infra/docker-compose.yml logs -f

# Remove unused containers, images and volumes
clean:
	docker-compose -f infra/docker-compose.yml down --rmi all --volumes --remove-orphans
	docker system prune -f

# Show container status
status:
	docker-compose -f infra/docker-compose.yml ps

# Enter container with bash shell
shell:
	docker-compose -f infra/docker-compose.yml exec wails-app bash
