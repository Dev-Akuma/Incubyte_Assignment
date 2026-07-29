# Car Dealership Inventory System

A full-stack RESTful inventory management application designed to handle vehicle inventory with Role-Based Access Control (RBAC).

## Project Status

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 0** | Project Setup & Tooling Configuration | COMPLETED |
| **Phase 1** | Authentication & Security | COMPLETED |
| **Phase 2** | Vehicle CRUD | COMPLETED |

### Implemented Features
- User Registration with secure password hashing (bcrypt).
- Configured JSON Web Token (JWT) handling.
- Implemented Clean Architecture (Routes -> Services -> Repositories/Models).
- Developed using strict Red-Green-Refactor cycles.
- Full CRUD operations.
- Pagination support.
- Admin-only deletion.
- Role-Based Access Control (RBAC).
- Edge-case handling (404, 403).

## API Endpoints

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | Registers a new user. |
| `/api/auth/login` | POST | Public | Authenticates user and returns JWT. |
| `/api/vehicles` | POST | Protected (User) | Creates a new vehicle. |
| `/api/vehicles` | GET | Protected (User) | Retrieves all vehicles with pagination (`?skip=0&limit=10`). |
| `/api/vehicles/{id}` | PUT | Protected (User) | Updates vehicle details. |
| `/api/vehicles/{id}` | DELETE | Protected (Admin) | Deletes a vehicle. |

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, Pytest, bcrypt, JWT.
- **Frontend:** React, Vite, Tailwind CSS, Axios.

## Local Setup Instructions

### Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```
3. **Activate the virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. **Install requirements:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Run migrations via Alembic:**
   ```bash
   alembic upgrade head
   ```
6. **Start uvicorn server:**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install node modules:**
   ```bash
   npm install
   ```
3. **Run the Vite dev server:**
   ```bash
   npm run dev
   ```

## Testing

To run the backend test suite, ensure you are in the `backend` directory with your virtual environment activated, then run:

```bash
pytest
```

To run the tests and generate a coverage report:

```bash
pytest --cov=app
```

## My AI Usage

### Tools Used:
- Gemini (AI Assistant)

### How they were used:
- Used AI to scaffold the project structure and testing configuration (Phase 0).
- Used AI to generate failing test cases for TDD (Phase 1, Phase 2).
- Used AI to implement the initial logic to pass tests (Green state).
- Used AI to refactor code into Clean Architecture (Services, Models, Hashing) while maintaining test coverage.
- Used AI to generate failing TDD tests for all CRUD operations and edge cases.
- Used AI to implement Role-Based Access Control (RBAC) logic for Admin deletion.
- Used AI to refactor code into Service and Repository layers to ensure separation of concerns.
- Used AI to debug database isolation issues during testing.

### Reflection:
- AI accelerated the TDD cycle and helped implement complex RBAC logic, allowing me to focus on architectural integrity and code cleanliness.
- AI tools help me generate the basic idea and structure of the project along with brainstorming the ideas and phases I need to divide the project into.
- It also helped in understanding and implementing some concepts that I was not familiar with.
- I used meta-prompting and a few prompt engineering techniques to get the best out of the AI tools.
- Overall, AI tools helped me to complete the project faster and more efficiently.
