# Docker Compose

Документ описывает инфраструктуру проекта и правила запуска сервисов в зависимости от `DB_TYPE`.

---

## Общая логика

Тип базы данных задаётся в `.env`:

```env
DB_TYPE=postgres | mongo | mock
```

В зависимости от значения поднимаются разные сервисы:

| DB_TYPE  | Запускаемые сервисы |
| -------- | ------------------- |
| postgres | postgres + redis    |
| mongo    | mongo + redis       |
| mock     | только redis        |

Запуск происходит через скрипт, который выбирает нужные сервисы:

```sh
docker compose up -d <services>
```

---

## Postgres

Используется официальный образ:

- PostgreSQL (image: `postgres:18`)

### Порт

```yaml
'${DB_PORT}:5432'
```

- снаружи — порт из `.env`
- внутри контейнера — `5432`

### Данные

```yaml
postgres_data:/var/lib/postgresql/data
```

- данные сохраняются между перезапусками
- удаляются только вручную (`docker volume rm`)

### Переменные окружения

```env
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

---

## MongoDB

Используется официальный образ:

- MongoDB (image: `mongo:8`)

Mongo запускается как single-node replica set (`MONGO_REPLICA_SET=rs0`), потому что MongoDB-транзакции работают только в replica set или sharded cluster.

### Порт

```yaml
'${MONGO_PORT}:27017'
```

### Данные

```yaml
mongo_data:/data/db
```

### Переменные окружения

```env
MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD
MONGO_INITDB_DATABASE
MONGO_REPLICA_SET
MONGO_KEYFILE
```

`MONGO_KEYFILE` используется MongoDB для internal authentication replica set. В локальном окружении это dev-only secret из `.env`.

---

## Redis

Используется во всех режимах:

- postgres
- mongo
- mock

Образ:

- Redis (`redis:8.6-trixie`)

### Порт

```yaml
'${REDIS_PORT}:6379'
```

### Данные

```yaml
redis_data:/data
```

### Конфигурация

```yaml
redis-server --appendonly yes
```

Включает AOF-персистентность (лог операций).

---

## Volumes

Именованные тома:

```yaml
postgres_data
mongo_data
redis_data
```

### Зачем нужны

- сохраняют данные между перезапусками контейнеров
- управляются Docker

### Удаление

```sh
docker volume rm <volume_name>
```

Пример:

```sh
docker volume rm fulltodo_postgres_data
```

---

## Безопасность

Используются базовые ограничения:

### no-new-privileges

```yaml
security_opt:
  - no-new-privileges:true
```

Запрещает процессам повышать привилегии внутри контейнера.

---

## Ограничение ресурсов

```yaml
deploy:
  resources:
    limits:
      memory: 512m
      cpus: '0.5'
```

Контейнер не может:

- использовать больше 512MB RAM
- занять больше 50% одного CPU

---

## Пример .env

```env
DB_TYPE=postgres

DB_PORT=5433
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=todo

MONGO_PORT=27017
MONGO_USER=root
MONGO_PASSWORD=root
MONGO_DB=todo
MONGO_REPLICA_SET=rs0
MONGO_KEYFILE=fulltodoLocalReplicaSetKey1234567890

REDIS_PORT=6379
```
