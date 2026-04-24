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
- Express (в разработке)
- Mock-база (JSON-в памяти)
- PostgreSQL
- Pino (логирование)
- Nodemailer + Mailtrap Sandbox (отправка писем)
- React Email (шаблоны писем)
- Swagger UI
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

### С mock-базой (без Docker)

В `.env` указать:

```
DB_TYPE=mock
SERVER_TYPE=http
```

Запустить (из корня проекта):

```bash
npm run dev
```

### С PostgreSQL (через Docker)

В `.env` указать:

```
DB_TYPE=postgres
SERVER_TYPE=http
```

Запустить (из корня проекта):

```bash
npm run dev:docker
```

Команда поднимет контейнер с PostgreSQL и запустит frontend и backend одновременно.

Остановить контейнер:

```bash
npm run stop:docker
```

### Swagger UI

После запуска сервера документация API доступна по адресу:

```
http://localhost:5000/api-docs
```

### Почтовый сервис

Письма отправляются через [Mailtrap Sandbox](https://mailtrap.io/inboxes) — реальным пользователям не доставляются, только в песочницу. Используется для разработки.

Отправляются письма:

- Верификация email при регистрации
- Уведомление о смене пароля
- Уведомление об удалении аккаунта

Шаблоны писем написаны с помощью [React Email](https://react.email) и находятся в `backend/src/emails/`.

Для просмотра превью шаблонов в браузере:

```bash
npm run email --workspace=fulltodo_backend
```

Откроется превью на `http://localhost:3000`.

### Переменные окружения (.env)

| Переменная      | Описание                  | Значения                |
| --------------- | ------------------------- | ----------------------- |
| `PORT`          | Порт backend-сервера      | `5000` (по умолчанию)   |
| `SERVER_TYPE`   | Тип сервера               | `http` / `express`      |
| `DB_TYPE`       | Тип базы данных           | `mock` / `postgres`     |
| `VITE_URL`      | Базовый URL для фронтенда | `http://localhost:5000` |
| `DB_USER`       | Пользователь PostgreSQL   | `postgres`              |
| `DB_PASSWORD`   | Пароль PostgreSQL         | —                       |
| `DB_HOST`       | Хост PostgreSQL           | `localhost`             |
| `DB_PORT`       | Порт PostgreSQL           | `5432`                  |
| `DB_NAME`       | Имя базы данных           | `fulltodo`              |
| `MAILTRAP_USER` | SMTP логин Mailtrap       | —                       |
| `MAILTRAP_PASS` | SMTP пароль Mailtrap      | —                       |

## Планы развития

- Добавление поддержки ещё одной БД (`mongo`)
- Добавление поддержки ещё двух серверов (`express`/`nextJs`)
- Фронтенд: UI авторизации и регистрации

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
- Express (in development)
- Mock database (in-memory JSON)
- PostgreSQL
- Pino (logging)
- Nodemailer + Mailtrap Sandbox (transactional emails)
- React Email (email templates)
- Swagger UI
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

### With mock database (no Docker)

Set in `.env`:

```
DB_TYPE=mock
SERVER_TYPE=http
```

Run (from project root):

```bash
npm run dev
```

### With PostgreSQL (via Docker)

Set in `.env`:

```
DB_TYPE=postgres
SERVER_TYPE=http
```

Run (from project root):

```bash
npm run dev:docker
```

This command starts a PostgreSQL container and runs both frontend and backend simultaneously.

Stop the container:

```bash
npm run stop:docker
```

### Swagger UI

After starting the server, the API documentation is available at:

```
http://localhost:5000/api-docs
```

### Email service

Emails are sent via [Mailtrap Sandbox](https://mailtrap.io/inboxes) — not delivered to real users, sandbox only. Used for development.

Sent emails:

- Email verification on registration
- Password change notification
- Account deletion notification

Email templates are built with [React Email](https://react.email) and located in `backend/src/emails/`.

To preview templates in the browser:

```bash
npm run email --workspace=fulltodo_backend
```

Preview opens at `http://localhost:3000`.

### Environment variables (.env)

| Variable        | Description            | Values                  |
| --------------- | ---------------------- | ----------------------- |
| `PORT`          | Backend server port    | `5000` (default)        |
| `SERVER_TYPE`   | Server type            | `http` / `express`      |
| `DB_TYPE`       | Database type          | `mock` / `postgres`     |
| `VITE_URL`      | Base URL for frontend  | `http://localhost:5000` |
| `DB_USER`       | PostgreSQL user        | `postgres`              |
| `DB_PASSWORD`   | PostgreSQL password    | —                       |
| `DB_HOST`       | PostgreSQL host        | `localhost`             |
| `DB_PORT`       | PostgreSQL port        | `5432`                  |
| `DB_NAME`       | Database name          | `fulltodo`              |
| `MAILTRAP_USER` | Mailtrap SMTP login    | —                       |
| `MAILTRAP_PASS` | Mailtrap SMTP password | —                       |

## Roadmap

- Added support for one more database (`mongo`)
- Added support for two more servers (`express`/`nextJs`)
- Frontend: auth and registration UI
