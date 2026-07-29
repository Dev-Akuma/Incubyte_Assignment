### 1. Backend Setup (FastAPI)
- Initialize a new Python project in a `/backend` directory.
- Install the following dependencies: FastAPI, SQLAlchemy, Alembic, pytest, pytest-cov, bcrypt, python-jose, pydantic, and uvicorn.
- Create the following folder structure exactly:
  backend/
  ├── app/
  │   ├── api/
  │   ├── models/
  │   ├── schemas/
  │   ├── services/
  │   ├── repositories/
  │   └── core/
  └── tests/
- Initialize SQLite as the database.
- Initialize Alembic and create the first empty/baseline migration.

### 2. Frontend Setup (React + Vite)
- Initialize a new React project using Vite in a `/frontend` directory.
- Install the following dependencies: Tailwind CSS (and initialize its config), Axios, and React Router.
- Create the following folder structure inside `src/`:
  frontend/src/
  ├── components/
  ├── pages/
  ├── services/
  ├── hooks/
  └── layouts/