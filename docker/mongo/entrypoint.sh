#!/bin/bash
set -e

KEYFILE_PATH=/data/configdb/mongo-keyfile

printf '%s\n' "${MONGO_KEYFILE:-fulltodo-local-replica-set-key}" > "$KEYFILE_PATH"
chmod 600 "$KEYFILE_PATH"
chown mongodb:mongodb "$KEYFILE_PATH" 2>/dev/null || true

exec docker-entrypoint.sh mongod \
  --replSet "${MONGO_REPLICA_SET:-rs0}" \
  --bind_ip_all \
  --keyFile "$KEYFILE_PATH"
