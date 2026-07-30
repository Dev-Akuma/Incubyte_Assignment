# Car Dealership Inventory System

A full-stack RESTful inventory management application designed to handle vehicle inventory with Role-Based Access Control (RBAC).

## Project Status

| Phase | Status | Key Features |
|---|---|---|
| Phase 0: Setup | COMPLETED | Scaffolding, Testing Infrastructure, Database Configuration |
| Phase 1: Authentication | COMPLETED | Registration, Login, JWT Authentication, Password Hashing (bcrypt) |
| Phase 2: Vehicle CRUD | COMPLETED | Full CRUD operations, Pagination, Clean Architecture (Routes -> Services -> Repositories), Edge-case testing |
| Phase 3: Inventory Operations | COMPLETED | Purchase & Restock logic, Stock Validation (no negative stock), Strict TDD approach, Role-Based Access Control (Admin-only deletion and restocking) |

## Key Architectural Highlights

*   **Clean Architecture:** Strict separation of concerns (Routes, Services, Repositories, Models).
*   **Test-Driven Development (TDD):** Every feature was implemented using Red-Green-Refactor cycles, ensuring high code quality and test coverage.
*   **Software Craftsmanship:** Focused on clean, readable code with robust edge-case handling (404 Not Found, 403 Forbidden, 422 Unprocessable Entity).

## API Endpoints

| Category | Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|---|
| Auth | POST | `/api/auth/register` | No | Public | Registers a new user. |
| Auth | POST | `/api/auth/login` | No | Public | Authenticates user and returns JWT. |
| Vehicles | POST | `/api/vehicles` | Yes | User | Creates a new vehicle. |
| Vehicles | GET | `/api/vehicles` | Yes | User | Retrieves all vehicles with pagination (`?skip=0&limit=10`). |
| Vehicles | PUT | `/api/vehicles/{id}` | Yes | User | Updates vehicle details. |
| Vehicles | DELETE | `/api/vehicles/{id}` | Yes | Admin | Deletes a vehicle. |
| Inventory | POST | `/api/vehicles/{id}/purchase` | Yes | User | Decreases stock quantity. Fails if stock is zero. |
| Inventory | POST | `/api/vehicles/{id}/restock` | Yes | Admin | Increases stock quantity. |

## Tech Stack

*   **Backend:** FastAPI, SQLAlchemy, SQLite, Pytest, bcrypt, JWT.
*   **Frontend:** React, Vite, Tailwind CSS, Axios.

## Local Setup Instructions

### Backend

1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   * Windows: `venv\Scripts\activate`
   * macOS/Linux: `source venv/bin/activate`
4. Install requirements: `pip install -r requirements.txt`
5. Run migrations via Alembic: `alembic upgrade head`
6. Start uvicorn server: `uvicorn app.main:app --reload`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install node modules: `npm install`
3. Run the Vite dev server: `npm run dev`

## Testing

To run the backend test suite, ensure you are in the backend directory with your virtual environment activated, then run:
`pytest`

To run the tests and generate a coverage report:
`pytest --cov=app`

## My AI Usage

**Tools Used:**
*   Gemini (AI Assistant)

**How they were used:**
*   Scaffolded project and testing infrastructure (Phase 0).
*   Generated TDD test cases for Auth and implemented JWT/Hashing logic (Phase 1).
*   Implemented CRUD, Pagination, and complex RBAC logic for Admin deletion (Phase 2).
*   Designed business logic for Inventory Operations (Purchase/Restock) and stock validation (Phase 3).

**Reflection:**
AI was critical in accelerating the TDD cycle, allowing me to focus on architectural integrity, security implementation (JWT/RBAC), and robust business logic validation.
