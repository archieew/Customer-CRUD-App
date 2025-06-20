# Customer CRUD Application

This is a simple CRUD (Create, Read, Update, Delete) application for managing customer records, built with a modern, containerized architecture using Docker.

## Features

-   Create, view, update, and delete customer records.
-   Search for customers by name or email.
-   All data is synchronized between a relational database and an Elasticsearch service for fast, fuzzy searching.

## Technical Stack

-   **Backend:** Laravel
-   **Frontend:** Angular (v20)
-   **Database:** MySQL 8.0
-   **Search:** Elasticsearch 8.11.1
-   **Web Server / Proxy:** Nginx
-   **Containerization:** Docker & Docker Compose

## Project Structure

The project is a monorepo containing two main packages:

-   `./backend/`: The Laravel REST API.
-   `./frontend/`: The Angular single-page application.

Docker services are defined in the root `docker-compose.yml` file and include:
-   `api`: The Laravel application container.
-   `frontend`: The Angular application container.
-   `controller`: An Nginx container that acts as a reverse proxy.
-   `database`: The MySQL database container.
-   `searcher`: The Elasticsearch container.

---

## Prerequisites

-   [Docker](https://www.docker.com/products/docker-desktop/) must be installed and running on your system.

---

## How to Run the Application

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/archieew/Customer-CRUD-App.git
    cd Customer-CRUD-App
    ```

2.  **Build and Start the Containers**
    This single command will build all the container images and start the services in the background. The services are configured with healthchecks to ensure they start in the correct order.

    ```sh
    docker compose up --build -d
    ```
    Please allow a few minutes for all the services to initialize, especially on the first run as Docker will download the necessary images.

3.  **Access the Application**
    Once the containers are running, the application will be available at:

    -   **Frontend UI**: [http://localhost:8080](http://localhost:8080)

    The Nginx `controller` service listens on port `8080` and intelligently routes traffic to the appropriate container (Angular frontend or Laravel API).

4.  **Stop the Application**
    To stop all running containers, run the following command from the project's root directory:
    ```sh
    docker compose down
    ```

---
*This project was developed with the assistance of an AI programming partner.* 