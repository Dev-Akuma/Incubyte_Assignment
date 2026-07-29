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

# PHASE - I Authentication

Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are starting Phase 1 (Authentication) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code (no routes, no controllers, no services). We are strictly following the Red-Green-Refactor cycle. Your only task is to write a FAILING test.

Please do the following:
1. Create a test file `backend/tests/api/test_auth.py`.
2. Write a Pytest test case for `POST /api/auth/register` that checks if a new user can successfully register with valid credentials (e.g., username, password, email). The test should expect a 201 status code and a response containing the user's details (excluding the password) or a success message.
3. Ensure the test imports the necessary testing tools (like `TestClient` from FastAPI), even if the FastAPI app isn't fully configured to handle it yet.

## RED -> GREEN : Implement and fix the failing test     
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `POST /api/auth/register` endpoint in our FastAPI backend. 

Your task is to write the minimum implementation code necessary to make this test pass (Green state). Do NOT implement the login endpoint or any other features yet.

Please implement the following step-by-step:

1. **Schemas (`app/schemas/user.py`):** Create Pydantic models for `UserCreate` (username, email, password) and `UserResponse` (id, username, email). Ensure the response does not include the password.
2. **Models (`app/models/user.py`):** Create a SQLAlchemy `User` model with fields for id, username, email (unique), and hashed_password. 
3. **Core/Security (`app/core/security.py`):** Implement a simple password hashing utility using `bcrypt` (or `passlib`).
4. **API Router (`app/api/auth.py`):** Create an APIRouter and implement the `POST /api/auth/register` endpoint. It should accept `UserCreate`, hash the password, save the user to the database, and return a 201 status code with the `UserResponse` model.
5. **Main App (`app/main.py`):** Initialize the FastAPI app and include the auth router so the test client can actually reach the endpoint.

## RED -> GREEN : Fix Test Isolation
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

## RED -> GREEN Pt.2 
Act as an expert Full-Stack Developer. I ran pytest and got the following error:

E       sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table: users

This is happening because our test database fixture in `backend/tests/conftest.py` is not creating the tables in the in-memory SQLite database before yielding the session.

Please update `conftest.py` to fix this:
1. Import our SQLAlchemy declarative base (e.g., `Base` from `app.core.database` or `app.models`).
2. Inside the fixture that creates the engine, ensure you call `Base.metadata.create_all(bind=engine)` before yielding.
3. Call `Base.metadata.drop_all(bind=engine)` after the yield to clean up.
4. Ensure the models (like `User`) are imported before `create_all` so SQLAlchemy knows about them.

Provide the updated `conftest.py` code. Once the test passes and returns 201.

## REFACTOR :
Act as an expert Full-Stack Developer. Our registration test is passing, and our application code is already separated into services and repositories. We are now in the "Refactor" phase for our test code.

Please refactor `backend/tests/api/test_auth.py` to be cleaner and more scalable:
1. Move the `TestClient` initialization into a reusable pytest fixture in `conftest.py` (if it isn't there already), ensuring it uses the isolated test database override.
2. Create a fixture in `conftest.py` for a `valid_user_payload` so we don't have to hardcode the username, email, and password in every test.
3. Update `test_auth.py` to inject these fixtures into `test_register_user_success` rather than hardcoding them.
4. Ensure the test still passes.

## RED : Implementing Login 
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are continuing Phase 1 (Authentication) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the login route, services, or JWT generation. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following:
1. Open `backend/tests/api/test_auth.py`.
2. Add a new test case called `test_login_user_success`.
3. In this test, first register a user (using the test client or a fixture) so that a user exists in the test database.
4. Then, make a `POST` request to `/api/auth/login`. Since FastAPI typically uses OAuth2 with password flow, send the credentials (username and password) as form data (`data=...`), NOT JSON.
5. Assert that the response status code is 200 OK.
6. Assert that the JSON response contains an `access_token` and `token_type` == "bearer".

## GREEN : Implementing Login
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `POST /api/auth/login` endpoint.

Your task is to write the minimum implementation code necessary to make this test pass (Green state). We need to implement JWT generation and password verification.

Please implement the following step-by-step:

1. **Config (`app/core/config.py`):** Create a basic settings class (using Pydantic `BaseSettings` if available) with `SECRET_KEY`, `ALGORITHM` (e.g., "HS256"), and `ACCESS_TOKEN_EXPIRE_MINUTES`.
2. **Schemas (`app/schemas/token.py`):** Create a Pydantic model `Token` containing `access_token` (str) and `token_type` (str).
3. **Core/Security (`app/core/security.py`):** 
   - Implement `verify_password(plain_password, hashed_password)`.
   - Implement `create_access_token(data: dict, expires_delta)` using `python-jose`.
4. **Repositories (`app/repositories/user.py`):** Add a method `get_user_by_username(db, username: str)` to fetch the user from the database.
5. **Services (`app/services/user.py` or `app/services/auth.py`):** Implement `authenticate_user(db, username, password)` that uses the repository and security verify function.
6. **API Router (`app/api/auth.py`):** Implement the `POST /api/auth/login` endpoint. It must accept FastAPI's `OAuth2PasswordRequestForm` as a dependency, call the authentication service, generate the JWT, and return the `Token` schema.

Ensure the tests pass after adding this implementation.

## REFACTOR : Test Login
Act as an expert Full-Stack Developer. Our login test is passing, but we need to perform the "Refactor" step to ensure our authentication is secure and follows HTTP standards.

Please review and refactor the login implementation:

1. **Configuration (`app/core/config.py`):** Ensure the `SECRET_KEY` is not hardcoded as a raw string. It should be loaded from environment variables using Pydantic's `BaseSettings` (with a secure fallback for local development).
2. **Error Handling (`app/api/auth.py`):** If `authenticate_user` returns `None` or `False` (meaning invalid username or password), ensure the router raises an `HTTPException` with `status_code=status.HTTP_401_UNAUTHORIZED`, a detail message like "Incorrect username or password", and the header `{"WWW-Authenticate": "Bearer"}`.
3. **Test Suite (`backend/tests/api/test_auth.py`):** Add a quick test case called `test_login_user_invalid_credentials` to verify that passing a wrong password returns a 401 status code. This solidifies our refactor.
4. Run the tests to ensure everything remains green.

## README.md updating progress on PHASE I completion
ACT as a Technical Writer and Senior Developer.
CONTEXT: We have just completed Phase 1 (Authentication) of the Incubyte Car Dealership Kata.
CURRENT STATE: 
- Phase 0 (Setup) is complete.
- Phase 1 (Authentication) is complete.
- Implemented: User Registration endpoint (POST /api/auth/register) with TDD (Red-Green-Refactor).
- Tech: FastAPI, SQLAlchemy, Alembic, Pytest, bcrypt, JWT (setup ready).
- Architecture: Clean Architecture (Routes -> Services -> Repositories/Models).
- Testing: 100% test coverage for the registration flow (user creation, password hashing, 201 status).

GOAL: Update the root README.md to reflect this progress.

TASKS:
1. **Update "Project Status" Section**:
   - Clearly state: "Phase 1: Authentication - COMPLETED".
   - List implemented features: "User Registration with secure password hashing (bcrypt)".
   - Mention the TDD approach used: "Developed using strict Red-Green-Refactor cycles."

2. **Update "How to Run" Section**:
   - Ensure instructions cover both Backend (setup, migrations) and Frontend (if applicable, though focus on backend now).
   - Add the command to run tests: `pytest`.

3. **Update "My AI Usage" Section (MANDATORY)**:
   - Create/Update a dedicated section titled "My AI Usage".
   - List tools used: "Gemini (AI Assistant)".
   - Describe usage: 
     - "Used AI to scaffold the project structure and testing configuration (Phase 0)."
     - "Used AI to generate failing test cases for TDD (Phase 1)."
     - "Used AI to implement the initial logic to pass tests (Green state)."
     - "Used AI to refactor code into Clean Architecture (Services, Models, Hashing) while maintaining test coverage."
   - Add a reflection: "AI significantly accelerated the boilerplate setup and TDD cycle, allowing me to focus on architectural decisions and security implementation (bcrypt)."

4. **Formatting**:
   - Use Markdown tables for the "Progress" section.
   - Ensure the "My AI Usage" section is prominent and follows Incubyte's transparency rules.
   - Keep the tone professional and technical.

CONSTRAINTS:
- DO NOT invent features not yet implemented (e.g., do not mention Login, Purchase, or Admin panels yet).
- DO NOT remove existing Phase 0 information, just append/update.
- Ensure the "Co-authored-by" context is reflected in the commit history (though not in the README text itself).

OUTPUT:
- Provide the full updated content of the README.md file.

# Phase - II Vehicle CRUD
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are starting Phase 2 (Vehicle CRUD) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the vehicles routes, models, or schemas. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following step-by-step:
1. **Auth Fixture (`backend/tests/conftest.py`):** Create a new fixture called `authorized_client`. This fixture should use the existing test client, register a test user, log them in to get an `access_token`, and return the `TestClient` with the `Authorization: Bearer <token>` header pre-set.
2. **Test File (`backend/tests/api/test_vehicles.py`):** Create this new file.
3. **Write the Test:** Add a test case called `test_create_vehicle_success`. 
   - Inject the `authorized_client` fixture.
   - Make a `POST` request to `/api/vehicles` with a JSON payload containing: `make` (str), `model` (str), `category` (str), `price` (float/int), and `quantity` (int).
   - Assert that the response status code is 201 Created.
   - Assert that the JSON response contains an `id` and matches the submitted payload.

## GREEN : Implementing Vehicle Creation 
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `POST /api/vehicles` endpoint.

Your task is to write the minimum implementation code necessary to make this test pass (Green state). 

Please implement the following step-by-step:

1. **Schemas (`app/schemas/vehicle.py`):** Create Pydantic models for `VehicleCreate` (make: str, model: str, category: str, price: float, quantity: int) and `VehicleResponse` (adds id: int).
2. **Models (`app/models/vehicle.py`):** Create a SQLAlchemy `Vehicle` model with the corresponding fields.
3. **Dependencies (`app/api/deps.py` or `app/core/security.py`):** Create a FastAPI dependency (e.g., `get_current_user`) that extracts the JWT token from the `Authorization` header, decodes it, and fetches the user from the database. If the token is invalid or missing, raise a 401 Unauthorized exception.
4. **Repositories (`app/repositories/vehicle.py`):** Add a method `create_vehicle(db, vehicle: VehicleCreate)` to insert the vehicle into the database.
5. **API Router (`app/api/vehicles.py`):** Implement the `POST /api/vehicles` endpoint. It must:
   - Depend on `get_current_user` to ensure the route is protected.
   - Accept the `VehicleCreate` schema.
   - Save the vehicle using the repository.
   - Return a 201 Created status code with the `VehicleResponse`.
6. **Main App (`app/main.py`):** Include the new `vehicles` router in the FastAPI application.

## REFACTOR : Vehicle Creation
Act as an expert Full-Stack Developer. Our vehicle creation test is passing, but we need to perform the "Refactor" step to ensure our architecture remains clean and our protected routes are fully tested.

Please review and refactor the Vehicle creation implementation:

1. **Architecture Consistency (`app/services/vehicle.py`):** Create a service layer for vehicles. Move the database insertion logic call out of the router (`app/api/vehicles.py`). The router should call `service.create_vehicle`, which in turn calls the repository.
2. **Validation (`app/schemas/vehicle.py`):** Update the `VehicleCreate` Pydantic model to enforce business rules using `Field`. For example, `price` must be greater than 0, and `quantity` must be greater than or equal to 0. 
3. **Test Suite (`backend/tests/api/test_vehicles.py`):** Add a test case called `test_create_vehicle_unauthorized`. This test should use the standard, unauthenticated `client` (not the `authorized_client` fixture) to attempt to POST to `/api/vehicles`. Assert that it returns a 401 Unauthorized status code.
4. Run the tests to ensure everything is green.

# RED : Inventory List 
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are continuing Phase 2 (Vehicle CRUD) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the GET route in the router or service. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following:
1. Open `backend/tests/api/test_vehicles.py`.
2. Add a new test case called `test_get_all_vehicles_success`.
3. Inside the test, first use the `authorized_client` to `POST` two different vehicles to `/api/vehicles` (e.g., a Honda Civic and a Ford F-150) so the database has inventory.
4. Next, use the `authorized_client` to make a `GET` request to `/api/vehicles`.
5. Assert that the response status code is 200 OK.
6. Assert that the response data is a list, that its length is at least 2, and that it contains the data for the vehicles you just created.

# GREEN PHASE : Inventory List Implementation for green
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `GET /api/vehicles` endpoint.

Your task is to write the minimum implementation code necessary to make this test pass (Green state). 

Please implement the following step-by-step:

1. **Repositories (`app/repositories/vehicle.py`):** Add a method `get_all_vehicles(db)` that executes a query to return all vehicles from the database.
2. **Services (`app/services/vehicle.py`):** Add a method `get_vehicles(db)` that calls the repository method.
3. **API Router (`app/api/vehicles.py`):** Implement the `GET /api/vehicles` endpoint. It must:
   - Depend on `get_current_user` to ensure the route is protected.
   - Set `response_model=list[VehicleResponse]`.
   - Call the service layer to fetch the vehicles.
   - Return the list of vehicles.

# REFACTOR PHASE : Inventory List
Act as an expert Full-Stack Developer. Our vehicle list test is passing, but we need to perform the "Refactor" step to ensure our API is scalable and secure.

Please review and refactor the Vehicle list implementation:

1. **Pagination (Repository & Service):** Update `get_all_vehicles` in `app/repositories/vehicle.py` and `app/services/vehicle.py` to accept `skip: int = 0` and `limit: int = 100` parameters, and apply them to the SQLAlchemy query.
2. **Query Parameters (Router):** Update the `GET /api/vehicles` route in `app/api/vehicles.py` to accept `skip` and `limit` as query parameters, passing them down to the service layer.
3. **Test Suite - Unauthorized (`backend/tests/api/test_vehicles.py`):** Add a test case called `test_get_all_vehicles_unauthorized` that uses the unauthenticated `client` to make a GET request to `/api/vehicles`. Assert it returns a 401 Unauthorized status code.
4. **Test Suite - Pagination:** Ensure the existing `test_get_all_vehicles_success` still passes. Optionally, add a small test to verify the `limit` query parameter works (e.g., limit=1 returns only 1 vehicle).
5. Run the tests to ensure everything remains green.

# README.md progress documentation after Inventory List
ACT as a Technical Writer and Senior Developer.
CONTEXT: We have just completed Phase 3 (Inventory Operations) of the Incubyte Car Dealership Kata.
CURRENT STATE:
- Phase 0 (Setup), Phase 1 (Auth), Phase 2 (Vehicle CRUD) are complete.
- Phase 3 (Inventory Operations) is now COMPLETE.
- Implemented Features:
  - POST /api/vehicles/:id/purchase: Decreases stock quantity (User role).
  - POST /api/vehicles/:id/restock: Increases stock quantity (Admin role only).
  - Business Logic: Prevents purchase if stock is zero; ensures only admins can restock.
  - TDD Approach: Strict Red-Green-Refactor cycles for all inventory logic.
  - Architecture: Service layer handles stock validation and updates; Repository handles DB interaction.

GOAL: Update the root README.md to reflect Phase 3 completion.

TASKS:
1. **Update "Project Status" Section**:
   - Change status to: "Phase 3: Inventory Operations - COMPLETED".
   - List new features: "Stock management (Purchase/Restock)", "Role-based access control (Admin vs. User)", "Stock validation logic".

2. **Update "API Endpoints" Table**:
   - Add rows for:
     - `POST /api/vehicles/{id}/purchase` (Protected, User)
     - `POST /api/vehicles/{id}/restock` (Protected, Admin Only)
   - Include a brief description of what each does.

3. **Update "My AI Usage" Section (MANDATORY)**:
   - Update the "How I used AI" list to include:
     - "Used AI to design the inventory business logic (stock validation, role checks)."
     - "Used AI to generate failing tests for edge cases (e.g., purchasing with zero stock)."
     - "Used AI to implement Role-Based Access Control (RBAC) dependencies."
   - Update the reflection: "AI helped me quickly prototype the RBAC logic and edge-case tests, allowing me to focus on ensuring the stock validation logic was robust and secure."

4. **Formatting**:
   - Ensure the "How to Run" section still works (no changes needed unless DB schema changed, but mention `alembic upgrade head` if new migrations were added).
   - Keep the tone professional, technical, and transparent.

CONSTRAINTS:
- DO NOT mention Phase 4 features (Search/Filter) or Admin Panel UI (Phase 7) yet.
- Ensure the "Co-authored-by" context is reflected in the commit history (not the README text).
- Make sure the "My AI Usage" section is detailed and specific to Phase 3 tasks.

OUTPUT:
- Provide the full updated content of the README.md file.

## RED :Searching and Filtering
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are continuing Phase 2 (Vehicle CRUD) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the search route, service, or repository. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following:
1. Open `backend/tests/api/test_vehicles.py`.
2. Add a new test case called `test_search_vehicles_success`.
3. Inside the test, first use the `authorized_client` to `POST` at least 3 distinct vehicles to `/api/vehicles`. Make sure they vary in make, category, and price (e.g., a $25,000 Toyota SUV, a $15,000 Honda Sedan, and a $35,000 Ford Truck).
4. Perform the following `GET` requests using the `authorized_client` to `/api/vehicles/search` and assert the results for each:
   - Search by make: `?make=Toyota`. Assert response count is 1 and the make matches.
   - Search by category: `?category=Sedan`. Assert response count is 1 and the category matches.
   - Search by price range: `?min_price=20000&max_price=40000`. Assert response count is 2 (the Toyota and the Ford).

## GREEN : Implementing Searching and Filtering
Your task is to write the minimum implementation code necessary to make this test pass (Green state). 

Please implement the following step-by-step:

1. **Repositories (`app/repositories/vehicle.py`):** Add a method `search_vehicles` that accepts optional parameters: `make`, `model`, `category`, `min_price`, and `max_price`. 
   - Start with a base query: `query = db.query(models.Vehicle)`
   - Dynamically add `.filter()` clauses only if the parameter is provided (e.g., `if make: query = query.filter(models.Vehicle.make.ilike(f"%{make}%"))`).
   - Return the executed query.
2. **Services (`app/services/vehicle.py`):** Add a method `search_vehicles` that accepts the database session and the optional parameters, passing them down to the repository.
3. **API Router (`app/api/vehicles.py`):** Implement the `GET /api/vehicles/search` endpoint. 
   - **IMPORTANT:** Place this route *before* any dynamic ID routes (like `/{id}`) in the file to prevent route collision.
   - Depend on `get_current_user` to ensure the route is protected.
   - Use `typing.Optional` for the query parameters: `make`, `model`, `category`, `min_price`, `max_price`.
   - Call the service layer and return the results as `list[VehicleResponse]`.

## REFACTOR : Adding Pagination for Empty Results or full queries
Act as an expert Full-Stack Developer. Our vehicle search test is passing, but we need to perform the "Refactor" step to ensure the search API is scalable, secure, and handles edge cases.

Please review and refactor the Vehicle search implementation:

1. **Pagination (All Layers):** Update the `search_vehicles` method in the repository, service, and router to accept `skip: int = 0` and `limit: int = 100`. Apply these to the SQLAlchemy query just like we did for the list endpoint.
2. **Test Suite - Unauthorized (`backend/tests/api/test_vehicles.py`):** Add a test case called `test_search_vehicles_unauthorized` that uses the unauthenticated `client` to make a GET request to `/api/vehicles/search?make=Toyota`. Assert it returns a 401 Unauthorized status code.
3. **Test Suite - Empty Results:** Add a test case called `test_search_vehicles_not_found` using the `authorized_client`. Search for a vehicle that definitely does not exist in the database (e.g., `?make=NonExistentBrand`). Assert that the status code is 200 OK and the response body is an empty list `[]`.
4. Run the tests to ensure everything remains green.

## RED : Update and Delete for RBAC 
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are wrapping up the standard CRUD operations in Phase 2 for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the update route, service, or repository. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following:
1. Open `backend/tests/api/test_vehicles.py`.
2. Add a new test case called `test_update_vehicle_success`.
3. Inside the test, first use the `authorized_client` to `POST` a new vehicle to `/api/vehicles` and extract its `id` from the response.
4. Make a `PUT` request using the `authorized_client` to `/api/vehicles/{id}` with a JSON payload containing updated details (e.g., changing the `price` and `quantity`).
5. Assert that the response status code is 200 OK.
6. Assert that the response JSON matches the updated fields (e.g., the new price and quantity are returned).

## GREEN : Update and Delete for RBAC 
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `PUT /api/vehicles/{id}` endpoint.

Your task is to write the minimum implementation code necessary to make this test pass (Green state). 

Please implement the following step-by-step:

1. **Schemas (`app/schemas/vehicle.py`):** Create a `VehicleUpdate` Pydantic model. All fields (`make`, `model`, `category`, `price`, `quantity`) should be `Optional` so users can perform partial updates.
2. **Repositories (`app/repositories/vehicle.py`):** 
   - Add `get_vehicle_by_id(db, vehicle_id: int)` to fetch a single vehicle.
   - Add `update_vehicle(db, db_vehicle, update_data: dict)` to apply changes to the fetched vehicle, commit, refresh, and return it.
3. **Services (`app/services/vehicle.py`):** Add `update_vehicle(db, vehicle_id: int, vehicle_update: VehicleUpdate)`. It should first fetch the vehicle using the repository. If the vehicle is not found, raise an `HTTPException` with status code 404. Otherwise, exclude unset fields from `vehicle_update`, pass the data to the repository's update method, and return the result.
4. **API Router (`app/api/vehicles.py`):** Implement the `PUT /api/vehicles/{id}` endpoint. 
   - Depend on `get_current_user` to ensure it is protected.
   - Accept the `id` as a path parameter and `VehicleUpdate` as the body.
   - Call the service layer and return the updated vehicle using `response_model=VehicleResponse`.

## REFACTOR : Update and Delete for RBAC refactoring for edge-case coverage
Act as an expert Full-Stack Developer. Our vehicle update test is passing, but we need to perform the "Refactor" step by adding robust edge-case testing.

Please do the following in `backend/tests/api/test_vehicles.py`:

1. **Test Suite - Not Found:** Add a test case called `test_update_vehicle_not_found`. Use the `authorized_client` to send a `PUT` request to `/api/vehicles/9999` (an ID that does not exist) with valid update payload. Assert that the response status code is 404 Not Found.
2. **Test Suite - Unauthorized:** Add a test case called `test_update_vehicle_unauthorized`. Use the unauthenticated `client` to send a `PUT` request to `/api/vehicles/1`. Assert that the response status code is 401 Unauthorized.
3. Run the tests. If the 404 test fails because our service layer isn't properly raising the `HTTPException`, fix the `update_vehicle` method in `app/services/vehicle.py` to ensure it raises a 404 when the repository returns `None`.

## RED : Failing Test Cases for Admin
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are moving to the DELETE endpoint for Phase 2, which introduces Role-Based Access Control (Admin only).

CRITICAL CONSTRAINT: Do NOT write the implementation for the DELETE route or the role verification dependency yet. We are strictly in the "Red" phase of TDD. Your task is to update the User model to support roles, set up the test fixture, and write the FAILING tests.

Please do the following step-by-step:

1. **User Model & Schema (`app/models/user.py` & `app/schemas/user.py`):** Add an `is_admin` boolean column/field, defaulting to `False`. (This is necessary just so our test database can insert an admin).
2. **Admin Fixture (`backend/tests/conftest.py`):** Create a new fixture called `admin_client`. It should behave exactly like `authorized_client`, but it creates a user with `is_admin=True` and returns a TestClient authenticated with that admin's token.
3. **Write Failing Test 1 - Success (`backend/tests/api/test_vehicles.py`):** Add `test_delete_vehicle_success_admin`. 
   - Use the `admin_client` to `POST` a new vehicle to `/api/vehicles`.
   - Extract the `id`, then use `admin_client` to send a `DELETE` request to `/api/vehicles/{id}`.
   - Assert the status code is 204 (No Content) or 200 (OK).
4. **Write Failing Test 2 - Forbidden:** Add `test_delete_vehicle_forbidden_regular_user`.
   - Use the `authorized_client` (regular user) to `POST` a new vehicle.
   - Attempt to send a `DELETE` request to `/api/vehicles/{id}` using the regular `authorized_client`.
   - Assert the status code is 403 (Forbidden).

## GREEN : Implementing Admin-only vehicle deletion
Act as an expert Full-Stack Developer following strict TDD. We currently have failing tests (Red state) for the `DELETE /api/vehicles/{id}` endpoint, which requires Admin privileges.

Your task is to write the minimum implementation code necessary to make these tests pass (Green state). 

Please implement the following step-by-step:

1. **Security Dependency (`app/api/deps.py` or `app/core/security.py`):** Create a new FastAPI dependency called `get_current_admin_user`. 
   - It should depend on your existing `get_current_user` dependency.
   - It must check if `current_user.is_admin` is True.
   - If `is_admin` is False, it must raise an `HTTPException` with status code 403 (Forbidden) and the detail "Not enough privileges".
   - If True, it returns the current user.
2. **Repositories (`app/repositories/vehicle.py`):** Add `delete_vehicle(db, db_vehicle)` to delete the vehicle object from the database and commit the transaction.
3. **Services (`app/services/vehicle.py`):** Add `delete_vehicle(db, vehicle_id: int)`. It should use the repository to fetch the vehicle by ID. If not found, raise a 404 `HTTPException`. Otherwise, pass the vehicle to the repository's delete method.
4. **API Router (`app/api/vehicles.py`):** Implement the `DELETE /api/vehicles/{id}` endpoint.
   - **Crucial:** Protect this route by injecting `Depends(get_current_admin_user)`.
   - Call the service layer to delete the vehicle.
   - Set the route to return `status_code=status.HTTP_204_NO_CONTENT` (do not return a body).

## REFACTOR : test for edge-cases
Act as an expert Full-Stack Developer. Our vehicle deletion tests are passing, but we need to perform the "Refactor" step by adding robust edge-case testing for the DELETE endpoint.

Please do the following in `backend/tests/api/test_vehicles.py`:

1. **Test Suite - Not Found:** Add a test case called `test_delete_vehicle_not_found_admin`. Use the `admin_client` to send a `DELETE` request to `/api/vehicles/9999` (an ID that does not exist). Assert that the response status code is 404 Not Found.
2. **Test Suite - Unauthorized:** Add a test case called `test_delete_vehicle_unauthorized`. Use the unauthenticated `client` to send a `DELETE` request to `/api/vehicles/1`. Assert that the response status code is 401 Unauthorized. (This proves the admin dependency correctly falls back to checking if the user is authenticated at all).
3. Run the tests. If the 404 test fails, ensure the `delete_vehicle` method in `app/services/vehicle.py` explicitly raises a 404 `HTTPException` when the repository returns `None`.

# PHASE - III : Inventory Operations
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are starting Phase 3 (Inventory Operations) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the sale route or service. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following step-by-step:
1. **New Test File (`backend/tests/api/test_inventory.py`):** Create this file to handle inventory-specific business logic tests. 
2. **Write the Test:** Add a test case called `test_record_vehicle_sale_success`.
   - Inject the `authorized_client` fixture (you may need to import it or rely on `conftest.py`).
   - Use the `authorized_client` to `POST` a new vehicle to `/api/vehicles` with a starting `quantity` of 5, and extract its `id`.
   - Make a `POST` request to a new endpoint `/api/vehicles/{id}/sale` with a JSON payload: `{"quantity": 2}` (representing the number of cars sold).
   - Assert that the response status code is 200 OK.
   - Assert that the response JSON shows the vehicle's new `quantity` is exactly 3.

## GREEN : Implementing Vehicle Sale Point
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `POST /api/vehicles/{id}/sale` endpoint.

Your task is to write the minimum implementation code necessary to make this test pass (Green state). 

Please implement the following step-by-step:

1. **Schemas (`app/schemas/vehicle.py`):** Create a new Pydantic model called `VehicleSale` that accepts `quantity: int`.
2. **Services (`app/services/vehicle.py`):** Add a method called `record_sale(db, vehicle_id: int, sale_data: VehicleSale)`. 
   - Fetch the vehicle using the repository's `get_vehicle_by_id`.
   - If not found, raise a 404 `HTTPException`.
   - Subtract `sale_data.quantity` from the vehicle's current `quantity`.
   - Save the changes using the repository's `update_vehicle` method (or a new specific method if you prefer) and return the updated vehicle.
3. **API Router (`app/api/vehicles.py`):** Implement the `POST /api/vehicles/{id}/sale` endpoint. 
   - Depend on `get_current_user` to ensure the route is protected.
   - Accept the `id` as a path parameter and `VehicleSale` as the request body.
   - Call the `record_sale` service method and return the result using `response_model=VehicleResponse`.

## REFACTOR : Implementing Logic Validation for edge-cases
Act as an expert Full-Stack Developer. Our vehicle sale test is passing, but we need to perform the "Refactor" step by adding robust business logic validation and edge-case testing for the inventory operation.

Please review and refactor the Vehicle Sale implementation:

1. **Schema Validation (`app/schemas/vehicle.py`):** Update the `VehicleSale` model so that `quantity` is strictly greater than 0 (e.g., using Pydantic's `Field(..., gt=0)`). 
2. **Business Logic (`app/services/vehicle.py`):** In the `record_sale` method, before subtracting the quantity, check if `vehicle.quantity < sale_data.quantity`. If it is, raise an `HTTPException` with `status_code=400` (Bad Request) and a detail message like "Not enough vehicles in stock".
3. **Test Suite - Insufficient Stock (`backend/tests/api/test_inventory.py`):** Add a test called `test_record_vehicle_sale_insufficient_stock`. `POST` a vehicle with a quantity of 2. Attempt to `POST` a sale of 5. Assert the response status code is 400 Bad Request.
4. **Test Suite - Invalid Input:** Add a test called `test_record_vehicle_sale_invalid_quantity`. Attempt to `POST` a sale with a quantity of 0 or a negative number. Assert the response status code is 422 Unprocessable Entity (from Pydantic validation).
5. Run the tests to ensure everything is green

## RED : Restock Endpont Failing Testcase
Act as an expert Full-Stack Developer strictly following Test-Driven Development (TDD). We are finishing Phase 3 (Inventory Operations) for our Car Dealership Inventory System.

CRITICAL CONSTRAINT: Do NOT write any implementation code for the restock route or service. We are strictly in the "Red" phase of TDD. Your only task is to write a FAILING test.

Please do the following step-by-step:
1. **Test File (`backend/tests/api/test_inventory.py`):** Open the existing inventory test file.
2. **Write the Test:** Add a test case called `test_restock_vehicle_success`.
   - Use the `authorized_client` to `POST` a new vehicle to `/api/vehicles` with a starting `quantity` of 5, and extract its `id`.
   - Make a `POST` request to a new endpoint `/api/vehicles/{id}/restock` with a JSON payload: `{"quantity": 3}` (representing the number of new cars received).
   - Assert that the response status code is 200 OK.
   - Assert that the response JSON shows the vehicle's new `quantity` is exactly 8.

## GREEN : Implementing the Restock Logic
Act as an expert Full-Stack Developer following strict TDD. We currently have a failing test (Red state) for the `POST /api/vehicles/{id}/restock` endpoint.

Your task is to write the minimum implementation code necessary to make this test pass (Green state). 

Please implement the following step-by-step:

1. **Schemas (`app/schemas/vehicle.py`):** Create a new Pydantic model called `VehicleRestock` that accepts `quantity: int`.
2. **Services (`app/services/vehicle.py`):** Add a method called `restock_vehicle(db, vehicle_id: int, restock_data: VehicleRestock)`. 
   - Fetch the vehicle using the repository's `get_vehicle_by_id`.
   - If not found, raise a 404 `HTTPException`.
   - Add `restock_data.quantity` to the vehicle's current `quantity`.
   - Save the changes using the repository's `update_vehicle` method and return the updated vehicle.
3. **API Router (`app/api/vehicles.py`):** Implement the `POST /api/vehicles/{id}/restock` endpoint. 
   - Depend on `get_current_user` to ensure the route is protected.
   - Accept the `id` as a path parameter and `VehicleRestock` as the request body.
   - Call the `restock_vehicle` service method and return the result using `response_model=VehicleResponse`.

## REFACTOR : Review and Additional edge-case tests
Act as an expert Full-Stack Developer. Our vehicle restock test is passing, but we need to perform the "Refactor" step by adding robust input validation and edge-case testing.

Please review and refactor the Vehicle Restock implementation:

1. **Schema Validation (`app/schemas/vehicle.py`):** Update the `VehicleRestock` model so that `quantity` is strictly greater than 0 (e.g., using Pydantic's `Field(..., gt=0)`). 
2. **Test Suite - Invalid Input (`backend/tests/api/test_inventory.py`):** Add a test called `test_restock_vehicle_invalid_quantity`. Attempt to `POST` a restock with a quantity of 0 or a negative number. Assert the response status code is 422 Unprocessable Entity.
3. **Test Suite - Not Found:** Add a test called `test_restock_vehicle_not_found`. Use the `authorized_client` to send a restock request to an ID that does not exist (e.g., 9999). Assert that the response status code is 404 Not Found.
4. **Test Suite - Unauthorized:** Add a test called `test_restock_vehicle_unauthorized`. Use the unauthenticated `client` to send a restock request to an existing vehicle. Assert that the response status code is 401 Unauthorized.
5. Run the tests to ensure everything is green.