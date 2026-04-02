# FullToDo

[![CI/CD](https://github.com/Kotovar/FullToDo/actions/workflows/main.yml/badge.svg)](https://github.com/Kotovar/FullToDo/actions/workflows/main.yml)

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

### Переменные окружения (.env)

| Переменная    | Описание                                      | Значения                        |
|---------------|-----------------------------------------------|---------------------------------|
| `PORT`        | Порт backend-сервера                          | `5000` (по умолчанию)           |
| `SERVER_TYPE` | Тип сервера                                   | `http` / `express `              |
| `DB_TYPE`     | Тип базы данных                               | `mock` / `postgres`             |
| `VITE_URL`    | Базовый URL для фронтенда                     | `http://localhost:5000`         |
| `DB_USER`     | Пользователь PostgreSQL                       | `postgres`                      |
| `DB_PASSWORD` | Пароль PostgreSQL                             | —                               |
| `DB_HOST`     | Хост PostgreSQL                               | `localhost`                     |
| `DB_PORT`     | Порт PostgreSQL                               | `5432`                          |
| `DB_NAME`     | Имя базы данных                               | `fulltodo`                      |

## Планы развития
- Система логирования (pino)
- Авторизация и регистрация
- Добавление поддержки ещё одной БД (`mongo`)
- Добавление поддержки ещё двух серверов (`express`/`nextJs`)
---

#  FullToDo (English version)

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

### Environment variables (.env)

| Variable      | Description                          | Values                          |
|---------------|--------------------------------------|---------------------------------|
| `PORT`        | Backend server port                  | `5000` (default)                |
| `SERVER_TYPE` | Server type                          | `http` / `express`              |
| `DB_TYPE`     | Database type                        | `mock` / `postgres`             |
| `VITE_URL`    | Base URL for frontend                | `http://localhost:5000`         |
| `DB_USER`     | PostgreSQL user                      | `postgres`                      |
| `DB_PASSWORD` | PostgreSQL password                  | —                               |
| `DB_HOST`     | PostgreSQL host                      | `localhost`                     |
| `DB_PORT`     | PostgreSQL port                      | `5432`                          |
| `DB_NAME`     | Database name                        | `fulltodo`                      |

## Roadmap
- Logging system (pino)
- Authentication and registration
- Added support for one more database (`mongo`)
- Added support for two more servers (`express`/`nextJs`)
