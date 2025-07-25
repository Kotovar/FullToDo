# FullToDo

[![CI/CD](https://github.com/Kotovar/FullToDo/actions/workflows/main.yml/badge.svg)](https://github.com/Kotovar/FullToDo/actions/workflows/main.yml)

Pet проект для управления задачами (todo-приложение) с возможностью выбора различных бэкенд-технологий.

## Особенности

- Создание/удаление/редактирование блокнотов и задач
- Детали задач:
  - Название, описание, срок выполнения
  - Подзадачи
  - Приоритет (в разработке)
- Фильтрация и сортировка:
  - По статусу (все/выполненные/невыполненные)
  - По дате создания/выполнения
  - По приоритету
- Поиск по задачам
- Локализация (русский/английский)
- Темная/светлая тема

## Технологии

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- React Query
- i18next
- Vitest (тесты с покрытием 99-100%)

### Backend
- Node.js + TypeScript
- HTTP-модуль (текущая версия)
- Express (в разработке)
- Nest.js (в разработке)
- Mock-база (JSON)
- Vitest (тесты с покрытием 99-100%)

## Запуск
1. Установить зависимости:
```bash
npm install
```

2. Запустить проект (из корня проекта):
```bash
npm run dev
```
Будет запущен frontend и backend одновременно.

## Планы развития
- Добавление поддержки 3 серверов (HTTP, Express, Nest.js)
- Добавление поддержки 2 БД (MongoDB, PostgreSQL)
- Возможность переключения между разными серверами и БД
- Реализация функционала приоритетов задач

#  FullToDo (English version)

A pet project for task management (todo app) with the ability to choose different backend technologies.

## Features
- Create/delete/edit notebooks and tasks

- Task details:

  - Title, description, due date

  - Subtasks

  - Priority (in development)

- Filtering and sorting:

  - By status (all/completed/active)

  - By creation/due date

  - By priority

- Task search

- Localization (Russian/English)

- Dark/light theme

## Technologies

### Frontend

- React + TypeScript

- Vite

- TailwindCSS

- React Query

- i18next

- Vitest (99-100% test coverage)

### Backend
- Node.js + TypeScript

- HTTP module (current version)

- Express (in development)

- Nest.js (in development)

- Mock database (JSON)

- Vitest (99-100% test coverage)

## Running
Install dependencies:

```bash
npm install
```
Run the project (from project root):

```bash
npm run dev
```
This command starts both frontend and backend simultaneously.

## Roadmap
- Adding support for 3 servers (HTTP, Express, Nest.js)

- Adding support for 2 databases (MongoDB, PostgreSQL)

- Ability to switch between different servers and databases

- Implementation of task priorities functionality