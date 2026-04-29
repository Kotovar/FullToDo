#!/bin/sh
# Считывает DB_TYPE из файла .env и при определенных условиях запускает Docker перед запуском разработки.
set -e

ENV_FILE="$(dirname "$0")/../.env"

if [ -f "$ENV_FILE" ]; then
  DB_TYPE=$(grep -E '^DB_TYPE=' "$ENV_FILE" | cut -d'=' -f2 | cut -d'#' -f1 | tr -d ' \r')
fi

if [ "$DB_TYPE" = "postgres" ]; then
  echo "DB_TYPE=postgres — starting Docker..."
  docker compose -f "$(dirname "$0")/../docker-compose.yml" up -d
fi

cd "$(dirname "$0")/.." && npm-run-all --parallel dev:backend dev:frontend
