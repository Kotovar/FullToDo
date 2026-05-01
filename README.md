# FullToDo

[![CI/CD](https://github.com/Kotovar/FullToDo/actions/workflows/main.yml/badge.svg)](https://github.com/Kotovar/FullToDo/actions/workflows/main.yml)
[![React Doctor](https://www.react.doctor/share/badge?p=fulltodo&s=99&w=2&f=2)](https://www.react.doctor/share?p=fulltodo&s=99&w=2&f=2)

Pet проект для управления задачами (todo-приложение) с возможностью выбора различных бэкенд-технологий.

## Особенности

- Создание/удаление/редактирование блокнотов и задач
- Детали задач:
  - Название, описание, срок выполнения
  - Подзадачи
- Фильтрация и сортировка:
  - По статусу (все/выполненные/невыполненные)
  - По дате создания/выполнения
- Поиск по задачам
- Перенос задач из одного блокнота в другой
- Регистрация, вход, верификация email и восстановление пароля
- Локализация (русский/английский)
- Темная/светлая тема

## Технологии

### Frontend

- React + TypeScript
- Vite
- TailwindCSS
- React Query
- i18next
- Vitest

### Backend

- Node.js + TypeScript
- HTTP-модуль
- Express
- Mock-база (JSON-в памяти)
- PostgreSQL
- MongoDB
- Redis (rate limiting auth endpoints)
- Pino (логирование)
- Email providers: Mailtrap Sandbox / Resend
- React Email (шаблоны писем)
- Swagger UI
- Nest.js (в разработке)
- Vitest

## Запуск

Скопировать файл окружения:

```bash
cp .env.example .env
```

Установить зависимости:

```bash
npm install
```

### С mock-базой

В `.env` указать:

```
DB_TYPE=mock
SERVER_TYPE=http # или express
```

Запустить (из корня проекта):

```bash
npm run dev
```

Команда поднимет Redis для rate limiting, затем запустит frontend и backend одновременно. Контейнер БД для mock-режима не нужен.

### С PostgreSQL и Redis (через Docker)

В `.env` указать:

```
DB_TYPE=postgres
SERVER_TYPE=http # или express
```

Запустить (из корня проекта):

```bash
npm run dev
```

Команда поднимет контейнеры с PostgreSQL и Redis, затем запустит frontend и backend одновременно.

### С MongoDB и Redis (через Docker)

В `.env` указать:

```
DB_TYPE=mongo
SERVER_TYPE=http # или express
```

Запустить (из корня проекта):

```bash
npm run dev
```

Команда поднимет контейнеры с MongoDB и Redis, затем запустит frontend и backend одновременно.

MongoDB запускается как single-node replica set (`MONGO_REPLICA_SET=rs0`), потому что репозитории используют транзакции для операций, где нужно согласованно менять несколько коллекций.

Остановить контейнеры:

```bash
npm run stop:docker
```

### Redis

Redis используется для rate limiting на auth endpoints.

Подключиться к Redis внутри Docker-контейнера:

```bash
docker exec -it todo-redis redis-cli
```

Полезные команды в `redis-cli`:

```redis
PING
DBSIZE
SCAN 0 MATCH rate-limit:* COUNT 100
GET rate-limit:auth:login:ip:::ffff:127.0.0.1
TTL rate-limit:auth:login:ip:::ffff:127.0.0.1
DEL rate-limit:auth:login:ip:::ffff:127.0.0.1
```

`SCAN` показывает ключи лимитера. `GET` показывает количество попыток, `TTL` — сколько секунд осталось до автоматического удаления ключа, `DEL` сбрасывает конкретный лимит.

Для логина создаются два типа ключей: общий лимит по IP (`auth:login:ip`) и лимит по аккаунту (`auth:login:account:<sha256-email>`). Email в ключах не хранится напрямую.

### Swagger UI

После запуска сервера документация API доступна по адресу:

```
http://localhost:5000/api-docs
```

### Аутентификация

Доступны два способа входа:

- email + пароль;
- Google OAuth.

Если пользователь сначала зарегистрировался через email + пароль, а затем входит через Google с тем же подтвержденным email, аккаунт связывается с Google и дальше доступен вход обоими способами.

Восстановление пароля:

1. На странице входа открыть `Забыли пароль?`.
2. Ввести email.
3. Backend всегда возвращает нейтральный успешный ответ, чтобы не раскрывать существование аккаунта.
4. Если email принадлежит пользователю с локальным паролем, отправляется письмо со ссылкой `/reset-password?token=...`.
5. На странице reset password пользователь вводит новый пароль и подтверждение.
6. После успешной смены пароля все refresh-токены пользователя удаляются, текущие сессии становятся невалидными, frontend сбрасывает auth-cache и редиректит на `/login`.

Текущая реализация reset-ссылки использует stateless JWT на 30 минут. Токен не хранится в БД и пока не является одноразовым.

### Почтовый сервис

Письма отправляются через выбранный email-провайдер. Провайдер переключается через `EMAIL_PROVIDER` в `.env`:

- `mailtrap` — Mailtrap Sandbox через SMTP/Nodemailer. Подходит для локальной разработки: письма не доставляются реальным пользователям, а попадают в песочницу.
- `resend` — Resend API. Подходит для проверки реальной доставки и production-like сценариев.

Отправляются письма:

- Верификация email при регистрации
- Восстановление пароля
- Уведомление о смене пароля
- Уведомление об удалении аккаунта

Шаблоны писем написаны с помощью [React Email](https://react.email) и находятся в `backend/src/emails/`.

Для Mailtrap:

```env
EMAIL_PROVIDER=mailtrap
EMAIL_FROM='FullToDo <noreply@fulltodo.dev>'
MAILTRAP_USER='...'
MAILTRAP_PASS='...'
```

Для Resend в локальной разработке можно использовать тестовый отправитель:

```env
EMAIL_PROVIDER=resend
EMAIL_FROM='FullToDo <onboarding@resend.dev>'
RESEND_API_KEY='re_...'
```

При использовании `onboarding@resend.dev` Resend разрешает отправку только на email в Resend-аккаунт. Для отправки на любые адреса нужно подтвердить свой домен в Resend и указать отправителя с этого домена:

```env
EMAIL_FROM='FullToDo <noreply@your-verified-domain.com>'
```

Для просмотра превью шаблонов в браузере:

```bash
npm run email --workspace=fulltodo_backend
```

Откроется превью на `http://localhost:3000`.

### Переменные окружения (.env)

| Переменная                    | Описание                                       | Значения                      |
| ----------------------------- | ---------------------------------------------- | ----------------------------- |
| `PORT`                        | Порт backend-сервера                           | `5000` (по умолчанию)         |
| `SERVER_TYPE`                 | Тип сервера                                    | `http` / `express`            |
| `DB_TYPE`                     | Тип базы данных                                | `mock` / `postgres` / `mongo` |
| `VITE_URL`                    | Базовый URL для фронтенда                      | `http://localhost:5000`       |
| `DB_USER`                     | Пользователь PostgreSQL                        | `postgres`                    |
| `DB_PASSWORD`                 | Пароль PostgreSQL                              | —                             |
| `DB_HOST`                     | Хост PostgreSQL                                | `localhost`                   |
| `DB_PORT`                     | Порт PostgreSQL                                | `5432`                        |
| `DB_NAME`                     | Имя базы данных                                | `fulltodo`                    |
| `MONGO_USER`                  | Пользователь MongoDB                           | `root`                        |
| `MONGO_PASSWORD`              | Пароль MongoDB                                 | `root`                        |
| `MONGO_HOST`                  | Хост MongoDB                                   | `localhost`                   |
| `MONGO_PORT`                  | Порт MongoDB                                   | `27017`                       |
| `MONGO_DB`                    | Имя MongoDB базы                               | `fulltodo`                    |
| `MONGO_REPLICA_SET`           | Имя MongoDB replica set                        | `rs0`                         |
| `MONGO_KEYFILE`               | Ключ replica set для локального Docker MongoDB | —                             |
| `REDIS_HOST`                  | Хост Redis                                     | `localhost`                   |
| `REDIS_PORT`                  | Порт Redis                                     | `6379`                        |
| `EMAIL_PROVIDER`              | Почтовый провайдер                             | `mailtrap` / `resend`         |
| `EMAIL_FROM`                  | Адрес отправителя писем                        | зависит от провайдера         |
| `MAILTRAP_USER`               | SMTP логин Mailtrap                            | —                             |
| `MAILTRAP_PASS`               | SMTP пароль Mailtrap                           | —                             |
| `RESEND_API_KEY`              | API-ключ Resend                                | —                             |
| `PASSWORD_RESET_TOKEN_SECRET` | Секрет JWT для восстановления пароля           | —                             |

## Планы развития

- Добавление поддержки ещё одного сервера (`nextJs`)

---

# FullToDo (English version)

A pet project for task management (todo app) with the ability to choose different backend technologies.

## Features

- Create/delete/edit notebooks and tasks
- Task details:
  - Title, description, due date
  - Subtasks
- Filtering and sorting:
  - By status (all/completed/active)
  - By creation/due date
- Task search
- Transferring tasks from one notebook to another
- Registration, login, email verification, and password recovery
- Localization (Russian/English)
- Dark/light theme

## Technologies

### Frontend

- React + TypeScript
- Vite
- TailwindCSS
- React Query
- i18next
- Vitest

### Backend

- Node.js + TypeScript
- HTTP module
- Express
- Mock database (in-memory JSON)
- PostgreSQL
- MongoDB
- Redis (auth endpoint rate limiting)
- Pino (logging)
- Email providers: Mailtrap Sandbox / Resend
- React Email (email templates)
- Swagger UI
- Nest.js (in development)
- Vitest

## Running

Copy environment file:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

### With mock database

Set in `.env`:

```
DB_TYPE=mock
SERVER_TYPE=http # or express
```

Run (from project root):

```bash
npm run dev
```

This command starts Redis for rate limiting, then runs both frontend and backend simultaneously. Mock mode does not need a database container.

### With PostgreSQL and Redis (via Docker)

Set in `.env`:

```
DB_TYPE=postgres
SERVER_TYPE=http # or express
```

Run (from project root):

```bash
npm run dev
```

This command starts PostgreSQL and Redis containers, then runs both frontend and backend simultaneously.

### With MongoDB and Redis (via Docker)

Set in `.env`:

```
DB_TYPE=mongo
SERVER_TYPE=http # or express
```

Run (from project root):

```bash
npm run dev
```

This command starts MongoDB and Redis containers, then runs both frontend and backend simultaneously.

MongoDB runs as a single-node replica set (`MONGO_REPLICA_SET=rs0`) because repositories use transactions for operations that must update multiple collections consistently.

Stop the containers:

```bash
npm run stop:docker
```

### Redis

Redis is used for rate limiting on auth endpoints.

Connect to Redis inside the Docker container:

```bash
docker exec -it todo-redis redis-cli
```

Useful commands in `redis-cli`:

```redis
PING
DBSIZE
SCAN 0 MATCH rate-limit:* COUNT 100
GET rate-limit:auth:login:ip:::ffff:127.0.0.1
TTL rate-limit:auth:login:ip:::ffff:127.0.0.1
DEL rate-limit:auth:login:ip:::ffff:127.0.0.1
```

`SCAN` lists limiter keys. `GET` shows the number of attempts, `TTL` shows how many seconds remain before automatic key deletion, and `DEL` resets a specific limit.

Login creates two key types: a global IP limit (`auth:login:ip`) and an account limit (`auth:login:account:<sha256-email>`). Email is not stored directly in Redis keys.

### Swagger UI

After starting the server, the API documentation is available at:

```
http://localhost:5000/api-docs
```

### Authentication

Two sign-in methods are available:

- email + password;
- Google OAuth.

If a user first registers with email + password and later signs in with Google using the same verified email, the account is linked to Google and can be used with both sign-in methods.

Password recovery flow:

1. Open `Forgot password?` from the login page.
2. Enter an email.
3. The backend always returns a neutral success response so account existence is not leaked.
4. If the email belongs to a user with a local password, an email is sent with a `/reset-password?token=...` link.
5. On the reset password page, the user enters and confirms a new password.
6. After a successful reset, all user refresh tokens are deleted, existing sessions become invalid, the frontend clears auth cache, and the user is redirected to `/login`.

The current reset link implementation uses a stateless JWT valid for 30 minutes. The token is not stored in the database and is not single-use yet.

### Email service

Emails are sent through the selected email provider. The provider is selected with `EMAIL_PROVIDER` in `.env`:

- `mailtrap` — Mailtrap Sandbox via SMTP/Nodemailer. Good for local development: emails are not delivered to real users and are visible only in the sandbox.
- `resend` — Resend API. Good for checking real delivery and production-like flows.

Sent emails:

- Email verification on registration
- Password recovery
- Password change notification
- Account deletion notification

Email templates are built with [React Email](https://react.email) and located in `backend/src/emails/`.

For Mailtrap:

```env
EMAIL_PROVIDER=mailtrap
EMAIL_FROM='FullToDo <noreply@fulltodo.dev>'
MAILTRAP_USER='...'
MAILTRAP_PASS='...'
```

For local Resend testing, use Resend's test sender:

```env
EMAIL_PROVIDER=resend
EMAIL_FROM='FullToDo <onboarding@resend.dev>'
RESEND_API_KEY='re_...'
```

When using `onboarding@resend.dev`, Resend only allows sending to the email address of your Resend account. To send to arbitrary recipients, verify your own domain in Resend and use a sender from that domain:

```env
EMAIL_FROM='FullToDo <noreply@your-verified-domain.com>'
```

To preview templates in the browser:

```bash
npm run email --workspace=fulltodo_backend
```

Preview opens at `http://localhost:3000`.

### Environment variables (.env)

| Variable                      | Description                          | Values                        |
| ----------------------------- | ------------------------------------ | ----------------------------- |
| `PORT`                        | Backend server port                  | `5000` (default)              |
| `SERVER_TYPE`                 | Server type                          | `http` / `express`            |
| `DB_TYPE`                     | Database type                        | `mock` / `postgres` / `mongo` |
| `VITE_URL`                    | Base URL for frontend                | `http://localhost:5000`       |
| `DB_USER`                     | PostgreSQL user                      | `postgres`                    |
| `DB_PASSWORD`                 | PostgreSQL password                  | —                             |
| `DB_HOST`                     | PostgreSQL host                      | `localhost`                   |
| `DB_PORT`                     | PostgreSQL port                      | `5432`                        |
| `DB_NAME`                     | Database name                        | `fulltodo`                    |
| `MONGO_USER`                  | MongoDB user                         | `root`                        |
| `MONGO_PASSWORD`              | MongoDB password                     | `root`                        |
| `MONGO_HOST`                  | MongoDB host                         | `localhost`                   |
| `MONGO_PORT`                  | MongoDB port                         | `27017`                       |
| `MONGO_DB`                    | MongoDB database name                | `fulltodo`                    |
| `MONGO_REPLICA_SET`           | MongoDB replica set name             | `rs0`                         |
| `MONGO_KEYFILE`               | Local Docker MongoDB replica set key | —                             |
| `REDIS_HOST`                  | Redis host                           | `localhost`                   |
| `REDIS_PORT`                  | Redis port                           | `6379`                        |
| `EMAIL_PROVIDER`              | Email provider                       | `mailtrap` / `resend`         |
| `EMAIL_FROM`                  | Email sender address                 | depends on provider           |
| `MAILTRAP_USER`               | Mailtrap SMTP login                  | —                             |
| `MAILTRAP_PASS`               | Mailtrap SMTP password               | —                             |
| `RESEND_API_KEY`              | Resend API key                       | —                             |
| `PASSWORD_RESET_TOKEN_SECRET` | Password reset JWT secret            | —                             |

## Roadmap

- Add support for one more server (`nextJs`)
