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

# PHASE - 1 Authentication

Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are starting Phase 1 (Authentication) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code (no routes, no controllers, no services). We are strictly following the Red-Green-Refactor cycle. Your only task is to write a FAILING test.

Please do the following:
1. Create a test file `backend/tests/api/test_auth.py`.
2. Write a Pytest test case for `POST /api/auth/register` that checks if a new user can successfully register with valid credentials (e.g., username, password, email). The test should expect a 201 status code and a response containing the user's details (excluding the password) or a success message.
3. Ensure the test imports the necessary testing tools (like `TestClient` from FastAPI), even if the FastAPI app isn't fully configured to handle it yet.

# RED -> GREEN : Implement and fix the failing test     
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `POST /api/auth/register` endpoint in our FastAPI backend. 

Your task is to write the minimum implementation code necessary to make this test pass (Green state). Do NOT implement the login endpoint or any other features yet.

Please implement the following step-by-step:

1. **Schemas (`app/schemas/user.py`):** Create Pydantic models for `UserCreate` (username, email, password) and `UserResponse` (id, username, email). Ensure the response does not include the password.
2. **Models (`app/models/user.py`):** Create a SQLAlchemy `User` model with fields for id, username, email (unique), and hashed_password. 
3. **Core/Security (`app/core/security.py`):** Implement a simple password hashing utility using `bcrypt` (or `passlib`).
4. **API Router (`app/api/auth.py`):** Create an APIRouter and implement the `POST /api/auth/register` endpoint. It should accept `UserCreate`, hash the password, save the user to the database, and return a 201 status code with the `UserResponse` model.
5. **Main App (`app/main.py`):** Initialize the FastAPI app and include the auth router so the test client can actually reach the endpoint.

# RED -> GREEN : Fix Test Isolation
Act as an expert Full-Stack Developer. I ran my pytest suite and the `test_register_user_success` test failed with:

>       assert response.status_code == 201
E       assert 400 == 201
E        +  where 400 = <Response [400 Bad Request]>.status_code

This is happening because the database state is persisting between test runs, triggering a duplicate user error. 

Please fix our test isolation by doing the following:
1. Create or update `backend/tests/conftest.py`.
2. Set up a pytest fixture using an in-memory SQLite database (`sqlite:///:memory:`) specifically for testing.
3. Ensure this fixture creates all tables before each test and drops them afterward.
4. Override the FastAPI `get_db` dependency for the `TestClient` so that it routes database calls to this temporary test database instead of our development database.

Provide the code for `conftest.py` and any necessary updates to `tests/api/test_auth.py`.

# RED -> GREEN Pt.2 
Act as an expert Full-Stack Developer. I ran pytest and got the following error:

E       sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table: users

This is happening because our test database fixture in `backend/tests/conftest.py` is not creating the tables in the in-memory SQLite database before yielding the session.

Please update `conftest.py` to fix this:
1. Import our SQLAlchemy declarative base (e.g., `Base` from `app.core.database` or `app.models`).
2. Inside the fixture that creates the engine, ensure you call `Base.metadata.create_all(bind=engine)` before yielding.
3. Call `Base.metadata.drop_all(bind=engine)` after the yield to clean up.
4. Ensure the models (like `User`) are imported before `create_all` so SQLAlchemy knows about them.

Provide the updated `conftest.py` code. Once the test passes and returns 201, I will stage and commit the changes strictly using this message: