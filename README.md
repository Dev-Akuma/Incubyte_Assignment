# Dealership Inventory App

A full-stack web application designed for dealership inventory management. It provides a robust dashboard for managing vehicles, tracking stock levels, processing sales, and controlling user access.

## Tech Stack

**Frontend:**
- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library

**Backend:**
- FastAPI
- Python
- Pydantic
- Pytest

## Development Methodology

This entire application was developed strictly using **Test-Driven Development (TDD)**. Every feature was constructed following rigorous Red-Green-Refactor cycles to ensure a highly reliable and maintainable codebase from the ground up.

## Completed Features

- **Authentication:** JWT-based Authentication (Login/Logout) and Protected Routes.
- **Dashboard:** Dynamic inventory list rendering and tracking.
- **Add Vehicles:** Form for adding new vehicles with comprehensive API validation handling.
- **Inventory Management:** Core operational functionalities, including Sell and Restock interactions.
- **Role-Based Access Control:** Admin-only access guardrails (e.g., Delete functionality is restricted to administrators).

## How to Run

### Backend

1. Navigate to the `backend/` directory.
2. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend

1. Navigate to the `frontend/` directory.
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at the local address provided by Vite (usually `http://localhost:5173`).
