# 1. Backend Setup (FastAPI)
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

# 2. Frontend Setup (React + Vite)
- Initialize a new React project using Vite in a `/frontend` directory.
- Install the following dependencies: Tailwind CSS (and initialize its config), Axios, and React Router.
- Create the following folder structure inside `src/`:
  frontend/src/
  ├── components/
  ├── pages/
  ├── services/
  ├── hooks/
  └── layouts/

# META - Prompt for README.md
Act as a Technical Writer and Expert Developer. We are building a "Car Dealership Inventory System" as part of a TDD Kata. We have just completed Phase 0 (Project Setup).

Your task is to populate the `README.md` file at the root of the project. Do NOT document any features, endpoints, or UI components yet, as they have not been built. Only document the setup and architecture.

Please include the following sections in the README:

1. ## Car Dealership Inventory System
   - A brief, clear explanation of the project based on building a full-stack RESTful inventory management application with Role-Based Access Control (RBAC).

2. ## Tech Stack
   - Backend: FastAPI, SQLAlchemy, SQLite, Pytest.
   - Frontend: React, Vite, Tailwind CSS, Axios.

3. ## Local Setup Instructions
   - Step-by-step instructions for setting up the Backend (creating a virtual environment, installing requirements, running migrations via Alembic, and starting uvicorn).
   - Step-by-step instructions for setting up the Frontend (installing node modules and running the Vite dev server).

4. ## Testing
   - Instructions on how to run the backend tests using `pytest` and `pytest-cov`.

5. ## My AI Usage
   - Create this section exactly as named.
   - Add a subsection "Tools Used:" listing the AI assistant.
   - Add a subsection "How they were used:" noting that AI was used to establish the initial project skeleton, configure testing, and scaffold the README.
   - Add a subsection "Reflection:" leaving a placeholder for me to write my thoughts on how AI accelerated the boilerplate setup.