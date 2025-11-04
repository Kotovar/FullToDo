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
- HTTP-модуль (текущая версия)
- Express (в разработке)
- Nest.js (в разработке)
- Mock-база (JSON)
- `MongoDB` (в разработке)
- `postgres` (в разработке)
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

Запустить проект (из корня проекта):
```bash
npm run dev
```
Будет запущен frontend и backend одновременно.

Файл .env содержит:

- `PORT` - порт для backend-сервера (по умолчанию `5000`)
- `DB_TYPE` - тип базы данных (`mock`/`mongo`/`postgres`)
- `SERVER_TYPE` - тип сервера (`http`/`express`/`nextJs`)
- `VITE_URL` - базовый URL для фронтенда

## Планы развития
- Добавление поддержки 3 серверов (`http`/`express`/`nextJs`)
- Добавление поддержки 2 БД (`mongo`/`postgres`)
- Возможность переключения между разными серверами и БД
- Реализация функционала приоритетов задач

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
- HTTP module (current version)
- Express (in development)
- Nest.js (in development)
- Mock database (JSON)
- `MongoDB` (in development)
- `postgres` (in development)
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
Run the project (from project root):

```bash
npm run dev
```
This command starts both frontend and backend simultaneously.

The .env file contains:

- `PORT` - port for backend server (default `5000`)
- `DB_TYPE` - database type (`mock`/`mongo`/`postgres`)
- `SERVER_TYPE` - server type (`http`/`express`/`nextJs`)
- `VITE_URL` - base URL for frontend

## Roadmap
- Adding support for 3 servers (`http`/`express`/`nextJs`)
- Adding support for 2 databases (`mongo`/`postgres`)
- Ability to switch between different servers and databases
- Implementation of task priorities functionality