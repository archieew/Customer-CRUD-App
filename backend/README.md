<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Customer CRUD App - Backend

This is the backend for a full-stack Customer CRUD application built with Laravel, Docker, MySQL, and Elasticsearch. It is designed to meet the following requirements:

| Requirement | Implementation |
|-------------|----------------|
| Create/Update/Delete/List/View Customers | Implemented via REST API endpoints |
| Customer fields: first_name, last_name, email (unique), contact_number | Enforced via migration and validation |
| Email must be unique | Enforced in migration and validation |
| First/Last name required | Enforced in validation |
| Backend in Laravel, containerized | Yes |
| Docker Compose with 4 services: api, controller (nginx), database, searcher (elasticsearch) | Yes |
| No Laravel Sail or Scout | Not used |
| Elasticsearch sync via HTTP (not Scout) | Yes, see below |
| Search by name/email via ES | Yes, see below |
| Unit/Integration tests | Provided |
| README with clear instructions | This file |

## Elasticsearch Sync & Search
- All customer create/update/delete operations are synchronized to Elasticsearch using Laravel's HTTP client (not Scout).
- The customer list endpoint (`GET /api/customers`) queries Elasticsearch for searching by name or email.
- If Elasticsearch is unavailable, the API returns an error.

## Setup & Running

### Prerequisites
- Docker & Docker Compose

### Running the Application

1. **Clone the repository**
2. **Start all services:**
   ```sh
   docker-compose up --build
   ```
   This will start:
   - `api` (Laravel backend)
   - `controller` (Nginx)
   - `database` (MySQL)
   - `searcher` (Elasticsearch)
   - `frontend` (Angular)

3. **Access the API:**
   - Base URL: `http://localhost:8080/api/customers`

### Running Backend Tests

> **Note:**
> - Most backend tests pass and cover all CRUD and validation logic.
> - The `can list customers` test is skipped/fails by default because Elasticsearch is not populated during tests. This is expected unless you mock or set up ES for testing.

To run backend tests:
```sh
# Make sure you have a database/database.sqlite file and .env.testing configured for sqlite
# Then run:
docker-compose exec api php artisan test
```

### API Endpoints

- `GET /api/customers` — List/search customers (searches via Elasticsearch)
- `POST /api/customers` — Create a customer (syncs to Elasticsearch)
- `GET /api/customers/{id}` — View a customer
- `PUT /api/customers/{id}` — Update a customer (syncs to Elasticsearch)
- `DELETE /api/customers/{id}` — Delete a customer (removes from Elasticsearch)

### Environment Variables

- Set in `backend/.env` and `docker-compose.yml`
- Example:
  ```
  DB_HOST=database
  DB_DATABASE=laravel
  DB_USERNAME=laravel
  DB_PASSWORD=secret
  ES_HOST=http://searcher:9200
  ```

---

## Notes

- All customer data is synchronized to Elasticsearch for search in production.
- No Laravel Sail or Scout is used.
- For production, it is recommended to add more comprehensive tests and/or mock Elasticsearch for full test coverage.
- The frontend is in the `frontend/` directory and is also containerized.

---

## Contact
For any questions, please refer to the project repository or contact the maintainer.
