# Car Dealership Inventory System

A full-stack RESTful inventory management application designed to handle vehicle inventory with Role-Based Access Control (RBAC).

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, Pytest.
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

To run backend tests using `pytest` and `pytest-cov`, ensure you are in the `backend` directory with your virtual environment activated, then run:

```bash
pytest --cov=app
```

## My AI Usage

### Tools Used:
- Gemini 3.1 Pro with VSCode Extension.

### How they were used:
AI was used to establish the initial project skeleton, configure testing, and scaffold the README.

### Reflection:
- AI tools help me generate the basic idea and structure of the project along with brainstorming the ideas and phases I need to divide the project into.
- It also helped in understanding and implementing some concepts that I was not familiar with.
- I used meta-prompting and a few prompt engineering techniques to get the best out of the AI tools.
- I also used the AI tools to generate some test cases for the project.
- Overall, AI tools helped me to complete the project faster and more efficiently.
