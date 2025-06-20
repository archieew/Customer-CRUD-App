# Customer CRUD App - Frontend

This is the frontend for the Customer CRUD application, built with Angular and Bootstrap. It connects to the backend API (Laravel) and supports full CRUD operations and search.

## Features
- List, create, update, delete, and view customers
- Search customers by name or email (powered by Elasticsearch)
- Responsive, modern UI using Bootstrap

## Running the Application

### Prerequisites
- Docker & Docker Compose (recommended)
- Or Node.js and Angular CLI (for local dev)

### With Docker (Recommended)
The frontend is started automatically with the main `docker-compose up --build` command from the project root. This will start all services (backend, frontend, database, searcher, controller).

- Access the frontend at: [http://localhost:4200](http://localhost:4200)

### Local Development (Optional)
If you want to run the frontend only:

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   ng serve
   ```
3. Open your browser to [http://localhost:4200](http://localhost:4200)

> **Note:** The frontend expects the backend API to be running at `http://localhost:8080/api/customers`.

## Running Unit Tests

To execute unit tests:
```sh
ng test
```

## Building for Production

To build the project:
```sh
ng build
```

## Project Structure
- `src/app/` — Main Angular app code
- `src/app/customer-list/` — Customer list/search UI
- `src/app/customer-form/` — Add/edit customer UI
- `src/app/customer-view/` — View customer details

## Backend
See the [backend README](../backend/README.md) for API and Docker setup.

---

## Contact
For any questions, please refer to the project repository or contact the maintainer.
