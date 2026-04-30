#!/bin/sh
set -e

ENV_FILE="$(dirname "$0")/../.env"
COMPOSE_FILE="$(dirname "$0")/../docker-compose.yml"

if [ -f "$ENV_FILE" ]; then
  DB_TYPE=$(grep -E '^DB_TYPE=' "$ENV_FILE" | cut -d'=' -f2 | cut -d'#' -f1 | tr -d ' \r')
fi

if [ "$DB_TYPE" = "postgres" ]; then
  echo "DB_TYPE=postgres — starting Postgres..."
  docker compose -f "$COMPOSE_FILE" up -d postgres redis
elif [ "$DB_TYPE" = "mongo" ]; then
  echo "DB_TYPE=mongo — starting Mongo..."
  docker compose -f "$COMPOSE_FILE" up -d mongo redis
elif [ "$DB_TYPE" = "mock" ]; then
  echo "DB_TYPE=mock — starting Redis only..."
  docker compose -f "$COMPOSE_FILE" up -d redis

else
  echo "Unknown DB_TYPE: $DB_TYPE"
  echo "Expected: postgres | mongo | mock"
  exit 1
fi

cd "$(dirname "$0")/.." && npm-run-all --parallel dev:backend dev:frontend
