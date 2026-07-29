# Car Dealership Inventory System

A full-stack RESTful inventory management application designed to handle vehicle inventory with Role-Based Access Control (RBAC).

## Project Status

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 0** | Project Setup & Tooling Configuration | COMPLETED |
| **Phase 1** | Authentication & Security | COMPLETED |
| **Phase 2** | Vehicle CRUD | COMPLETED |
| **Phase 3** | Inventory Operations | COMPLETED |

### Implemented Features
- User Registration with secure password hashing (bcrypt).
- Configured JSON Web Token (JWT) handling.
- Implemented Clean Architecture (Routes -> Services -> Repositories/Models).
- Developed using strict Red-Green-Refactor cycles.
- Vehicle CRUD operations (Create, Read all with pagination).
- Stock management (Purchase/Restock).
- Role-based access control (Admin vs. User).
- Stock validation logic.

## API Endpoints

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | Registers a new user. |
| `/api/auth/login` | POST | Public | Authenticates user and returns JWT. |
| `/api/vehicles` | POST | Protected | Creates a new vehicle. |
| `/api/vehicles` | GET | Protected | Retrieves all vehicles with pagination. |
| `/api/vehicles/{id}/purchase` | POST | Protected (User) | Decreases stock quantity of a vehicle. Fails if stock is zero. |
| `/api/vehicles/{id}/restock` | POST | Protected (Admin Only) | Increases stock quantity of a vehicle. |

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
- Gemini (AI Assistant) with VSCode Extension.

### How they were used:
- Used AI to scaffold the project structure and testing configuration (Phase 0).
- Used AI to generate failing test cases for TDD (Phase 1, 2, 3).
- Used AI to implement the initial logic to pass tests (Green state).
- Used AI to refactor code into Clean Architecture (Services, Models, Hashing) while maintaining test coverage.
- Used AI to design the inventory business logic (stock validation, role checks).
- Used AI to generate failing tests for edge cases (e.g., purchasing with zero stock).
- Used AI to implement Role-Based Access Control (RBAC) dependencies.

### Reflection:
- AI significantly accelerated the boilerplate setup and TDD cycle, allowing me to focus on architectural decisions and security implementation (bcrypt).
- AI helped me quickly prototype the RBAC logic and edge-case tests, allowing me to focus on ensuring the stock validation logic was robust and secure.
- AI tools help me generate the basic idea and structure of the project along with brainstorming the ideas and phases I need to divide the project into.
- It also helped in understanding and implementing some concepts that I was not familiar with.
- I used meta-prompting and a few prompt engineering techniques to get the best out of the AI tools.
- Overall, AI tools helped me to complete the project faster and more efficiently.
