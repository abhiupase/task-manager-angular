# Task Manager — Angular 17 + REST API

A small task-tracking app built to demonstrate modern Angular fundamentals: standalone
components, Signals for state management, reactive forms with validation, and REST API
integration via `HttpClient`.

## Why this project

Built as a hands-on refresher after a career break, focused on the parts of Angular that
have moved fastest since v13: standalone components (no NgModules), Signals instead of
manual RxJS subscriptions for UI state, and the new `@if` / `@for` control-flow syntax.

## Features

- **Task board** — tasks grouped by status (To do / In progress / Done), grouped and
  counted reactively via Angular Signals (`computed()`).
- **Reactive form** — task creation form built with `ReactiveFormsModule`, including
  validators (required, min/max length) and inline error messages.
- **REST API integration** — all reads/writes go through `HttpClient` against a REST
  API (mocked locally with `json-server`), the same integration pattern used to consume
  any REST backend, including ASP.NET Core Web APIs.
- **Full CRUD** — create, advance status, and delete tasks, all reflected instantly
  through Signal-based state (no manual change detection wiring).

## Stack

Angular 17 (standalone, Signals) · TypeScript · Reactive Forms · RxJS · HttpClient ·
json-server (mock REST API for local development)

## Running locally

```bash
npm install

# Runs the mock REST API (port 3000) and the Angular dev server (port 4200) together
npm run dev
```

Then open `http://localhost:4200`.

To run them separately:

```bash
npm run api     # json-server on http://localhost:3000/tasks
npm start       # Angular dev server on http://localhost:4200
```

## Project structure

```
src/app/
├── models/task.model.ts              # Task, TaskStatus, TaskPriority types
├── services/task.service.ts          # Signals-based state + HttpClient calls
└── components/
    ├── task-form/                    # Reactive form for creating tasks
    └── task-board/                   # Status-grouped board with actions
```

## Notes

The REST API is mocked with `json-server` for easy local setup — swapping the base URL
in `task.service.ts` to point at a real backend (ASP.NET Core, Node, etc.) requires no
other changes, since the frontend only depends on the REST contract (GET/POST/PATCH/DELETE
over JSON), not on how the backend is implemented.
