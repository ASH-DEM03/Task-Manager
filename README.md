[README (2).md](https://github.com/user-attachments/files/33938359/README.2.md)
# Task Flow

A full-stack task management app. Create task lists, add tasks with priorities and due dates, and track progress as you complete them.

**Backend:** Java 21 · Spring Boot · Spring Data JPA · PostgreSQL
**Frontend:** React · Vite · Axios


## Features

- Create, view, update and delete **task lists**
- Add, edit and delete **tasks** inside each list
- Task **priority** (Low, Medium, High) and **status** (Open, Closed)
- Optional **due date** for each task
- Each list shows its **task count** and **completion progress**
- REST API with centralized error handling

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 21, Spring Boot 4, Spring Web MVC, Spring Data JPA (Hibernate) |
| Database | PostgreSQL 17 (Docker) |
| Frontend | React, Vite, Axios |
| Build tools | Maven, npm |

## Project Structure

```
.
├── tasks/                  # Spring Boot backend
│   ├── src/main/java/com/Ash/tasks/
│   │   ├── controllers/    # REST controllers + global exception handler
│   │   ├── services/       # Service interfaces
│   │   ├── mappers/        # Entity <-> DTO mappers and service implementations
│   │   ├── repositories/   # Spring Data JPA repositories
│   │   └── domain/         # Entities and DTOs
│   └── docker-compose.yml  # PostgreSQL for local development
└── front-end/              # React + Vite frontend
```

## API Overview

Base path: `/api`

**Task lists**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/task-lists` | List all task lists |
| POST | `/api/task-lists` | Create a task list |
| GET | `/api/task-lists/{task_list_id}` | Get one task list |
| PUT | `/api/task-lists/{task_list_id}` | Update a task list |
| DELETE | `/api/task-lists/{task_list_id}` | Delete a task list |

**Tasks**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/task-lists/{task_list_id}/tasks` | List tasks in a list |
| POST | `/api/task-lists/{task_list_id}/tasks` | Create a task |
| GET | `/api/task-lists/{task_list_id}/tasks/{task_id}` | Get one task |
| PUT | `/api/task-lists/{task_list_id}/tasks/{task_id}` | Update a task |
| DELETE | `/api/task-lists/{task_list_id}/tasks/{task_id}` | Delete a task |

Example request:

```bash
curl -X POST http://localhost:8080/api/task-lists \
  -H "Content-Type: application/json" \
  -d '{"title":"Work","description":"Things to finish this week"}'
```

## Getting Started

### Prerequisites

- Java 21
- Node.js 18+ and npm
- Docker (for PostgreSQL)

### 1. Start the database

```bash
cd tasks
docker compose up -d
```

This starts PostgreSQL on port `5433` with the database `tasks`.

### 2. Run the backend

```bash
cd tasks
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`. Database settings are in `src/main/resources/application.properties`.

### 3. Run the frontend

```bash
cd front-end
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The dev server proxies `/api` requests to the backend on port 8080, so no extra CORS setup is needed.

## Configuration

Local development credentials live in `docker-compose.yml` and `application.properties`. They are for local use only. For any deployment, move them into environment variables and use your own values.

## What I Learned

- Designing a layered Spring Boot application (controller, service, repository, DTO and mapper)
- Modelling one-to-many relationships with JPA and querying them with Spring Data derived queries
- Handling validation and errors consistently with a global exception handler
- Connecting a React frontend to a REST API with the Vite dev proxy

## Roadmap

- User authentication, so each user has private task lists
- Unit and integration tests
- Deployment (hosted backend, managed PostgreSQL, hosted frontend)

## Author

**Achraf Demerdi**
[LinkedIn](https://linkedin.com/in/achraf-demerdi) · [GitHub](https://github.com/ASH-DEM03)
